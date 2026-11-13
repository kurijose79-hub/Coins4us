import * as THREE from 'three';
import { RoomEnvironment } from './node_modules/three/examples/jsm/environments/RoomEnvironment.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const seg = (p, a, b) => clamp((p - a) / (b - a));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const vl = (a, b, t) => a.clone().lerp(b, t);
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

let CFG, renderer, scene, camera, out, octx, glc, world, curve, L, envName;
const cars = {}; let fireSprites = [], smokeSprites = [], sparkPts, fwPts, sprayS = [], people = [], flag, gantryLights = [], grid, hotelMat;

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const glowTex = () => canvasTex(128, 128, (g, w) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const fireTex = () => canvasTex(128, 128, (g, w) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,220,1)'); gr.addColorStop(0.25, 'rgba(255,200,60,0.9)'); gr.addColorStop(0.55, 'rgba(255,90,10,0.55)'); gr.addColorStop(1, 'rgba(120,10,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const smokeTex = () => canvasTex(128, 128, (g, w) => { for (let i = 0; i < 14; i++) { const x = 64 + (hash(i) - .5) * 50, y = 64 + (hash(i * 3) - .5) * 50, r = 25 + hash(i * 7) * 30; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); } });
const numberTex = (num, color, stroke) => canvasTex(256, 256, g => { g.font = 'bold 170px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 12; g.strokeStyle = stroke || '#000'; g.strokeText(String(num), 128, 140); g.fillStyle = color; g.fillText(String(num), 128, 140); });

// ---------------- environment ----------------
const ENVS = {
  bahrain: { sky: ['#03050f', '#141c3c', '#4a3a48'], fog: '#1a1d33', ground: '#4a3c2a', barrier: ['#1d4fa8', '#ffffff'], light: 1.0, night: true },
  abudhabi: { sky: ['#0b1030', '#4a3a6a', '#e88a5a'], fog: '#5a4560', ground: '#5e4c36', barrier: ['#ffffff', '#c8102e'], light: 1.1, night: true, hotel: true },
  retro: { sky: ['#6fa4d8', '#a9cbe8', '#dde9f0'], fog: '#cfdde6', ground: '#4f8a3a', barrier: ['#e8e2c8', '#c9b27a'], light: 1.6, night: false },
};
const TRACK = [[-260, 0], [-100, 0], [60, 0], [200, 0], [252, 16], [266, 62], [242, 112], [182, 132], [130, 116], [110, 82], [70, 68], [0, 92], [-80, 118], [-160, 128], [-240, 112], [-290, 68], [-296, 24]];
const HW = 7.5, BAR = 14;

function frameAt(s) { // s meters
  const u = ((s / L) % 1 + 1) % 1; const p = curve.getPointAt(u); const t = curve.getTangentAt(u).normalize();
  const n = V(-t.z, 0, t.x); // right side? check: t=(1,0,0) -> n=(0,0,1)
  return { p, t, n };
}
export function trackPt(s, lat, y = 0) { const f = frameAt(s); return f.p.clone().add(f.n.clone().multiplyScalar(lat)).setY(y); }
function nearestS(x, z) { let best = 0, bd = 1e9; for (let i = 0; i < 2000; i++) { const s = i / 2000 * L; const p = frameAt(s).p; const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd) { bd = d; best = s; } } return best; }

function buildTrack() {
  const E = ENVS[envName];
  curve = new THREE.CatmullRomCurve3(TRACK.map(([x, z]) => V(x, 0, z)), true, 'centripetal');
  L = curve.getLength();
  const N = 1400;
  const ribbon = (l0, l1, y, mat, vRep = 1) => {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N * L, f = frameAt(s);
      const a = f.p.clone().add(f.n.clone().multiplyScalar(l0)), b = f.p.clone().add(f.n.clone().multiplyScalar(l1));
      pos.push(a.x, y, a.z, b.x, y, b.z); uv.push(0, s / vRep, 1, s / vRep);
    }
    for (let i = 0; i < N; i++) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    mat.side = THREE.DoubleSide; const m = new THREE.Mesh(g, mat); world.add(m); return m;
  };
  const asphalt = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#3a3b3f'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { const c = 40 + hash(i) * 40; g.fillStyle = `rgb(${c},${c},${c + 4})`; g.fillRect(hash(i * 3) * w, hash(i * 5) * h, 2, 2); } g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, 8, h); g.fillRect(w - 8, 0, 8, h); g.fillStyle = 'rgba(20,20,20,0.35)'; g.fillRect(w * 0.42, 0, w * 0.16, h); });
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  ribbon(-HW, HW, 0.02, new THREE.MeshStandardMaterial({ map: asphalt, roughness: 0.85 }), 16);
  // kerbs red/white
  const kerb = canvasTex(64, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#d4141c' : '#f4f4f4'; g.fillRect(0, i * h / 8, w, h / 8); } });
  kerb.wrapS = kerb.wrapT = THREE.RepeatWrapping;
  const km = new THREE.MeshStandardMaterial({ map: kerb, roughness: 0.6 });
  ribbon(HW, HW + 1.3, 0.035, km, 8); ribbon(-HW - 1.3, -HW, 0.035, km, 8);
  // runoff
  const ro = new THREE.MeshStandardMaterial({ color: envName === 'retro' ? '#5a9442' : '#59606a', roughness: 0.9 });
  ribbon(HW + 1.3, BAR, 0.015, ro); ribbon(-BAR, -HW - 1.3, 0.015, ro);
  // barriers (vertical)
  const btex = canvasTex(512, 64, (g, w, h) => { g.fillStyle = E.barrier[0]; g.fillRect(0, 0, w, h); g.fillStyle = E.barrier[1]; for (let i = 0; i < 8; i++) if (i % 2) g.fillRect(i * w / 8, 0, w / 8, h); g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; if (envName !== 'retro') g.fillText('LEYENDAS DEL MOTOR', w / 2, h / 2); });
  btex.wrapS = btex.wrapT = THREE.RepeatWrapping;
  const wall = (lat) => {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) { const s = i / N * L, f = frameAt(s); const a = f.p.clone().add(f.n.clone().multiplyScalar(lat)); pos.push(a.x, 0, a.z, a.x, 1.2, a.z); uv.push(s / 24, 0, s / 24, 1); }
    for (let i = 0; i < N; i++) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    world.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: btex, roughness: 0.5, side: THREE.DoubleSide })));
    // catch fence
    if (envName !== 'retro') {
      const fp = [];
      for (let i = 0; i < N; i += 3) { const s = i / N * L, f = frameAt(s); const a = f.p.clone().add(f.n.clone().multiplyScalar(lat + Math.sign(lat) * 0.3)); fp.push(a.x, 1.2, a.z, a.x, 4.2, a.z); }
      for (let i = 0; i < N; i += 2) { const s0 = i / N * L, s1 = (i + 2) / N * L; for (const y of [2.2, 3.2, 4.2]) { const a = trackPt(s0, lat + Math.sign(lat) * 0.3), b = trackPt(s1, lat + Math.sign(lat) * 0.3); fp.push(a.x, y, a.z, b.x, y, b.z); } }
      const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
      world.add(new THREE.LineSegments(fg, new THREE.LineBasicMaterial({ color: '#9aa0a8', transparent: true, opacity: 0.5 })));
    }
  };
  wall(BAR); wall(-BAR);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshStandardMaterial({ color: E.ground, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; world.add(ground);
  // start line + grid boxes
  const s0 = 0 + nearestS(0, 0);
  CFG._s0 = s0;
  const chk = canvasTex(64, 512, (g, w, h) => { for (let y = 0; y < 16; y++) for (let x = 0; x < 2; x++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * 32, y * 32, 32, 32); } });
  const sl = new THREE.Mesh(new THREE.PlaneGeometry(1.2, HW * 2), new THREE.MeshBasicMaterial({ map: chk })); sl.rotation.x = -Math.PI / 2; sl.rotation.z = Math.PI / 2; const sp = trackPt(s0, 0, 0.03); sl.position.copy(sp); sl.rotation.set(-Math.PI / 2, 0, 0); world.add(sl);
  // gantry with 5 lights
  const gm = new THREE.MeshStandardMaterial({ color: '#2a2c30', roughness: 0.5, metalness: 0.5 });
  const gp = trackPt(s0 + 25, 0);
  const gan = new THREE.Group(); gan.position.copy(gp); gan.rotation.y = Math.atan2(frameAt(s0).t.x, frameAt(s0).t.z);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(2 * BAR, 0.8, 0.6), gm); beam.position.y = 7; gan.add(beam);
  for (const x of [-BAR, BAR]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7, 0.5), gm); post.position.set(x, 3.5, 0); gan.add(post); }
  const panel = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.4, 0.4), new THREE.MeshStandardMaterial({ color: '#111' })); panel.position.set(0, 5.9, -0.3); gan.add(panel);
  for (let i = 0; i < 5; i++) { const m = new THREE.MeshBasicMaterial({ color: '#300' }); for (const yy of [5.6, 6.15]) { const b = new THREE.Mesh(new THREE.CircleGeometry(0.22, 16), m); b.position.set(-2.2 + i * 1.1, yy, -0.52); b.rotation.y = Math.PI; gan.add(b); } gantryLights.push(m); }
  world.add(gan);
  // grandstand along main straight (left side = -n)
  const crowd = canvasTex(1024, 256, (g, w, h) => { g.fillStyle = '#1a1b20'; g.fillRect(0, 0, w, h); const cols = CFG.crowd || ['#d22', '#ddd', '#226', '#fc0']; for (let r = 0; r < 12; r++) for (let c = 0; c < 64; c++) { const k = r * 64 + c; g.fillStyle = hash(k) < .6 ? cols[k % cols.length] : ['#ccc', '#444', '#a33'][k % 3]; const x = c * 16 + 8, y = r * 21 + 12; g.fillRect(x - 5, y - 2, 10, 11); g.fillStyle = ['#e0b896', '#a87454', '#6b4430'][k % 3]; g.beginPath(); g.arc(x, y - 5, 4, 0, 7); g.fill(); } });
  crowd.wrapS = THREE.RepeatWrapping;
  for (const [sx, side] of [[-120, -1], [60, -1], [-30, 1]]) {
    const ss = nearestS(sx, 0); const f = frameAt(ss);
    const gs = new THREE.Group(); const c = f.p.clone().add(f.n.clone().multiplyScalar(side * (BAR + 9)));
    gs.position.copy(c); gs.rotation.y = Math.atan2(f.t.x, f.t.z) + (side > 0 ? Math.PI : 0);
    const len = 90; const ct = crowd.clone(); ct.needsUpdate = true; ct.repeat.set(len / 30, 1);
    const st = new THREE.Mesh(new THREE.PlaneGeometry(len, 18), new THREE.MeshLambertMaterial({ map: ct, side: THREE.DoubleSide }));
    st.rotation.x = -0.75; st.position.set(0, 6.5, 0); st.rotation.y = side > 0 ? 0 : 0; gs.add(st);
    st.rotation.set(-0.75, 0, 0); st.rotateY(Math.PI / 2 * 0);
    // orient plane so it faces track: plane normal +z, tilt back
    st.rotation.set(0, Math.PI / 2 * (side > 0 ? 1 : -1), 0); st.rotateX(-0.75);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, len), new THREE.MeshStandardMaterial({ color: '#d8d8d8' })); roof.position.set(-side * 4, 15, 0); gs.add(roof);
    world.add(gs);
  }
  // lights along track
  const glow = glowTex(); const lm = new THREE.SpriteMaterial({ map: glow, color: '#fff5dc', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  if (E.night) for (let i = 0; i < 70; i++) {
    const s = i / 70 * L, side = i % 2 ? 1 : -1, p = trackPt(s, side * (BAR + 4));
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 16), gm); pole.position.set(p.x, 8, p.z); world.add(pole);
    const sp2 = new THREE.Sprite(lm); sp2.position.set(p.x, 16.3, p.z); sp2.scale.set(7, 7, 1); world.add(sp2);
  }
  if (E.hotel) {
    const s = nearestS(-160, 128); const f = frameAt(s);
    hotelMat = new THREE.MeshBasicMaterial({ color: '#7a3cff' });
    const h = new THREE.Group(); h.position.copy(f.p); h.rotation.y = Math.atan2(f.t.x, f.t.z);
    for (const x of [-30, 30]) { const b = new THREE.Mesh(new THREE.BoxGeometry(22, 26, 40), new THREE.MeshStandardMaterial({ color: '#d9d4c8', roughness: 0.4 })); b.position.set(x, 13, 0); h.add(b); }
    const roof = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), hotelMat); roof.scale.set(50, 6, 34); roof.position.y = 27; h.add(roof);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 12), new THREE.MeshStandardMaterial({ color: '#cfcac0' })); bridge.position.y = 14; h.add(bridge);
    world.add(h);
  }
  // distant skyline/dunes
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * Math.PI * 2, r = 650 + hash(i) * 150;
    const b = new THREE.Mesh(new THREE.BoxGeometry(30 + hash(i * 2) * 40, 20 + hash(i * 3) * (envName === 'retro' ? 10 : 90), 30), new THREE.MeshLambertMaterial({ color: envName === 'retro' ? '#6c8f5a' : '#2b2a38' }));
    b.position.set(Math.cos(a) * r, b.geometry.parameters.height / 2, Math.sin(a) * r); world.add(b);
  }
}

// ---------------- cars ----------------
function M(color, o = {}) { return new THREE.MeshStandardMaterial({ color, roughness: o.r ?? 0.35, metalness: o.m ?? 0.3, ...(o.e ? { emissive: o.e } : {}) }); }
function box(w, h, d, mat, x, y, z, parent) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m; }
function makeWheel(r, w, compound, rimCol = '#3a3a3a') {
  const g = new THREE.Group(); const tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 28), M('#141414', { r: 0.8, m: 0 })); tire.rotation.z = Math.PI / 2; g.add(tire);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.62, r * 0.62, w + 0.01, 20), M(rimCol, { m: 0.8, r: 0.3 })); rim.rotation.z = Math.PI / 2; g.add(rim);
  if (compound) for (const s of [-1, 1]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.8, 0.018, 6, 32), new THREE.MeshBasicMaterial({ color: compound })); ring.rotation.y = Math.PI / 2; ring.position.x = s * (w / 2 + 0.005); g.add(ring); }
  // spoke marks for spin visibility
  const sp = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, r * 1.2, 0.05), M('#666', { m: 0.6 })); g.add(sp);
  return g;
}
function makeCar(id, era, liv) {
  const g = new THREE.Group(); const front = new THREE.Group(); const rear = new THREE.Group(); g.add(front, rear);
  const main = M(liv.main), acc = M(liv.accent || '#fff'), carbon = M('#151515', { r: 0.5 }), dark = M('#0a0a0a');
  const wheels = [];
  const helmetM = M(liv.helmet || '#ffd200', { r: 0.2, m: 0.4 });
  let halo = null;
  if (era === 'modern') {
    box(1.6, 0.05, 2.0, carbon, 0, 0.08, 0.7, front); box(1.6, 0.05, 1.8, carbon, 0, 0.08, -1.2, rear);
    box(0.75, 0.55, 2.3, main, 0, 0.45, 0.35, front);
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.32, 1.8, 14), main); nose.rotation.x = Math.PI / 2; nose.scale.set(1.4, 1, 0.55); nose.position.set(0, 0.36, 2.3); front.add(nose);
    box(1.95, 0.04, 0.45, acc, 0, 0.12, 3.0, front); const fw2 = box(1.85, 0.03, 0.25, acc, 0, 0.2, 2.85, front); fw2.rotation.x = 0.35;
    for (const s of [-1, 1]) box(0.03, 0.26, 0.55, main, s * 0.97, 0.2, 2.95, front);
    for (const s of [-1, 1]) { const sp = box(0.55, 0.45, 1.7, main, s * 0.62, 0.4, -0.1, front); sp.scale.set(1, 1, 1); box(0.5, 0.36, 0.05, dark, s * 0.62, 0.42, 0.76, front); }
    const ec = box(0.6, 0.5, 1.7, main, 0, 0.6, -1.25, rear); ec.rotation.x = 0.1;
    box(0.03, 0.42, 1.1, acc, 0, 0.98, -1.15, rear);
    box(0.32, 0.36, 0.5, main, 0, 1.0, -0.35, rear); box(0.24, 0.24, 0.05, dark, 0, 1.02, -0.09, rear);
    box(1.05, 0.05, 0.36, acc, 0, 0.98, -2.5, rear); const fl = box(1.05, 0.04, 0.22, acc, 0, 1.1, -2.42, rear); fl.rotation.x = 0.55;
    for (const s of [-1, 1]) box(0.03, 0.6, 0.65, main, s * 0.53, 0.82, -2.45, rear);
    box(0.08, 0.5, 0.1, carbon, 0, 0.7, -2.4, rear);
    box(0.12, 0.08, 0.04, new THREE.MeshBasicMaterial({ color: '#ff2020' }), 0, 0.42, -2.78, rear);
    const hel = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), helmetM); hel.position.set(0, 0.84, 0.2); front.add(hel);
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.172, 18, 12, -0.9, 1.8, 1.1, 0.5), M('#111', { r: 0.05, m: 0.9 })); visor.position.copy(hel.position); front.add(visor);
    halo = new THREE.Group(); const hm = M(liv.halo || '#1d1d1d', { m: 0.6, r: 0.3 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.035, 8, 28, Math.PI), hm); ring.rotation.x = -Math.PI / 2; ring.rotation.z = 0; ring.position.set(0, 0.98, 0.1); halo.add(ring);
    for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), hm); leg.position.set(s * 0.4, 0.82, 0.1); halo.add(leg); }
    const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.5), hm); pil.position.set(0, 0.8, 0.62); pil.rotation.x = -0.6; halo.add(pil);
    front.add(halo);
    const nt = numberTex(liv.num, '#fff', liv.main); const np = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: nt, transparent: true })); np.rotation.x = -Math.PI / 2 + 0.12; np.position.set(0, 0.87, -1.0); np.rotation.z = Math.PI; rear.add(np);
    const np2 = np.clone(); np2.position.set(0, 0.5, 1.95); np2.rotation.set(-Math.PI / 2 + 0.2, 0, 0); front.add(np2);
    const wf = [[0.85, 1.85, 0.34, 0.36, front], [-0.85, 1.85, 0.34, 0.36, front], [0.82, -1.75, 0.36, 0.44, rear], [-0.82, -1.75, 0.36, 0.44, rear]];
    for (const [x, z, r, w, par] of wf) { const wh = makeWheel(r, w, liv.tyre || '#ffd200'); wh.position.set(x, r, z); par.add(wh); wheels.push(wh); const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, Math.abs(x) - 0.3), carbon); arm.rotation.z = Math.PI / 2; arm.position.set(x / 2, r + 0.05, z); par.add(arm); }
  } else if (era === '1950') {
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 2.9, 8, 20), main); body.rotation.x = Math.PI / 2; body.scale.set(0.95, 1, 0.85); body.position.set(0, 0.62, 0); front.add(body);
    const grille = new THREE.Mesh(new THREE.CircleGeometry(0.26, 20), dark); grille.position.set(0, 0.6, 1.88); front.add(grille);
    const hel = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10, 0, Math.PI * 2, 0, Math.PI / 1.7), M('#6b4a2b', { r: 0.8, m: 0 })); hel.position.set(0, 1.12, -0.35); front.add(hel);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), M('#e0b896', { r: 0.7, m: 0 })); head.position.set(0, 1.07, -0.35); front.add(head);
    const goggles = box(0.24, 0.05, 0.05, M('#222'), 0, 1.09, -0.22, front);
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.25, 4, 8), M(liv.suit || '#d8d2c0', { r: 0.8, m: 0 })); torso.position.set(0, 0.88, -0.38); front.add(torso);
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.18), new THREE.MeshStandardMaterial({ color: '#cde', transparent: true, opacity: 0.4 })); ws.position.set(0, 1.0, 0.05); ws.rotation.x = -0.3; front.add(ws);
    const stw = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.015, 6, 20), M('#2a1a10')); stw.position.set(0, 0.95, -0.12); stw.rotation.x = -0.6; front.add(stw);
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.2, 10), M('#888', { m: 0.9, r: 0.3 })); ex.rotation.x = Math.PI / 2; ex.position.set(0.48, 0.45, -0.3); front.add(ex);
    const roundel = canvasTex(256, 256, g2 => { g2.fillStyle = '#fff'; g2.beginPath(); g2.arc(128, 128, 120, 0, 7); g2.fill(); g2.fillStyle = '#111'; g2.font = 'bold 150px DejaVu Sans'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(String(liv.num), 128, 138); });
    for (const s of [-1, 1]) { const rd = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: roundel, transparent: true })); rd.position.set(s * 0.41, 0.66, 0.3); rd.rotation.y = s * Math.PI / 2; front.add(rd); }
    for (const [x, z] of [[0.72, 1.35], [-0.72, 1.35], [0.72, -1.3], [-0.72, -1.3]]) { const wh = makeWheel(0.43, 0.17, null, '#c8c8c8'); wh.position.set(x, 0.43, z); (z > 0 ? front : rear).add(wh); wheels.push(wh); const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5), M('#333')); arm.rotation.z = Math.PI / 2; arm.position.set(x * 0.6, 0.5, z); front.add(arm); }
  } else if (era === '1970' || era === '1980') {
    const is70 = era === '1970';
    box(1.5, 0.08, 4.0, carbon, 0, 0.12, 0, front);
    const tub = box(0.8, 0.5, 3.0, main, 0, 0.42, 0.6, front); const nose = box(0.8, 0.25, 1.3, main, 0, 0.3, 2.4, front); nose.rotation.x = 0.12;
    box(1.9, 0.05, 0.6, acc, 0, 0.18, 2.9, front);
    for (const s of [-1, 1]) box(0.6, is70 ? 0.35 : 0.5, 1.9, main, s * 0.7, is70 ? 0.4 : 0.45, -0.2, front);
    if (is70) { box(0.5, 0.7, 0.6, acc, 0, 1.15, -0.5, rear); box(0.45, 0.3, 0.05, dark, 0, 1.25, -0.2, rear); }
    box(0.9, 0.55, 1.6, main, 0, 0.55, -1.4, rear);
    box(is70 ? 1.2 : 1.1, 0.06, 0.6, acc, 0, is70 ? 1.35 : 1.05, -2.3, rear);
    for (const s of [-1, 1]) box(0.04, 0.5, 0.7, main, s * (is70 ? 0.6 : 0.55), is70 ? 1.15 : 0.9, -2.3, rear);
    box(0.1, 0.8, 0.1, carbon, 0, 0.9, -2.2, rear);
    const hel = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), helmetM); hel.position.set(0, 0.88, 0.25); front.add(hel);
    const nt = numberTex(liv.num, '#111', '#fff'); const np = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.45), new THREE.MeshBasicMaterial({ map: nt, transparent: true })); np.position.set(0, 0.44, 2.5); np.rotation.x = -Math.PI / 2 + 0.12; front.add(np);
    const fr = is70 ? 0.33 : 0.32, rr2 = is70 ? 0.4 : 0.38;
    for (const [x, z, r, w] of [[0.85, 1.9, fr, 0.32], [-0.85, 1.9, fr, 0.32], [0.85, -1.7, rr2, 0.55], [-0.85, -1.7, rr2, 0.55]]) { const wh = makeWheel(r, w, null, '#bbb'); wh.position.set(x, r, z); (z > 0 ? front : rear).add(wh); wheels.push(wh); }
    if (!is70) { const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.3, 10), M('#777', { m: 0.9 })); tb.rotation.x = Math.PI / 2; tb.position.set(0, 0.4, -2.65); rear.add(tb); g.userData.exhaust = V(0, 0.4, -2.8); }
  } else if (era === 'sc') {
    box(1.9, 0.55, 4.6, M(liv.main, { m: 0.6, r: 0.25 }), 0, 0.55, 0, front);
    box(1.6, 0.5, 2.2, M('#0c0c10', { r: 0.1, m: 0.8 }), 0, 1.05, -0.3, front);
    const lb = new THREE.Group(); lb.position.set(0, 1.36, -0.2);
    const l1 = new THREE.MeshBasicMaterial({ color: '#ff9900' }), l2 = new THREE.MeshBasicMaterial({ color: '#ff9900' });
    box(0.55, 0.1, 0.22, l1, -0.3, 0, 0, lb); box(0.55, 0.1, 0.22, l2, 0.3, 0, 0, lb); front.add(lb); g.userData.lb = [l1, l2];
    for (const [x, z] of [[0.85, 1.4], [-0.85, 1.4], [0.85, -1.45], [-0.85, -1.45]]) { const wh = makeWheel(0.34, 0.3, null, '#999'); wh.position.set(x, 0.34, z); front.add(wh); wheels.push(wh); }
  }
  // shadow
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 5.8), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.45, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = 0.03; g.add(sh);
  g.visible = false; scene.add(g);
  const C = { id, g, front, rear, wheels, halo, era, liv, sh };
  cars[id] = C; return C;
}
function resetCar(C) { C.g.visible = false; C.g.rotation.set(0, 0, 0); C.front.position.set(0, 0, 0); C.front.rotation.set(0, 0, 0); C.rear.position.set(0, 0, 0); C.rear.rotation.set(0, 0, 0); C.sh.visible = true; }
function placeCar(C, s, lat, opts = {}) {
  const f = frameAt(s); const p = f.p.clone().add(f.n.clone().multiplyScalar(lat));
  C.g.visible = true; C.g.position.copy(p); C.g.position.y = opts.y || 0;
  C.g.rotation.set(opts.pitch || 0, Math.atan2(f.t.x, f.t.z) + (opts.yaw || 0), opts.roll || 0);
  const spin = (opts.dist ?? s) / 0.35;
  C.wheels.forEach((w, i) => { w.rotation.x = spin; if (i < 2) w.rotation.y = opts.steer || 0; });
  if (C.g.userData.lb) { const on = Math.floor((opts.t || 0) * 6) % 2; C.g.userData.lb[0].color.set(on ? '#ffb000' : '#3a2000'); C.g.userData.lb[1].color.set(on ? '#3a2000' : '#ffb000'); }
  return p;
}
function placeFree(C, pos, yaw, opts = {}) { C.g.visible = true; C.g.position.copy(pos); C.g.rotation.set(opts.pitch || 0, yaw, opts.roll || 0); C.wheels.forEach(w => w.rotation.x = (opts.dist || 0) / 0.35); }
function carDir(C) { return V(Math.sin(C.g.rotation.y), 0, Math.cos(C.g.rotation.y)); }

// people (driver walking, marshals, pit crew)
function makePerson(col, helmet) {
  const g = new THREE.Group(); const m = M(col, { r: 0.8, m: 0 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.5, 4, 10), m); body.position.y = 1.15; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), M(helmet || '#e0b896', { r: 0.3, m: 0.2 })); head.position.y = 1.72; g.add(head);
  const limbs = []; for (const [x, y, len, r] of [[0.11, 0.8, 0.75, 0.07], [-0.11, 0.8, 0.75, 0.07], [0.28, 1.45, 0.6, 0.05], [-0.28, 1.45, 0.6, 0.05]]) { const piv = new THREE.Group(); piv.position.set(x, y, 0); const l = new THREE.Mesh(new THREE.CapsuleGeometry(r, len - 2 * r, 3, 6), m); l.position.y = -len / 2; piv.add(l); g.add(piv); limbs.push(piv); }
  g.userData.limbs = limbs; g.visible = false; scene.add(g); people.push(g); return g;
}
function walk(P, ph, amt = 1) { const [a, b, c, d] = P.userData.limbs; const s = Math.sin(ph) * 0.6 * amt; a.rotation.x = s; b.rotation.x = -s; c.rotation.x = -s; d.rotation.x = s; P.children[0].position.y = 1.15 + Math.abs(Math.sin(ph)) * 0.04 * amt; }
function armsUpP(P, t) { const [, , c, d] = P.userData.limbs; c.rotation.x = Math.PI + Math.sin(t * 8) * 0.2; d.rotation.x = Math.PI + Math.sin(t * 8 + 1) * 0.2; c.rotation.z = 0.2; d.rotation.z = -0.2; }

// particles
function buildFX() {
  const ft = fireTex(), stx = smokeTex();
  for (let i = 0; i < 160; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: ft, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; scene.add(s); fireSprites.push(s); }
  for (let i = 0; i < 110; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: stx, color: '#333', depthWrite: false, transparent: true })); s.visible = false; scene.add(s); smokeSprites.push(s); }
  for (let i = 0; i < 70; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: stx, color: '#fff', depthWrite: false, transparent: true })); s.visible = false; scene.add(s); sprayS.push(s); }
  const sp = new Float32Array(600 * 3); const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sparkPts = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.25, map: glowTex(), color: '#ffcc66', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); sparkPts.visible = false; scene.add(sparkPts);
  const fp = new Float32Array(1500 * 3), fc = new Float32Array(1500 * 3); const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(fp, 3)); fg.setAttribute('color', new THREE.BufferAttribute(fc, 3));
  fwPts = new THREE.Points(fg, new THREE.PointsMaterial({ size: 2.2, map: glowTex(), vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); fwPts.visible = false; scene.add(fwPts);
  // flag
  const chk = canvasTex(256, 192, (g, w, h) => { for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * 32, y * 32, 32, 32); } });
  flag = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6, 20, 6), new THREE.MeshStandardMaterial({ map: chk, side: THREE.DoubleSide, roughness: 0.8 }));
  flag.geometry.userData.base = Float32Array.from(flag.geometry.attributes.position.array); flag.visible = false; scene.add(flag);
}
function fire(center, t, intensity = 1, radius = 2.5, height = 7) {
  const n = Math.floor(fireSprites.length * clamp(intensity));
  fireSprites.forEach((s, i) => {
    if (i >= n) { s.visible = false; return; }
    const life = 0.7 + hash(i) * 0.6; const age = ((t * 1.0 + hash(i * 3.3) * life) % life) / life;
    const a = hash(i * 5.1) * Math.PI * 2, r = hash(i * 7.3) * radius * (1 - age * 0.5);
    s.visible = true; s.position.set(center.x + Math.cos(a) * r + Math.sin(t * 3 + i) * 0.3, center.y + age * height * (0.6 + hash(i * 2.2) * 0.6), center.z + Math.sin(a) * r);
    const sc = (1.0 + hash(i * 9.9) * 2.0) * (1 - age * 0.4) * (0.6 + intensity * 0.5); s.scale.set(sc, sc * 1.4, 1);
    s.material.opacity = (1 - age) * 0.32; s.material.color.setHSL(0.06 - age * 0.05, 1, 0.5 - age * 0.2);
  });
}
function smoke(center, t, intensity = 1, height = 30, drift = V(3, 0, 1), color = '#2a2a2a', start = 0) {
  smokeSprites.forEach((s, i) => {
    if (i >= smokeSprites.length * clamp(intensity)) { s.visible = false; return; }
    const life = 3 + hash(i) * 2; const age = ((t + hash(i * 4.4) * life) % life) / life;
    if (t - start < age * life) { s.visible = false; return; }
    s.visible = true; s.material.color.set(color);
    s.position.set(center.x + drift.x * age * 6 + (hash(i * 6.6) - .5) * 4, center.y + 2 + age * height, center.z + drift.z * age * 6 + (hash(i * 8.1) - .5) * 4);
    const sc = 4 + age * 14; s.scale.set(sc, sc, 1); s.material.opacity = (1 - age) * 0.75;
  });
}
function hideFX() { fireSprites.forEach(s => s.visible = false); smokeSprites.forEach(s => s.visible = false); sprayS.forEach(s => s.visible = false); sparkPts.visible = false; fwPts.visible = false; flag.visible = false; people.forEach(p => { p.visible = false; p.rotation.set(0, 0, 0); p.userData.limbs.forEach(l => l.rotation.set(0, 0, 0)); }); }
function sparks(origin, dir, t, amt = 1) {
  sparkPts.visible = true; const a = sparkPts.geometry.attributes.position;
  for (let i = 0; i < a.count; i++) {
    if (hash(i) > amt) { a.setXYZ(i, 0, -100, 0); continue; }
    const life = 0.35 + hash(i * 2) * 0.4, age = ((t * 1.0 + hash(i * 3) * life) % life);
    const v = V(dir.x * (8 + hash(i * 4) * 20) + (hash(i * 5) - .5) * 8, 2 + hash(i * 6) * 5, dir.z * (8 + hash(i * 4) * 20) + (hash(i * 7) - .5) * 8);
    a.setXYZ(i, origin.x + v.x * age, Math.max(0.05, origin.y + v.y * age - 9.8 * age * age), origin.z + v.z * age);
  }
  a.needsUpdate = true;
}
function fireworks(t, center) {
  fwPts.visible = true; const a = fwPts.geometry.attributes.position, c = fwPts.geometry.attributes.color;
  const bursts = 10, per = a.count / bursts;
  for (let b = 0; b < bursts; b++) {
    const period = 1.6 + hash(b) * 0.8, age = ((t + hash(b * 3) * period) % period);
    const cx = center.x + (hash(b * 5 + Math.floor((t + hash(b * 3) * period) / period)) - .5) * 160, cy = 55 + hash(b * 7) * 40, cz = center.z + (hash(b * 9) - .5) * 160 - 60;
    const col = new THREE.Color().setHSL(hash(b * 11 + Math.floor(t / period)), 1, 0.6);
    for (let k = 0; k < per; k++) {
      const i = b * per + k; const th = hash(i) * Math.PI * 2, ph = Math.acos(2 * hash(i * 1.7) - 1), sp = 18 + hash(i * 2.9) * 6;
      const r = sp * Math.min(age, 1.2);
      a.setXYZ(i, cx + Math.sin(ph) * Math.cos(th) * r, cy + Math.cos(ph) * r - 4 * age * age, cz + Math.sin(ph) * Math.sin(th) * r);
      const f = clamp(1 - age / period * 1.1); c.setXYZ(i, col.r * f, col.g * f, col.b * f);
    }
  }
  a.needsUpdate = true; c.needsUpdate = true;
}
function waveFlag(pos, yaw, t) { flag.visible = true; flag.position.copy(pos); flag.rotation.set(0, yaw, Math.sin(t * 4) * 0.4); const a = flag.geometry.attributes.position, b = flag.geometry.userData.base; for (let i = 0; i < a.count; i++) { const x = b[i * 3]; a.setZ(i, Math.sin(x * 3 - t * 10) * 0.15 * (x + 1.2)); } a.needsUpdate = true; flag.geometry.computeVertexNormals(); }

// ---------------- init ----------------
async function init(cfg) {
  CFG = cfg; envName = cfg.env;
  glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false); renderer.setPixelRatio(1); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  scene = new THREE.Scene(); world = new THREE.Group(); scene.add(world);
  setEnv(envName);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 2000);
  buildTrack(); buildFX();
  for (const [id, era, liv] of CFG.cars) makeCar(id, era, liv);
  for (let i = 0; i < 16; i++) makePerson(i < 2 ? '#f2f2f2' : '#ff7a00', i < 2 ? '#222' : '#ffffff');
  grid = new THREE.GridHelper(60, 60, '#9cc8ff', '#4f7fc4'); grid.visible = false; scene.add(grid);
  out = document.createElement('canvas'); out.width = W; out.height = H; octx = out.getContext('2d'); document.body.appendChild(out);
  CFG.shots.forEach((s, k) => { s._t0 = k === 0 ? 0 : CFG.segs[k].start - 0.15; });
  CFG.shots.forEach((s, k) => { s._t1 = k < CFG.shots.length - 1 ? CFG.shots[k + 1]._t0 : CFG.total; });
  // resolve named locations
  CFG._loc = {}; for (const [k, [x, z]] of Object.entries(CFG.locs || {})) CFG._loc[k] = nearestS(x, z);
  await document.fonts.ready; return true;
}
let lights = [], curEnv = null; const envCache = {};
function setEnv(name) {
  const E = ENVS[name];
  if (!envCache[name]) envCache[name] = { sky: canvasTex(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, E.sky[0]); gr.addColorStop(0.55, E.sky[1]); gr.addColorStop(1, E.sky[2]); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), fog: new THREE.Fog(E.fog, 250, 900) };
  scene.background = envCache[name].sky; scene.fog = envCache[name].fog;
  if (curEnv === name) return; curEnv = name;
  lights.forEach(l => scene.remove(l));
  lights = [new THREE.HemisphereLight(E.night ? '#c8d4ff' : '#ffffff', E.night ? '#3a3020' : '#4a6a30', E.night ? 1.3 : 1.8)];
  const d = new THREE.DirectionalLight(E.night ? '#fff0d8' : '#fff6e6', E.night ? 2.0 : 2.8); d.position.set(60, 120, 40); lights.push(d);
  const d2 = new THREE.DirectionalLight('#9fb4ff', 0.8); d2.position.set(-80, 60, -50); lights.push(d2);
  lights.forEach(l => scene.add(l));
}

// ---------------- camera helpers ----------------
function setCam(pos, look, fov = 50) { camera.position.copy(pos); camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(look); }
function chase(C, back = 9, up = 2.6, ahead = 8, side = 0) {
  const d = carDir(C), r = V(d.z, 0, -d.x);
  const p = C.g.position.clone().add(d.clone().multiplyScalar(-back)).add(r.multiplyScalar(side)).setY(C.g.position.y + up);
  setCam(p, C.g.position.clone().add(d.multiplyScalar(ahead)).setY(0.8), 55);
}

// ---------------- shots ----------------
const SH = {};
const S = k => CFG._loc[k] ?? 0;
function pack(t, s0, v, n, opt = {}) { // pack of cars from list
  const ids = opt.ids || CFG.pack || [];
  ids.slice(0, n).forEach((id, i) => {
    const C = cars[id]; const row = Math.floor(i / 2); const lat = (i % 2 ? 1 : -1) * 2.6 + Math.sin(t * 0.8 + i) * 0.6;
    const s = s0 - row * (opt.gap ?? 11) - (i % 2) * 4 + v * t;
    placeCar(C, s, lat, { dist: s, t });
  });
}
SH.aerial = (o, p, lt) => {
  const s = S(o.at || 'start');
  const c = trackPt(s + (o.v ?? 60) * lt * 0.5, 0);
  if (o.pack) pack(lt, s + 30, o.v ?? 60, o.pack);
  if (o.cars) o.cars.forEach(([id, ds, lat], i) => placeCar(cars[id], s + ds + (o.v ?? 60) * lt, lat, { dist: s + ds + 60 * lt, t: lt }));
  const a = lerp(o.a0 ?? 0.6, o.a1 ?? 1.4, ease(p)), r = lerp(o.r0 ?? 220, o.r1 ?? 110, ease(p)), h = lerp(o.h0 ?? 140, o.h1 ?? 45, ease(p));
  const focus = o.pack || o.cars ? trackPt(s + 30 + (o.v ?? 60) * lt, 0) : c;
  setCam(focus.clone().add(V(Math.cos(a) * r, h, Math.sin(a) * r)), focus, 50);
};
SH.packChase = (o, p, lt) => {
  const s = S(o.at || 'start'); const v = o.v ?? 62;
  pack(lt, s, v, o.n ?? 20);
  const hero = cars[o.hero]; const hs = s - (o.heroRow ?? 6) * 11 + v * lt; let lat = lerp(o.lat0 ?? 2.6, o.lat1 ?? 6.5, ease(seg(p, 0.35, 0.8)));
  placeCar(hero, hs, lat, { dist: hs, t: lt, yaw: (o.lat1 ? 0.12 * Math.sin(seg(p, 0.35, 0.8) * Math.PI) : 0) });
  if (o.victim) { const V2 = cars[o.victim]; const vs = hs + 2.5 + (p > 0.6 ? -(p - 0.6) * 3 : 0); placeCar(V2, vs, lat + 1.9, { dist: vs, t: lt, yaw: p > 0.62 ? Math.sin((p - 0.62) * 30) * 0.08 : 0 }); }
  if (o.touchAt && p > o.touchAt && p < o.touchAt + 0.15) sparks(hero.g.position.clone().add(V(0, 0.4, 0)), V(1, 0, 0), lt, 0.8);
  const cmode = o.cam || 'chase';
  if (cmode === 'chase') chase(hero, lerp(10, 7, p), 2.4, 10, -1.5);
  else { const f = frameAt(hs + 12); const cp = f.p.clone().add(f.n.clone().multiplyScalar(-11)).setY(1.2); setCam(cp, hero.g.position.clone().setY(0.6), 48); }
};
SH.crash = (o, p, lt, D) => {
  // hero veers right and hits barrier at lat BAR; car splits; fireball
  const C = cars[o.hero]; const sImp = S(o.at || 'crash');
  const tImp = o.tImp ?? 0.4; const v = o.v ?? 61;
  const tl = (p - tImp) * D * (o.slow ?? 0.5); // seconds relative to impact (slow-mo)
  const impPt = trackPt(sImp, BAR - 0.2);
  if (p < tImp || o.pre) {
    const sx = sImp + tl * v; const lat = lerp(4, BAR - 1.4, clamp(1 + tl / 0.9));
    placeCar(C, sx, lat, { dist: sx, t: lt, yaw: 0.45 * clamp(1 + tl / 0.9) });
  } else {
    // post impact: front embedded at barrier, rear thrown back
    const f = frameAt(sImp); const yaw = Math.atan2(f.t.x, f.t.z) + 0.6;
    placeFree(C, impPt.clone().add(f.t.clone().multiplyScalar(-1.2)), yaw, { pitch: 0, roll: 0.25 });
    const q = clamp(tl / 1.2);
    C.front.position.set(0, 0.25 * Math.sin(q * Math.PI) , 0.5 * easeOut(q)); C.front.rotation.set(-0.15 * q, 0, 0.35 * easeOut(q));
    C.rear.position.set(lerp(0, -6, easeOut(q)), Math.sin(q * Math.PI) * 1.6 + 0.0, lerp(0, -9, easeOut(q))); C.rear.rotation.set(0, lerp(0, 2.6, easeOut(q)), Math.sin(q * Math.PI) * 0.6);
    C.sh.visible = false;
    if (o.burnt) { C.front.traverse(m => { if (m.material && m.material.color && !m.userData.b) { m.userData.b = 1; m.material = m.material.clone(); m.material.color.multiplyScalar(0.25); } }); }
    const fi = clamp(tl * 3) * (o.fireLevel ?? 1);
    fire(impPt.clone().add(V(0, 0, 0)), lt, fi, 3 + q * 2, 8 + clamp(tl) * 6);
    smoke(impPt, lt, clamp(tl * 0.8), 40, V(1, 0, 0.5), '#2a2a2a');
    if (tl < 0.5) sparks(impPt.clone().add(V(0, 0.6, 0)), f.t.clone().multiplyScalar(-1), lt, 1);
  }
  if (o.othersPass) pack(lt, sImp - 140, 55, 8, { ids: CFG.pack.slice(0, 8) });
  // camera
  const cm = o.cam || 'side';
  if (cm === 'side') { const f = frameAt(sImp - 8); const cp = f.p.clone().add(f.n.clone().multiplyScalar(-10)).setY(2.0); setCam(cp.add(V(0, 0, 0)), p < tImp ? C.g.position.clone().setY(0.6) : impPt.clone().setY(2.0), 46); }
  else if (cm === 'heli') { const a = lerp(o.a0 ?? 2.2, o.a1 ?? 2.8, p); const r = lerp(40, 30, p); setCam(impPt.clone().add(V(Math.cos(a) * r, lerp(30, 20, p), Math.sin(a) * r)), impPt.clone().setY(3), 50); }
  else if (cm === 'close') { const f = frameAt(sImp); const a = lerp(o.a0 ?? -0.6, o.a1 ?? 0.2, ease(p)); const base = impPt.clone().add(f.n.clone().multiplyScalar(-2)); const cp = base.clone().add(f.t.clone().multiplyScalar(-Math.cos(a) * 15)).add(f.n.clone().multiplyScalar(-Math.sin(a) * 6 - 9)).setY(lerp(4.5, 3.0, p)); setCam(cp, base.clone().setY(1.2), 44); }
  else if (cm === 'chase') chase(C, 9, 2.5, 8, -2);
  // driver emerges
  if (o.driverOut) {
    const P = people[0]; const f = frameAt(sImp); P.visible = true;
    const q = seg(p, o.driverOut, o.driverOut + 0.5);
    const from = impPt.clone().add(f.n.clone().multiplyScalar(-0.5)), to = impPt.clone().add(f.n.clone().multiplyScalar(-8)).add(f.t.clone().multiplyScalar(-2));
    P.position.copy(vl(from, to, easeOut(q))); P.position.y = q < 0.3 ? Math.sin(q / 0.3 * Math.PI) * 0.9 + 0.3 * (1 - q / 0.3) : 0;
    P.rotation.y = Math.atan2(to.x - from.x, to.z - from.z); walk(P, lt * 9, q < 1 ? 1 : 0.2);
    for (let k = 0; k < 3; k++) { const Mm = people[2 + k]; Mm.visible = true; const mp = to.clone().add(f.t.clone().multiplyScalar(-3 + k * 3)).add(f.n.clone().multiplyScalar(-2 - k)); Mm.position.copy(vl(mp.clone().add(f.n.clone().multiplyScalar(-8)), mp, seg(p, 0, 0.5))); Mm.rotation.y = Math.atan2(impPt.x - mp.x, impPt.z - mp.z); walk(Mm, lt * 8, 1 - seg(p, 0.45, 0.5)); }
    // extinguisher spray
    const nz = people[2].position.clone().add(V(0, 1.2, 0));
    sprayS.forEach((s, i) => { const age = ((lt * 1.2 + hash(i) ) % 1); s.visible = p > 0.2; s.position.copy(vl(nz, impPt.clone().setY(1.5), age)).add(V((hash(i * 3) - .5) * age * 3, age * 1.5, (hash(i * 5) - .5) * age * 3)); const sc = 0.5 + age * 3; s.scale.set(sc, sc, 1); s.material.opacity = (1 - age) * 0.6; });
  }
};
SH.halo = (o, p, lt) => {
  // studio showcase: grid floor, hide world, car rotating, halo glowing
  world.visible = false; scene.background = new THREE.Color(o.bg || '#0a0d18'); scene.fog = null; grid.visible = true; grid.position.set(0, 0, 0);
  const C = cars[o.car]; placeFree(C, V(0, 0, 0), lt * 0.4 + 0.8);
  if (C.halo) C.halo.traverse(m => { if (m.material) { m.material.emissive = new THREE.Color(o.glow || '#ffcc00'); m.material.emissiveIntensity = 0.6 + 0.5 * Math.sin(lt * 6); } });
  const a = lerp(0.5, 1.1, p), r = lerp(13, 10, ease(p));
  setCam(V(Math.cos(a) * r, lerp(3.4, 2.6, p), Math.sin(a) * r), V(0, 0.7, 0.2), 40);
};
SH.blueprint = (o, p, lt) => {
  world.visible = false; scene.background = new THREE.Color('#0b3a8c'); scene.fog = null; grid.visible = true;
  scene.overrideMaterial = scene.userData.wire || (scene.userData.wire = new THREE.MeshBasicMaterial({ color: '#d8ecff', wireframe: true }));
  const C = cars[o.car]; placeFree(C, V(0, 0, 0), lt * 0.5);
  setCam(V(Math.cos(0.7) * 7, 3.2, Math.sin(0.7) * 7), V(0, 0.5, 0), 40);
};
SH.orbitCar = (o, p, lt) => {
  const s = S(o.at || 'start'); const C = cars[o.swapAt != null && p > o.swapAt ? o.car2 : o.car];
  const pos = placeCar(C, s, o.lat ?? 0, { dist: s, t: lt });
  if (C.g.userData.exhaust) fire(C.g.localToWorld(C.g.userData.exhaust.clone()), lt, 0.12, 0.08, 0.5);
  if (o.others) o.others.forEach(([id, ds, lat]) => placeCar(cars[id], s + ds, lat, { dist: s, t: lt }));
  const yaw = C.g.rotation.y; const a = yaw + lerp(o.a0 ?? 0.6, o.a1 ?? 1.8, ease(p)); const r = lerp(o.r0 ?? 7, o.r1 ?? 5, ease(p));
  setCam(pos.clone().add(V(Math.sin(a) * r, lerp(o.h0 ?? 1.8, o.h1 ?? 1.2, p), Math.cos(a) * r)), pos.clone().setY(0.6), o.fov ?? 42);
  if (o.callouts) CFG._callouts = o.callouts.map(([txt, x, y, z, at]) => ({ txt, w: C.g.localToWorld(V(x, y, z)), on: p > at, k: clamp((p - at) * 6) }));
};
SH.lineupGrid = (o, p, lt) => {
  // static cars on grid / start straight; tracking camera
  const s = S(o.at || 'start');
  o.cars.forEach(([id, ds, lat], i) => placeCar(cars[id], s + ds, lat, { dist: 0, t: lt }));
  if (o.lights != null) { const n = Math.floor(seg(p, 0, o.lights) * 5.99); gantryLights.forEach((m, i) => m.color.set(p > (o.lightsOut ?? 2) ? '#300' : (i < n ? '#ff1a1a' : '#300'))); }
  const x0 = o.x0 ?? -20, x1 = o.x1 ?? 10;
  const cs = s + lerp(x0, x1, ease(p)); const f = frameAt(cs);
  const cp = f.p.clone().add(f.n.clone().multiplyScalar(o.side ?? -9)).setY(o.h ?? 1.6);
  setCam(cp, frameAt(cs + (o.lookAhead ?? 6)).p.clone().setY(0.7), o.fov ?? 46);
  if (o.callouts) CFG._callouts = o.callouts.map(([txt, id, at]) => ({ txt, w: cars[id].g.position.clone().setY(2.2), on: p > at, k: clamp((p - at) * 6) }));
};
SH.race = (o, p, lt, D) => {
  // generic: list of cars with s(t)= s0+v*t and lat functions; cam modes
  const s = S(o.at || 'start');
  const pos = {};
  o.cars.forEach(([id, ds, lat, v, lat2, latAt]) => {
    const vv = typeof v === 'function' ? v : null;
    const ss = s + ds + (vv ? vv(p) * D : (v ?? 60) * lt);
    const ll = lat2 != null ? lerp(lat, lat2, ease(seg(p, latAt?.[0] ?? 0.2, latAt?.[1] ?? 0.6))) : lat;
    pos[id] = placeCar(cars[id], ss, ll, { dist: ss, t: lt, steer: lat2 != null ? (lat2 - lat) * 0.02 * Math.sin(seg(p, latAt?.[0] ?? 0.2, latAt?.[1] ?? 0.6) * Math.PI) : 0, yaw: lat2 != null ? (lat2 - lat) * 0.012 * Math.sin(seg(p, latAt?.[0] ?? 0.2, latAt?.[1] ?? 0.6) * Math.PI) : 0 });
  });
  if (o.pit) {
    // pit stop: car stopped, crew around, wheels off/on
    const C = cars[o.pit]; const ps = s + 0; const st = seg(p, 0.15, 0.25), go = seg(p, 0.7, 1);
    const ss = ps - (1 - st) * 25 + easeIn(go) * 40;
    placeCar(C, ss, 0, { dist: ss, t: lt });
    const wOff = Math.sin(seg(p, 0.3, 0.62) * Math.PI) * 0.9;
    C.wheels.forEach((w, i) => { w.position.x = Math.sign(w.position.x) * (Math.abs(w.userData.x0 ??= Math.abs(w.position.x)) + wOff); });
    const crew = [[1.9, 1.85], [-1.9, 1.85], [1.9, -1.75], [-1.9, -1.75], [2.6, 1.85], [-2.6, 1.85], [2.6, -1.75], [-2.6, -1.75], [0, 3.6], [0, -3.4]];
    const yaw = C.g.rotation.y; const fw = V(Math.sin(yaw), 0, Math.cos(yaw)), rt = V(fw.z, 0, -fw.x);
    crew.forEach(([x, z], k) => { const P = people[2 + k]; P.visible = true; const base = trackPt(ps, 0).add(rt.clone().multiplyScalar(-x)).add(fw.clone().multiplyScalar(z)); P.position.copy(base); P.rotation.y = Math.atan2(-base.x + trackPt(ps, 0).x, -base.z + trackPt(ps, 0).z); P.children[0].material.color.set(o.crewCol || '#1e2a5a'); if (p > 0.72) armsUpP(P, lt); else { const [a, b, c, d] = P.userData.limbs; c.rotation.x = -1.2; d.rotation.x = -1.2; a.rotation.x = -0.6; b.rotation.x = 0.4; P.children[0].position.y = 0.95; } });
  }
  if (o.sc) { const sc = cars[o.sc[0]]; const ss = s + o.sc[1] + (o.sc[2] ?? 30) * lt; placeCar(sc, ss, o.sc[3] ?? 0, { dist: ss, t: lt }); pos[o.sc[0]] = sc.g.position.clone(); }
  if (o.crashCar) {
    const C = cars[o.crashCar]; const q = seg(p, o.crashAt ?? 0.3, (o.crashAt ?? 0.3) + 0.25);
    const ss = s + (o.crashDs ?? 30) + 50 * lt * (1 - q * 0.7); const lat = lerp(3, -BAR + 1.3, easeOut(q));
    placeCar(C, ss, lat, { dist: ss, t: lt, yaw: -0.5 * Math.sin(q * Math.PI) - (q >= 1 ? 0.4 : 0), roll: q >= 1 ? 0.05 : 0 });
    if (q > 0.85 && q < 1) sparks(C.g.position.clone().add(V(0, 0.5, 0)), V(0, 0, -1), lt, 1);
    if (q >= 1) { C.front.rotation.y = 0.2; smoke(C.g.position, lt, 0.4, 12, V(1, 0, 0), '#777'); }
  }
  if (o.flagAt) { const fp = trackPt(S(o.flagAt), -BAR + 1, 3.5); waveFlag(fp, frameAt(S(o.flagAt)).t.x > 0 ? 0 : Math.PI, lt); }
  if (o.lights != null) gantryLights.forEach(m => m.color.set('#300'));
  // camera
  const tgt = cars[o.focus]; const cm = o.cam || 'chase';
  if (cm === 'chase') chase(tgt, o.back ?? 8.5, o.up ?? 2.3, 10, o.side ?? 0);
  else if (cm === 'heli') { const c = tgt.g.position; const d = carDir(tgt); setCam(c.clone().add(d.clone().multiplyScalar(-30)).add(V(-15, 28, 10)), c.clone().add(d.multiplyScalar(10)), 45); }
  else if (cm === 'trackside') { const f = frameAt(S(o.camAt)); const cp = f.p.clone().add(f.n.clone().multiplyScalar(o.camLat ?? -12)).setY(o.camH ?? 2); setCam(cp, tgt.g.position.clone().setY(0.8), o.fov ?? 40); }
  else if (cm === 'pit') { const c = cars[o.pit].g.position; const a = lerp(0.8, 1.6, p); setCam(c.clone().add(V(Math.cos(a) * 15, 6, Math.sin(a) * 15)), c.clone().setY(0.6), 42); }
  else if (cm === 'front') { const d = carDir(tgt); setCam(tgt.g.position.clone().add(d.clone().multiplyScalar(14)).add(V(2.5, 1.2, 0)), tgt.g.position.clone().setY(0.6), 40); }
};
SH.donuts = (o, p, lt) => {
  const s = S(o.at || 'start'); const c = trackPt(s, 0); const C = cars[o.car];
  const a = lt * 3.2; const pos = c.clone().add(V(Math.cos(a) * 3, 0, Math.sin(a) * 3));
  placeFree(C, pos, -a + Math.PI * 0.85, { dist: lt * 40 });
  smoke(c, lt, 0.45, 8, V(0.5, 0, 0.2), '#9a9a9a');
  fireworks(lt, c);
  const ca = lerp(0.4, 1.4, p); setCam(c.clone().add(V(Math.cos(ca) * 18, lerp(3.5, 5, p), Math.sin(ca) * 18)), c.clone().setY(9), 52);
};
SH.launch = (o, p, lt, D) => {
  const s = S(o.at || 'start'); const C = cars[o.car];
  const tGo = o.go ?? 0.25; const tt = Math.max(0, (p - tGo) * D);
  const acc = 11; const ds = 0.5 * acc * tt * tt;
  const ss = s + ds; placeCar(C, ss, 0, { dist: ss, t: lt, pitch: -0.02 * clamp(tt) });
  if (tt > 0 && tt < 1.2) sparks(C.g.position.clone().add(V(0, 0.05, 0)).sub(carDir(C).multiplyScalar(2.5)), carDir(C).multiplyScalar(-1), lt, 0.3);
  if (o.lights) { const n = Math.floor(seg(p, 0, tGo * 0.9) * 5.99); gantryLights.forEach((m, i) => m.color.set(p >= tGo ? '#300' : (i < n ? '#ff1a1a' : '#300'))); }
  const d = carDir(C);
  if (p < tGo) setCam(C.g.position.clone().add(d.clone().multiplyScalar(6)).add(V(2.5, 0.6, 1.5)), C.g.position.clone().setY(0.5), 46);
  else { const back = lerp(6, 10, seg(p, tGo, 1)); setCam(C.g.position.clone().add(d.clone().multiplyScalar(-back)).add(V(0, 1.2, 0)).add(V(d.z, 0, -d.x).multiplyScalar(1.5)), C.g.position.clone().add(d.multiplyScalar(20)).setY(0.6), lerp(48, 65, seg(p, tGo, 1))); }
  CFG._speed = tt > 0 ? Math.min(100, Math.round(acc * tt * 3.6)) : 0;
};
SH.crowdStand = (o, p, lt) => {
  const s = S(o.at || 'start'); const f = frameAt(s);
  const x = lerp(-30, 30, p); const base = trackPt(s + x, 0);
  setCam(base.clone().add(f.n.clone().multiplyScalar(6)).setY(2.2), trackPt(s + x + 4, -(BAR + 14), 7), 50);
  if (o.cars) o.cars.forEach(([id, ds, lat, v]) => { const ss = s + ds + (v ?? 50) * lt; placeCar(cars[id], ss, lat, { dist: ss, t: lt }); });
};
SH.outro = (o, p, lt) => {
  const s = S(o.at || 'start'); const c = trackPt(s, 0);
  if (o.cars) o.cars.forEach(([id, ds, lat]) => placeCar(cars[id], s + ds, lat, { dist: 0, t: lt }));
  if (o.pack) pack(lt, s, 55, o.pack);
  const a = lerp(0.8, 1.5, p), r = lerp(o.r0 ?? 30, o.r1 ?? 60, ease(p));
  setCam(c.clone().add(V(Math.cos(a) * r, lerp(o.h0 ?? 8, o.h1 ?? 30, ease(p)), Math.sin(a) * r)), c.clone().setY(1), 50);
  if (o.callouts) CFG._callouts = o.callouts.map(([txt, id]) => ({ txt, w: cars[id].g.position.clone().setY(2.2), on: true, k: clamp(p * 4) }));
};

// ---------------- overlay ----------------
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function fitFont(g, txt, max, size) { let s = size; g.font = `bold ${s}px DejaVu Sans`; while (g.measureText(txt).width > max && s > 20) { s -= 4; g.font = `bold ${s}px DejaVu Sans`; } return s; }
function isSeq(v) { return Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && v[0].length === 2 && typeof v[0][1] !== 'number'; }
function startOf(v, p) { if (!isSeq(v)) return 0; let r = 0; for (const [pp] of v) if (p >= pp) r = pp; return r; }
function valAt(v, p) { if (v == null) return null; if (isSeq(v)) { let r = v[0][1]; for (const [pp, val] of v) if (p >= pp) r = val; return r; } return v; }

function drawTop(g, sh, p) {
  const x = 90, y = 190, w = 900, h = 86;
  const accent = CFG.accent || '#e10600';
  g.save(); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 20;
  rr(g, x, y, w, h, 16); g.fillStyle = 'rgba(12,12,18,0.9)'; g.fill(); g.shadowBlur = 0;
  rr(g, x, y, 16, h, 8); g.fillStyle = accent; g.fill();
  g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.textAlign = 'left';
  const lap = valAt(sh.lap, p) || ''; fitFont(g, lap, 420, 40); g.fillText(lap, x + 40, y + h / 2 + 2);
  const fl = valAt(sh.flag, p);
  if (fl) {
    const cols = { VERDE: '#1db954', AMARILLA: '#ffd400', ROJA: '#e10600', SC: '#ffb000', META: '#ffffff' };
    const txt = fl === 'SC' ? 'SAFETY CAR' : fl === 'META' ? 'BANDERA A CUADROS' : 'BANDERA ' + fl;
    g.font = 'bold 30px DejaVu Sans'; const tw = g.measureText(txt).width + 40; const bx = x + w - tw - 20;
    const blink = fl === 'ROJA' || fl === 'SC' ? (Math.floor(p * 40) % 2 ? 1 : 0.55) : 1;
    g.globalAlpha = blink; rr(g, bx, y + 18, tw, h - 36, 10); g.fillStyle = cols[fl] || '#fff'; g.fill(); g.globalAlpha = 1;
    g.fillStyle = fl === 'ROJA' ? '#fff' : '#111'; g.textAlign = 'center'; g.fillText(txt, bx + tw / 2, y + h / 2 + 1);
  }
  g.font = 'bold 28px DejaVu Sans'; g.fillStyle = 'rgba(255,255,255,0.9)'; g.textAlign = 'center'; g.fillText(CFG.label, W / 2, y - 26);
  const tower = valAt(sh.tower, p);
  if (tower) {
    let ty = y + h + 14;
    tower.forEach(([pos, abbr, col, gap], i) => {
      rr(g, x, ty, 360, 58, 10); g.fillStyle = 'rgba(12,12,18,0.85)'; g.fill();
      g.fillStyle = '#fff'; g.font = 'bold 32px DejaVu Sans'; g.textAlign = 'left'; g.fillText(String(pos), x + 18, ty + 30);
      g.fillStyle = col; g.fillRect(x + 58, ty + 12, 8, 34);
      g.fillStyle = '#fff'; g.fillText(abbr, x + 80, ty + 30);
      g.textAlign = 'right'; g.font = 'bold 28px DejaVu Sans'; g.fillStyle = '#cfd3da'; g.fillText(gap || '', x + 345, ty + 30);
      ty += 66;
    });
  }
  g.restore();
}
function drawCaption(g, segI, t) {
  const S2 = CFG.segs[segI]; if (!S2) return;
  const words = S2.text.split(/\s+/).filter(Boolean); const span = Math.max(0.5, S2.end - S2.start);
  const lens = words.map(w => w.length + 1.5), tot = lens.reduce((a, b) => a + b, 0);
  let acc = 0; const wt = lens.map(l => { const s = S2.start + acc / tot * span; acc += l; return s; });
  const chunks = []; let cur = [];
  words.forEach((w, i) => { const len = cur.reduce((a, k) => a + words[k].length + 1, 0) + w.length; if (cur.length && (len > 17 || /[.,:!?…]$/.test(words[cur[cur.length - 1]]))) { chunks.push(cur); cur = []; } cur.push(i); });
  if (cur.length) chunks.push(cur);
  let ci = 0; for (let k = 0; k < chunks.length; k++) if (t >= wt[chunks[k][0]] - 0.05) ci = k;
  if (t < S2.start - 0.2) return;
  const ch = chunks[ci]; const st = wt[ch[0]]; const pop = clamp((t - st + 0.05) / 0.12); const sc = 0.85 + 0.15 * easeOut(pop);
  g.save(); g.translate(W / 2, 1240); g.scale(sc, sc);
  const txts = ch.map(i => words[i].toUpperCase()); let fs = 92; g.font = `bold ${fs}px DejaVu Sans`; const sp = 24;
  let tw = txts.reduce((a, s) => a + g.measureText(s).width, 0) + sp * (txts.length - 1);
  while (tw > 960 && fs > 50) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; tw = txts.reduce((a, s) => a + g.measureText(s).width, 0) + sp * (txts.length - 1); }
  let x = -tw / 2; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineJoin = 'round';
  txts.forEach((s, k) => { const i = ch[k]; const active = t >= wt[i] && (i === words.length - 1 || t < wt[i + 1]); const w = g.measureText(s).width; g.lineWidth = 16; g.strokeStyle = 'rgba(0,0,0,0.9)'; g.strokeText(s, x, 0); g.fillStyle = active ? (CFG.hl || '#ffd400') : '#fff'; g.fillText(s, x, 0); x += w + sp; });
  g.restore();
}
function drawBig(g, sh, p, D) {
  let big = valAt(sh.big, p); if (!big) return;
  if (big.includes('{speed}')) big = big.replace('{speed}', CFG._speed ?? 0);
  const a = clamp((p - startOf(sh.big, p)) * D / 0.25); const k = easeOut(a); const s = lerp(1.8, 1, k);
  g.save(); g.globalAlpha = k; g.translate(W / 2, sh.bigY ?? 760); g.scale(s, s); g.rotate(-0.04);
  big.split('\n').forEach((ln, i) => {
    const fs = fitFont(g, ln, 980, i === 0 ? (sh.bigSize ?? 160) : 76); const yy = i === 0 ? 0 : 40 + (i - 1) * 90 + 50;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(ln, 0, yy);
    const gr = g.createLinearGradient(0, yy - fs / 2, 0, yy + fs / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, CFG.bigCol || '#ff3b30'); gr.addColorStop(1, CFG.bigCol2 || '#b30000');
    g.fillStyle = i === 0 ? gr : '#fff'; g.fillText(ln, 0, yy);
  });
  g.restore();
}
function drawCallouts(g) {
  if (!CFG._callouts) return;
  for (const c of CFG._callouts) {
    if (!c.on) continue; const v = c.w.clone().project(camera); if (v.z > 1) continue;
    const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H; const lx = sx + (sx < W / 2 ? -1 : 1) * 0, ly = sy - 170;
    g.save(); g.globalAlpha = c.k; g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(sx, sy, 10, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(sx, sy - 10); g.lineTo(lx, ly + 30); g.stroke();
    g.font = 'bold 40px DejaVu Sans'; const tw = g.measureText(c.txt).width + 36; const bx = clamp(lx - tw / 2, 20, W - tw - 20);
    rr(g, bx, ly - 30, tw, 62, 12); g.fillStyle = CFG.accent || '#e10600'; g.fill();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(c.txt, bx + tw / 2, ly + 2); g.restore();
  }
}
function drawOutro(g, p, q) {
  const k = easeOut(clamp(p * 2.5)); g.save(); g.globalAlpha = k; g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 0, W, H);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.translate(W / 2, 640);
  if (q) { const fs = fitFont(g, q, 960, 96); g.lineWidth = 18; g.strokeStyle = '#000'; g.strokeText(q, 0, 0); g.fillStyle = '#fff'; g.fillText(q, 0, 0);
    g.font = 'bold 60px DejaVu Sans'; g.lineWidth = 12; g.strokeText('COMENTA ↓', 0, 110); g.fillStyle = CFG.hl || '#ffd400'; g.fillText('COMENTA ↓', 0, 110); }
  const s2 = lerp(1.4, 1, k); g.translate(0, 330); g.scale(s2, s2);
  g.font = 'bold 110px DejaVu Sans'; g.lineWidth = 18; g.strokeStyle = '#000'; g.strokeText('SÍGUENOS', 0, 0); g.fillStyle = CFG.accent || '#e10600'; g.fillText('SÍGUENOS', 0, 0);
  g.font = 'bold 48px DejaVu Sans'; g.lineWidth = 12; g.strokeText('+ LEYENDAS DE LA F1', 0, 100); g.fillStyle = '#fff'; g.fillText('+ LEYENDAS DE LA F1', 0, 100);
  rr(g, -210, 170, 420, 110, 55); g.fillStyle = '#ff2d55'; g.fill(); g.fillStyle = '#fff'; g.font = 'bold 54px DejaVu Sans'; g.fillText('SEGUIR  +', 0, 227);
  g.restore();
}
function speedLines(g, amt, t) {
  if (amt <= 0) return; g.save(); g.strokeStyle = `rgba(255,255,255,${0.35 * amt})`; g.lineWidth = 3;
  for (let i = 0; i < 70; i++) { const a = hash(i) * Math.PI * 2, r0 = 380 + hash(i * 2 + Math.floor(t * 20)) * 300, len = 120 + hash(i * 3) * 300; const cx = W / 2, cy = H * 0.5; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 1.6); g.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len) * 1.6); g.stroke(); }
  g.restore();
}

window.renderAt = function (t) {
  const shots = CFG.shots; let si = 0; for (let k = 0; k < shots.length; k++) if (t >= shots[k]._t0) si = k;
  const sh = shots[si]; const D = sh._t1 - sh._t0; const lt = t - sh._t0; let p = clamp(lt / D); if (sh.pr) p = lerp(sh.pr[0], sh.pr[1], p);
  Object.values(cars).forEach(resetCar); hideFX(); CFG._callouts = null; CFG._speed = null;
  world.visible = true; grid.visible = false; scene.overrideMaterial = null; setEnv(sh.env || envName);
  Object.values(cars).forEach(C => C.wheels.forEach(w => { if (w.userData.x0 != null) w.position.x = Math.sign(w.position.x) * w.userData.x0; }));
  if (sh.lightsRed == null) gantryLights.forEach(m => m.color.set('#300'));
  if (hotelMat) hotelMat.color.setHSL((t * 0.05) % 1, 0.8, 0.55);
  SH[sh.type](sh, p, lt, D);
  if (sh.shake) { const amp = sh.shake * Math.max(0, 1 - Math.abs(p - (sh.shakeAt ?? 0.5)) * 5); camera.position.x += Math.sin(t * 61) * amp * 0.25; camera.position.y += Math.sin(t * 47) * amp * 0.2; }
  if (sh.vib) { camera.position.y += Math.sin(t * 90) * 0.03 * sh.vib; }
  renderer.render(scene, camera);
  const g = octx; g.filter = sh.grade || CFG.grade || 'none'; g.drawImage(glc, 0, 0); g.filter = 'none';
  if (sh.grain || CFG.grain) for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,240,220,${hash(i + t * 1000) * 0.1})`; g.fillRect(hash(i * 3 + t) * W, hash(i * 7 + t * 2) * H, 2, 2); }
  speedLines(g, sh.speedLines ? (typeof sh.speedLines === 'number' ? sh.speedLines : 1) * (sh.slFrom ? seg(p, sh.slFrom, sh.slFrom + 0.1) : 1) : 0, t);
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const tg = g.createLinearGradient(0, 0, 0, 420); tg.addColorStop(0, 'rgba(0,0,0,0.55)'); tg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = tg; g.fillRect(0, 0, W, 420);
  drawCallouts(g);
  if (sh.type !== 'outro' || !sh.cta) drawTop(g, sh, p);
  if (sh.type === 'outro') drawOutro(g, p, sh.cta);
  drawBig(g, sh, p, D / (sh.pr ? sh.pr[1] - sh.pr[0] : 1));
  let ci = 0; CFG.segs.forEach((s, k) => { if (t >= s.start - 0.2) ci = k; });
  if (sh.type !== 'outro') drawCaption(g, ci, t);
  const fl = clamp(1 - lt / 0.18); if (si > 0 && fl > 0 && !sh.noFlash) { g.fillStyle = `rgba(255,255,255,${fl * 0.7})`; g.fillRect(0, 0, W, H); }
  if (sh.redFlash) { const rf = Math.max(0, 1 - Math.abs(p - sh.redFlash) * 8); g.fillStyle = `rgba(255,120,0,${rf * 0.5})`; g.fillRect(0, 0, W, H); }
  if (t < 0.25) { g.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; g.fillRect(0, 0, W, H); }
  g.save(); g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,0.75)'; g.fillText('LEYENDAS DE LA F1 · 3D', W / 2, 105); g.restore();
  return out.toDataURL('image/jpeg', 0.9);
};
window.initEngine = init;
