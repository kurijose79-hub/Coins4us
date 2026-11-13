import * as THREE from 'three';
import { RoomEnvironment } from './node_modules/three/examples/jsm/environments/RoomEnvironment.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const seg = (p, a, b) => clamp((p - a) / (b - a));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const vl = (a, b, t) => a.clone().lerp(b, t);
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function arc(p0, p1, h, t) { const v = vl(p0, p1, t); v.y += 4 * h * t * (1 - t); return v; }

let CFG, renderer, scene, camera, out, octx, glc;
let field, players = [[], []], ball, confetti, flashes, goalNets = [], trophy, crowdTex, scarfMesh;
let sport;

// ---------- textures ----------
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8; return t;
}

function fieldTexture() {
  const nfl = sport === 'nfl';
  const L = nfl ? 120 : 105, Wd = nfl ? 53.3 : 68;
  const tw = 4096, th = Math.round(4096 * Wd / L);
  return canvasTex(tw, th, (g, w, h) => {
    const sx = w / L, sy = h / Wd;
    const X = x => (x + L / 2) * sx, Y = z => (z + Wd / 2) * sy;
    const stripes = nfl ? 24 : 18;
    for (let i = 0; i < stripes; i++) {
      g.fillStyle = i % 2 ? '#2f7d32' : '#37903a';
      g.fillRect(i * w / stripes, 0, w / stripes + 1, h);
    }
    // grass noise
    for (let i = 0; i < 60000; i++) {
      g.fillStyle = `rgba(${hash(i) > .5 ? '255,255,255' : '0,0,0'},0.035)`;
      g.fillRect(hash(i * 3.1) * w, hash(i * 7.7) * h, 3, 3);
    }
    g.strokeStyle = '#f4f4f4'; g.fillStyle = '#f4f4f4'; g.lineWidth = 0.15 * sx;
    if (nfl) {
      const A = CFG.teams[0], B = CFG.teams[1];
      g.fillStyle = A.shirt === '#ffffff' ? A.alt : A.shirt; g.fillRect(X(50), 0, 10 * sx, h);
      g.fillStyle = B.shirt === '#ffffff' ? B.alt : B.shirt; g.fillRect(X(-60), 0, 10 * sx, h);
      g.fillStyle = 'rgba(255,255,255,0.9)';
      g.font = `bold ${5.5 * sx}px DejaVu Sans`; g.textAlign = 'center'; g.textBaseline = 'middle';
      const nameEZ = (txt, x, rot) => { g.save(); g.translate(X(x), h / 2); g.rotate(rot); g.fillText(txt, 0, 0); g.restore(); };
      nameEZ(A.name.toUpperCase(), 55, -Math.PI / 2); nameEZ(B.name.toUpperCase(), -55, Math.PI / 2);
      g.fillStyle = '#f4f4f4';
      g.lineWidth = 0.2 * sx; g.strokeRect(X(-60), Y(-26.65), 120 * sx, 53.3 * sy);
      for (let x = -50; x <= 50; x += 5) { g.beginPath(); g.moveTo(X(x), Y(-26.65)); g.lineTo(X(x), Y(26.65)); g.stroke(); }
      for (let x = -49; x <= 49; x++) {
        if (x % 5 === 0) continue;
        for (const z of [-26.3, -3.1, 3.1, 26.3]) { g.fillRect(X(x) - 0.08 * sx, Y(z) - 0.4 * sy, 0.16 * sx, 0.8 * sy); }
      }
      g.font = `bold ${2.2 * sx}px DejaVu Sans`;
      for (let x = -40; x <= 40; x += 10) {
        const n = 50 - Math.abs(x);
        for (const [z, r] of [[-19, Math.PI], [19, 0]]) {
          g.save(); g.translate(X(x), Y(z)); g.rotate(r); g.fillText(String(n), 0, 0); g.restore();
        }
      }
    } else {
      g.lineWidth = 0.14 * sx;
      g.strokeRect(X(-52.5), Y(-34), 105 * sx, 68 * sy);
      g.beginPath(); g.moveTo(X(0), Y(-34)); g.lineTo(X(0), Y(34)); g.stroke();
      g.beginPath(); g.arc(X(0), Y(0), 9.15 * sx, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(X(0), Y(0), 0.3 * sx, 0, Math.PI * 2); g.fill();
      for (const s of [-1, 1]) {
        const gx = s * 52.5;
        g.strokeRect(Math.min(X(gx), X(gx - s * 16.5)), Y(-20.16), 16.5 * sx, 40.32 * sy);
        g.strokeRect(Math.min(X(gx), X(gx - s * 5.5)), Y(-9.16), 5.5 * sx, 18.32 * sy);
        g.beginPath(); g.arc(X(gx - s * 11), Y(0), 0.3 * sx, 0, Math.PI * 2); g.fill();
        g.beginPath();
        const a0 = Math.acos(5.5 / 9.15);
        if (s > 0) g.arc(X(gx - 11), Y(0), 9.15 * sx, Math.PI - a0, Math.PI + a0);
        else g.arc(X(gx + 11), Y(0), 9.15 * sx, -a0, a0);
        g.stroke();
      }
    }
  });
}

function crowdTexture(colors) {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#15161c'; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 26; r++) {
      for (let c = 0; c < 64; c++) {
        const k = r * 64 + c, x = c * 16 + 8 + (hash(k) - .5) * 4, y = r * 19.6 + 10;
        const col = hash(k * 1.7) < 0.62 ? colors[Math.floor(hash(k * 2.3) * colors.length)] : ['#ddd', '#333', '#888', '#c44', '#447', '#bb9'][Math.floor(hash(k * 5.1) * 6)];
        g.fillStyle = col; g.fillRect(x - 5, y - 2, 10, 11);
        g.fillStyle = ['#e0b896', '#a87454', '#6b4430', '#f1cfb2'][Math.floor(hash(k * 9.3) * 4)];
        g.beginPath(); g.arc(x, y - 5, 4, 0, 7); g.fill();
      }
    }
  });
}

function glowTex() {
  return canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,250,230,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
  });
}

function numberTex(num, color, stripe) {
  return canvasTex(256, 256, (g) => {
    g.font = 'bold 170px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 10; g.strokeStyle = stripe || 'rgba(0,0,0,0.5)'; g.strokeText(String(num), 128, 140);
    g.fillStyle = color; g.fillText(String(num), 128, 140);
  });
}

function shirtTex(t) {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = t.shirt; g.fillRect(0, 0, w, h);
    if (t.stripes) { g.fillStyle = t.stripes; for (let i = 0; i < 10; i++) if (i % 2) g.fillRect(i * w / 10, 0, w / 10, h); }
    if (t.band) { g.fillStyle = t.band; g.fillRect(0, h * 0.35, w, h * 0.12); }
  });
}

// ---------- stadium ----------
function buildStadium() {
  const nfl = sport === 'nfl';
  const a0 = nfl ? 72 : 64, b0 = nfl ? 40 : 46;
  const rings = 14, segs = 160, n = 4.2;
  const pos = [], uv = [], idx = [];
  for (let r = 0; r <= rings; r++) {
    const f = r / rings, a = a0 + f * 42, b = b0 + f * 40, y = 1.5 + f * 34;
    for (let s = 0; s <= segs; s++) {
      const th = s / segs * Math.PI * 2, c = Math.cos(th), si = Math.sin(th);
      pos.push(a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), y, b * Math.sign(si) * Math.pow(Math.abs(si), 2 / n));
      uv.push(s / segs * 22, f * 2.2);
    }
  }
  for (let r = 0; r < rings; r++) for (let s = 0; s < segs; s++) {
    const i = r * (segs + 1) + s;
    idx.push(i, i + segs + 1, i + 1, i + 1, i + segs + 1, i + segs + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  crowdTex = crowdTexture(CFG.crowd || [CFG.teams[0].shirt, CFG.teams[1].shirt]);
  crowdTex.wrapS = crowdTex.wrapT = THREE.RepeatWrapping;
  const stands = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: crowdTex, side: THREE.DoubleSide }));
  scene.add(stands);
  // wall / ad boards
  const wallGeo = new THREE.BufferGeometry(); const wp = [], wi = [], wuv = [];
  for (let s = 0; s <= segs; s++) {
    const th = s / segs * Math.PI * 2, c = Math.cos(th), si = Math.sin(th);
    const x = a0 * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), z = b0 * Math.sign(si) * Math.pow(Math.abs(si), 2 / n);
    wp.push(x, 0, z, x, 1.5, z); wuv.push(s / segs * 30, 0, s / segs * 30, 1);
  }
  for (let s = 0; s < segs; s++) { const i = s * 2; wi.push(i, i + 1, i + 2, i + 1, i + 3, i + 2); }
  wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3));
  wallGeo.setAttribute('uv', new THREE.Float32BufferAttribute(wuv, 2)); wallGeo.setIndex(wi);
  const boardTex = canvasTex(512, 64, (g, w, h) => {
    g.fillStyle = CFG.teams[0].shirt; g.fillRect(0, 0, w / 2, h); g.fillStyle = '#111'; g.fillRect(w / 2, 0, w / 2, h);
    g.fillStyle = '#fff'; g.font = 'bold 34px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(CFG.board || 'LEYENDAS', w / 4, h / 2); g.fillText(CFG.board2 || 'DEL DEPORTE', w * 3 / 4, h / 2);
  });
  boardTex.wrapS = THREE.RepeatWrapping;
  scene.add(new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({ map: boardTex, side: THREE.DoubleSide })));
  // ground outside field
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshLambertMaterial({ color: nfl ? '#2a6b2c' : '#2c7430' }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; scene.add(ground);
  // roof ring with lights
  const glow = glowTex();
  const lightMat = new THREE.SpriteMaterial({ map: glow, color: '#fff6dd', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  for (let s = 0; s < 48; s++) {
    const th = s / 48 * Math.PI * 2, c = Math.cos(th), si = Math.sin(th), a = a0 + 44, b = b0 + 42;
    const x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), z = b * Math.sign(si) * Math.pow(Math.abs(si), 2 / n);
    const sp = new THREE.Sprite(lightMat); sp.position.set(x, 38, z); sp.scale.set(9, 9, 1); scene.add(sp);
    const box = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1), new THREE.MeshBasicMaterial({ color: '#fffbe8' }));
    box.position.set(x, 38, z); box.lookAt(0, 0, 0); scene.add(box);
  }
  const roofGeo = new THREE.BufferGeometry(); const rp = [], ri = [];
  for (let s = 0; s <= segs; s++) {
    const th = s / segs * Math.PI * 2, c = Math.cos(th), si = Math.sin(th);
    for (const [a, b, y] of [[a0 + 42, b0 + 40, 35.5], [a0 + 30, b0 + 28, 41]]) rp.push(a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), y, b * Math.sign(si) * Math.pow(Math.abs(si), 2 / n));
  }
  for (let s = 0; s < segs; s++) { const i = s * 2; ri.push(i, i + 1, i + 2, i + 1, i + 3, i + 2); }
  roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); roofGeo.setIndex(ri);
  scene.add(new THREE.Mesh(roofGeo, new THREE.MeshLambertMaterial({ color: '#2a2d36', side: THREE.DoubleSide })));
  // camera flashes in crowd
  const fp = [], fc = [];
  for (let i = 0; i < 900; i++) {
    const th = hash(i) * Math.PI * 2, f = hash(i * 1.3), c = Math.cos(th), si = Math.sin(th);
    const a = a0 + f * 42 - 0.5, b = b0 + f * 40 - 0.5;
    fp.push(a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), 2 + f * 34, b * Math.sign(si) * Math.pow(Math.abs(si), 2 / n));
    fc.push(0, 0, 0);
  }
  const fg = new THREE.BufferGeometry();
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
  fg.setAttribute('color', new THREE.Float32BufferAttribute(fc, 3));
  flashes = new THREE.Points(fg, new THREE.PointsMaterial({ size: 1.6, map: glow, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  scene.add(flashes);
}

let tennisTex = {}, tennisCourt = null;
function tennisTexture(surf) {
  if (tennisTex[surf]) return tennisTex[surf];
  const cols = { grass: ['#4f9a3c', '#5aa847', '#3f7f31'], clay: ['#c8643c', '#cf6e45', '#b55a36'], hard: ['#2f6db5', '#3577c2', '#3d8b5a'] }[surf];
  const tex = canvasTex(2048, 1024, (g, w, h) => {
    const L = 36, Wd = 18, sx = w / L, sy = h / Wd; const X = x => (x + L / 2) * sx, Y = z => (z + Wd / 2) * sy;
    g.fillStyle = cols[2]; g.fillRect(0, 0, w, h);
    g.fillStyle = cols[0]; g.fillRect(X(-11.885), Y(-5.485), 23.77 * sx, 10.97 * sy);
    if (surf === 'grass') for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? cols[1] : cols[0]; g.fillRect(X(-11.885 + i * 23.77 / 12), Y(-5.485), 23.77 / 12 * sx + 1, 10.97 * sy); }
    for (let i = 0; i < 20000; i++) { g.fillStyle = `rgba(${hash(i) > .5 ? '255,255,255' : '0,0,0'},0.04)`; g.fillRect(hash(i * 3.1) * w, hash(i * 7.7) * h, 3, 3); }
    g.strokeStyle = '#fafafa'; g.lineWidth = 0.08 * sx;
    g.strokeRect(X(-11.885), Y(-5.485), 23.77 * sx, 10.97 * sy); g.strokeRect(X(-11.885), Y(-4.115), 23.77 * sx, 8.23 * sy);
    for (const x of [-6.4, 6.4]) { g.beginPath(); g.moveTo(X(x), Y(-4.115)); g.lineTo(X(x), Y(4.115)); g.stroke(); }
    g.beginPath(); g.moveTo(X(-6.4), Y(0)); g.lineTo(X(6.4), Y(0)); g.stroke();
    for (const x of [-11.885, 11.885]) { g.beginPath(); g.moveTo(X(x), Y(0)); g.lineTo(X(x - Math.sign(x) * 0.3), Y(0)); g.stroke(); }
  });
  tennisTex[surf] = tex; return tex;
}
function setSurface(surf) { if (tennisCourt) tennisCourt.material.map = tennisTexture(surf); tennisCourt.material.needsUpdate = true; }
function buildTennis() {
  tennisCourt = new THREE.Mesh(new THREE.PlaneGeometry(36, 18), new THREE.MeshLambertMaterial({ map: tennisTexture(CFG.surface || 'grass') }));
  tennisCourt.rotation.x = -Math.PI / 2; tennisCourt.position.y = 0.02; scene.add(tennisCourt);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), new THREE.MeshLambertMaterial({ color: '#2a4f2e' })); apron.rotation.x = -Math.PI / 2; scene.add(apron);
  const netM = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 0.95), new THREE.MeshStandardMaterial({ color: '#111', transparent: true, opacity: 0.75, side: THREE.DoubleSide }));
  netM.rotation.y = Math.PI / 2; netM.position.set(0, 0.48, 0); scene.add(netM);
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 12.8), new THREE.MeshStandardMaterial({ color: '#ffffff' })); tape.position.set(0, 0.95, 0); scene.add(tape);
  for (const z of [-6.4, 6.4]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.07), new THREE.MeshStandardMaterial({ color: '#2a5a3a' })); p.position.set(0, 0.53, z); scene.add(p); }
  // umpire chair
  const ch = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.2, 0.6), new THREE.MeshStandardMaterial({ color: '#2a5a3a' })); ch.position.set(0, 1.1, -7.6); scene.add(ch);
}
function buildField() {
  if (sport === 'tennis') return buildTennis();
  const nfl = sport === 'nfl';
  const L = nfl ? 120 : 105, Wd = nfl ? 53.3 : 68;
  field = new THREE.Mesh(new THREE.PlaneGeometry(L, Wd), new THREE.MeshLambertMaterial({ map: fieldTexture() }));
  field.rotation.x = -Math.PI / 2; scene.add(field);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(L + 16, Wd + 14), new THREE.MeshLambertMaterial({ color: nfl ? '#2b742e' : '#2e7a31' }));
  apron.rotation.x = -Math.PI / 2; apron.position.y = -0.01; scene.add(apron);
  if (nfl) {
    const mat = new THREE.MeshStandardMaterial({ color: '#f2d21b', roughness: 0.4, metalness: 0.3 });
    for (const s of [-1, 1]) {
      const g = new THREE.Group(); g.position.x = s * 60;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.0), mat); post.position.set(s * 1.5, 1.5, 0);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.6), mat); arm.rotation.z = Math.PI / 2; arm.position.set(s * 0.75, 3.0, 0);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.64), mat); bar.rotation.x = Math.PI / 2; bar.position.set(0, 3.05, 0);
      g.add(post, arm, bar);
      for (const z of [-2.82, 2.82]) { const u = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 9), mat); u.position.set(0, 3.05 + 4.5, z); g.add(u); }
      scene.add(g);
    }
  } else {
    for (const s of [-1, 1]) {
      const g = new THREE.Group(); g.position.x = s * 52.5;
      const pm = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
      for (const z of [-3.66, 3.66]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.44), pm); p.position.set(0, 1.22, z); g.add(p); }
      const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7.44), pm); cb.rotation.x = Math.PI / 2; cb.position.y = 2.44; g.add(cb);
      // net
      const pts = [], d = 2.2 * s;
      const net = new THREE.Group();
      for (let z = -3.66; z <= 3.661; z += 0.3) { pts.push(0, 2.44, z, d, 2.0, z, d, 2.0, z, d, 0, z); }
      for (let y = 0; y <= 2.44; y += 0.3) { const dx = y > 2.0 ? d * (2.44 - y) / 0.44 : d; pts.push(dx, y, -3.66, dx, y, 3.66); }
      for (let x = 0; Math.abs(x) <= 2.2; x += 0.3 * s) { const y = 2.44 - 0.44 * x / d; pts.push(x, y, -3.66, x, y, 3.66); }
      for (let x = 0; Math.abs(x) <= 2.2; x += 0.3 * s) for (const z of [-3.66, 3.66]) { const yt = 2.44 - 0.44 * x / d; pts.push(x, 0, z, x, yt, z); }
      for (const z of [-3.66, 3.66]) for (let y = 0; y <= 2.44; y += 0.3) { pts.push(0, y, z, d, Math.min(y, 2.0), z); }
      const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      ng.userData.base = Float32Array.from(pts);
      const nl = new THREE.LineSegments(ng, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55 }));
      net.add(nl); g.add(net); goalNets.push({ mesh: nl, side: s, g });
      scene.add(g);
    }
    // corner flags
    for (const x of [-52.5, 52.5]) for (const z of [-34, 34]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6), new THREE.MeshLambertMaterial({ color: '#eeeeee' })); p.position.set(x, 0.8, z);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), new THREE.MeshLambertMaterial({ color: '#ff2a2a', side: THREE.DoubleSide })); fl.position.set(x, 1.45, z + 0.25 * Math.sign(-z));
      fl.rotation.y = Math.PI / 2; scene.add(p, fl);
    }
  }
}

function netRipple(side, amt, zHit = 0, yHit = 1.2) {
  for (const n of goalNets) {
    const arr = n.mesh.geometry.attributes.position.array, base = n.mesh.geometry.userData.base;
    for (let i = 0; i < arr.length; i += 3) {
      const dx = base[i], y = base[i + 1], z = base[i + 2];
      let push = 0;
      if (n.side === side && amt > 0) { const d2 = (z - zHit) ** 2 + (y - yHit) ** 2; push = amt * Math.exp(-d2 / 1.5) * (Math.abs(dx) / 2.2); }
      arr[i] = dx + side * push;
    }
    n.mesh.geometry.attributes.position.needsUpdate = true;
  }
}

// ---------- players ----------
const skinTones = ['#e8bd98', '#c48b62', '#8d5a3b', '#f0cfb0', '#a86e4c'];
function makePlayer(team, i, num) {
  const T = CFG.teams[team], nfl = sport === 'nfl';
  const isGK = !nfl && i === 0;
  const shirtCol = isGK ? T.keeper : null;
  const shirtMat = isGK ? new THREE.MeshStandardMaterial({ color: shirtCol, roughness: 0.7 }) : new THREE.MeshStandardMaterial({ map: T._shirtTex, roughness: 0.7 });
  const shortsMat = new THREE.MeshStandardMaterial({ color: isGK ? '#222' : T.shorts, roughness: 0.7 });
  const sockMat = new THREE.MeshStandardMaterial({ color: isGK ? T.keeper : T.socks, roughness: 0.7 });
  const skin = new THREE.MeshStandardMaterial({ color: skinTones[(i * 7 + team * 3) % 5], roughness: 0.6 });
  const shoe = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.5 });
  const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(nfl ? 0.27 : 0.23, 0.42, 4, 12), shirtMat); torso.position.y = 1.32; torso.scale.set(1.15, 1, 0.8);
  body.add(torso);
  if (nfl) { const pads = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 8), shirtMat); pads.scale.set(1.2, 0.45, 0.75); pads.position.y = 1.6; body.add(pads); }
  const head = new THREE.Group(); head.position.y = 1.86; body.add(head);
  if (nfl) {
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshStandardMaterial({ color: T.helmet, roughness: 0.25, metalness: 0.4 })); helm.scale.set(1, 1, 1.12); head.add(helm);
    const mask = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 6, 16, Math.PI), new THREE.MeshStandardMaterial({ color: T.mask || '#999' }));
    mask.position.set(0, -0.06, 0.16); mask.rotation.z = Math.PI; head.add(mask);
    const mask2 = mask.clone(); mask2.position.y = -0.11; mask2.scale.set(0.9, 0.9, 0.9); head.add(mask2);
    if (T.helmetStripe) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.42), new THREE.MeshStandardMaterial({ color: T.helmetStripe })); st.position.y = 0.19; head.add(st); }
  } else {
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), skin); hd.scale.set(0.9, 1.05, 1); head.add(hd);
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.155, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: ['#1b1210', '#3b2516', '#6b4a2a', '#111'][i % 4] }));
    hair.scale.set(0.92, 1.05, 1.02); hair.position.y = 0.02; head.add(hair);
  }
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.15), skin); neck.position.y = 1.72; body.add(neck);
  // number on back and front
  if (num != null) {
    const nt = numberTex(num, isGK ? '#fff' : T.num, T.numStroke);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshBasicMaterial({ map: nt, transparent: true }));
    back.position.set(0, 1.38, -(nfl ? 0.235 : 0.2)); back.rotation.y = Math.PI; body.add(back);
    const fr = back.clone(); fr.position.z = (nfl ? 0.235 : 0.2); fr.rotation.y = 0; fr.scale.set(0.6, 0.6, 1); fr.position.y = 1.42; body.add(fr);
  }
  const mkLimb = (y, x, upLen, loLen, upMat, loMat, r) => {
    const root = new THREE.Group(); root.position.set(x, y, 0);
    const up = new THREE.Mesh(new THREE.CapsuleGeometry(r, upLen, 3, 8), upMat); up.position.y = -upLen / 2 - r * 0.5; root.add(up);
    const joint = new THREE.Group(); joint.position.y = -upLen - r; root.add(joint);
    const lo = new THREE.Mesh(new THREE.CapsuleGeometry(r * 0.85, loLen, 3, 8), loMat); lo.position.y = -loLen / 2; joint.add(lo);
    body.add(root); return { root, joint, lo };
  };
  const legL = mkLimb(0.98, 0.12, 0.36, 0.42, shortsMat, sockMat, 0.085);
  const legR = mkLimb(0.98, -0.12, 0.36, 0.42, shortsMat, sockMat, 0.085);
  for (const l of [legL, legR]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.26), shoe); f.position.set(0, -0.48, 0.05); l.joint.add(f); }
  const armMat = isGK ? shirtMat : (nfl ? skin : shirtMat);
  const armL = mkLimb(1.62, nfl ? 0.4 : 0.31, 0.26, 0.26, nfl ? shirtMat : armMat, skin, 0.06);
  const armR = mkLimb(1.62, nfl ? -0.4 : -0.31, 0.26, 0.26, nfl ? shirtMat : armMat, skin, 0.06);
  for (const a of [armL, armR]) {
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), isGK ? new THREE.MeshStandardMaterial({ color: '#f5f5f5' }) : skin); hand.position.y = -0.3; a.joint.add(hand);
  }
  // blob shadow
  const sh = new THREE.Mesh(new THREE.CircleGeometry(0.55, 20), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.35, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = 0.02; g.add(sh);
  scene.add(g);
  if (sport === 'tennis') { const rk = new THREE.Group(); rk.position.set(0, -0.32, 0); armR.joint.add(rk);
    const hdl = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.28), new THREE.MeshStandardMaterial({ color: '#222' })); hdl.position.y = -0.12; rk.add(hdl);
    const fr = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.014, 8, 24), new THREE.MeshStandardMaterial({ color: T.rcol || '#d8322b', metalness: 0.3, roughness: 0.4 })); fr.scale.set(1, 1.3, 1); fr.position.y = -0.42; fr.rotation.y = Math.PI / 2; rk.add(fr);
    const strings = new THREE.Mesh(new THREE.CircleGeometry(0.125, 20), new THREE.MeshBasicMaterial({ color: '#eeeeee', transparent: true, opacity: 0.35, side: THREE.DoubleSide })); strings.scale.set(1, 1.3, 1); strings.position.y = -0.42; strings.rotation.y = Math.PI / 2; rk.add(strings); }
  const P = { g, body, head, legL, legR, armL, armR, sh, team, i, num };
  g.visible = false; return P;
}

function resetPose(P) {
  for (const l of [P.legL, P.legR, P.armL, P.armR]) { l.root.rotation.set(0, 0, 0); l.joint.rotation.set(0, 0, 0); }
  P.armL.root.rotation.z = 0.12; P.armR.root.rotation.z = -0.12;
  P.body.rotation.set(0, 0, 0); P.body.position.set(0, 0, 0); P.g.rotation.set(0, 0, 0); P.head.rotation.set(0, 0, 0);
  P.sh.visible = true; P.sh.position.set(0, 0.02, 0);
}

// pose helpers
function run(P, ph, intensity = 1) {
  const s = Math.sin(ph), c = Math.cos(ph);
  P.legL.root.rotation.x = s * 0.85 * intensity; P.legR.root.rotation.x = -s * 0.85 * intensity;
  P.legL.joint.rotation.x = Math.max(0, -c) * 1.3 * intensity + 0.2; P.legR.joint.rotation.x = Math.max(0, c) * 1.3 * intensity + 0.2;
  P.armL.root.rotation.x = -s * 0.8 * intensity; P.armR.root.rotation.x = s * 0.8 * intensity;
  P.armL.joint.rotation.x = -1.2; P.armR.joint.rotation.x = -1.2;
  P.body.rotation.x = 0.22 * intensity; P.body.position.y = Math.abs(Math.sin(ph)) * 0.09 * intensity;
}
function stance(P, t) { // three point / ready
  P.legL.root.rotation.x = -0.5; P.legR.root.rotation.x = -0.3; P.legL.joint.rotation.x = 0.9; P.legR.joint.rotation.x = 0.7;
  P.body.rotation.x = 0.55; P.body.position.y = -0.18; P.armL.root.rotation.x = -0.6; P.armR.root.rotation.x = -0.6;
  P.body.position.y += Math.sin(t * 2 + P.i) * 0.01;
}
function idle(P, t) {
  P.body.position.y = Math.sin(t * 1.7 + P.i) * 0.012; P.armL.root.rotation.x = Math.sin(t + P.i) * 0.05;
  P.legL.joint.rotation.x = 0.05; P.legR.joint.rotation.x = 0.05; P.head.rotation.y = Math.sin(t * 0.6 + P.i * 2) * 0.3;
}
function armsUp(P, t, wave = 1) {
  P.armL.root.rotation.x = -2.9 + Math.sin(t * 9 + P.i) * 0.25 * wave; P.armR.root.rotation.x = -2.9 + Math.sin(t * 9 + P.i + 1) * 0.25 * wave;
  P.armL.root.rotation.z = 0.35; P.armR.root.rotation.z = -0.35; P.armL.joint.rotation.x = -0.2; P.armR.joint.rotation.x = -0.2;
}
function celebrate(P, t) {
  const j = Math.abs(Math.sin(t * 5.5 + P.i * 1.3));
  P.body.position.y = j * 0.45; armsUp(P, t);
  P.legL.joint.rotation.x = (1 - j) * 0.7; P.legR.joint.rotation.x = (1 - j) * 0.7; P.legL.root.rotation.x = -(1 - j) * 0.3; P.legR.root.rotation.x = -(1 - j) * 0.3;
}
function sad(P, t, kind) {
  if (kind % 3 === 0) { // kneel
    P.legL.root.rotation.x = -1.5; P.legL.joint.rotation.x = 1.6; P.legR.root.rotation.x = 0.1; P.legR.joint.rotation.x = 2.2;
    P.body.position.y = -0.45; P.body.rotation.x = 0.5; P.head.rotation.x = 0.5; P.armL.root.rotation.x = -0.5; P.armR.root.rotation.x = -0.5;
  } else if (kind % 3 === 1) { // lying on back
    P.body.rotation.x = -Math.PI / 2; P.body.position.y = 0.2; P.body.position.z = -0.9; armsUp(P, 0, 0); P.armL.root.rotation.z = 1.0; P.armR.root.rotation.z = -1.0;
  } else { // hands on head
    P.armL.root.rotation.x = -2.6; P.armR.root.rotation.x = -2.6; P.armL.joint.rotation.x = -2.0; P.armR.joint.rotation.x = -2.0;
    P.armL.root.rotation.z = 0.9; P.armR.root.rotation.z = -0.9; P.head.rotation.x = -0.3 + Math.sin(t) * 0.05;
  }
}
function place(P, pos, yaw) { P.g.visible = true; P.g.position.copy(pos); P.g.position.y = pos.y || 0; P.g.rotation.y = yaw; P.sh.position.y = 0.02 - (pos.y || 0); P.sh.scale.setScalar(1 / (1 + (pos.y || 0) * 0.4)); }
function face(from, to) { return Math.atan2(to.x - from.x, to.z - from.z); }

// ---------- ball ----------
function buildBall() {
  if (sport === 'nfl') {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 12), new THREE.MeshStandardMaterial({ color: '#6b3216', roughness: 0.55 })); m.scale.set(1, 1, 1.65); g.add(m);
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 0.12), new THREE.MeshBasicMaterial({ color: '#fff' })); lace.position.y = 0.11; g.add(lace);
    ball = g;
  } else {
    const tex = canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#fafafa'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a';
      for (let i = 0; i < 14; i++) { const x = (i % 7) * w / 7 + (i > 6 ? w / 14 : 0), y = i > 6 ? h * 0.72 : h * 0.3; g.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; g.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); } g.fill(); }
    });
    ball = sport === 'tennis' ? new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshStandardMaterial({ color: '#d9f03c', emissive: '#4a5200', roughness: 0.7 })) : new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 }));
  }
  const sh = new THREE.Mesh(new THREE.CircleGeometry(0.16, 14), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.35, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; ball.userData.sh = sh; scene.add(sh);
  scene.add(ball);
}
function setBall(pos, t, spin = 1, dir = null) {
  ball.visible = true; ball.position.copy(pos); ball.userData.sh.visible = true;
  ball.userData.sh.position.set(pos.x, 0.02, pos.z);
  if (sport === 'nfl') { if (dir) ball.rotation.y = Math.atan2(dir.x, dir.z); ball.rotation.z = t * 25 * spin; ball.rotation.x = -0.15; }
  else { ball.rotation.x = t * 12 * spin; ball.rotation.z = t * 5 * spin; }
}
function hideBall() { ball.visible = false; ball.userData.sh.visible = false; }
function handPos(P, side = 'R') {
  const v = new THREE.Vector3(); (side === 'R' ? P.armR : P.armL).joint.children[1].getWorldPosition(v); return v;
}
function chestPos(P) { P.g.updateMatrixWorld(true); const v = new THREE.Vector3(0, 1.3, 0.3); return P.body.localToWorld(v); }

// ---------- confetti / trophy ----------
function buildConfetti() {
  const N = 700;
  confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.12, 0.18), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), N);
  const cols = CFG.confetti || [CFG.teams[0].shirt, '#ffd700', '#ffffff', CFG.teams[0].alt || '#ffffff'];
  for (let i = 0; i < N; i++) confetti.setColorAt(i, new THREE.Color(cols[i % cols.length]));
  confetti.visible = false; scene.add(confetti);
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(1, 1, 1);
function showConfetti(center, t, radius = 14) {
  confetti.visible = true;
  for (let i = 0; i < confetti.count; i++) {
    const x = center.x + (hash(i) - .5) * radius * 2, z = center.z + (hash(i * 2.3) - .5) * radius * 2;
    const y0 = 4 + hash(i * 3.7) * 16, y = ((y0 - t * (1.2 + hash(i * 5.1) * 0.8)) % 20 + 20) % 20;
    _e.set(t * 3 + i, t * 2.3 + i * 0.7, t * 1.7); _q.setFromEuler(_e);
    _m.compose(V(x + Math.sin(t * 2 + i) * 0.5, y, z + Math.cos(t * 1.6 + i) * 0.5), _q, _s);
    confetti.setMatrixAt(i, _m);
  }
  confetti.instanceMatrix.needsUpdate = true;
}
function buildTrophy() {
  const gold = new THREE.MeshStandardMaterial({ color: '#f3c442', metalness: 0.85, roughness: 0.22, envMapIntensity: 3, emissive: '#3a2600' });
  const g = new THREE.Group();
  if (sport === 'nfl' || CFG.trophyType === 'globe') {
    const pts = [[0, 0], [0.32, 0], [0.3, 0.08], [0.18, 0.14], [0.12, 0.5], [0.1, 0.9], [0.09, 1.0], [0, 1.0]].map(p => new THREE.Vector2(p[0], p[1]));
    const base = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), gold); g.add(base);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), sport === 'nfl' ? new THREE.MeshStandardMaterial({ color: '#d8d8d8', metalness: 0.75, roughness: 0.2, envMapIntensity: 3, emissive: '#2a2a2a' }) : gold);
    if (sport === 'nfl') top.scale.set(1, 1, 1.6); top.position.y = 1.2; top.rotation.x = sport === 'nfl' ? -0.6 : 0; g.add(top);
  } else {
    const pts = [[0, 0], [0.3, 0], [0.3, 0.1], [0.12, 0.16], [0.08, 0.45], [0.1, 0.55], [0.32, 0.8], [0.38, 1.05], [0.36, 1.1], [0, 1.0]].map(p => new THREE.Vector2(p[0], p[1]));
    const cup = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), new THREE.MeshStandardMaterial({ color: '#e6e6ea', metalness: 0.75, roughness: 0.2, envMapIntensity: 3, emissive: '#2a2a30', side: THREE.DoubleSide })); g.add(cup);
    for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 8, 24, Math.PI * 1.3), cup.material); h.position.set(s * 0.42, 0.72, 0); h.rotation.z = s > 0 ? -1.2 : Math.PI + 1.2; g.add(h); }
  }
  // ribbons
  g.userData.ribbons = [];
  for (let k = 0; k < 2; k++) {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.7), new THREE.MeshStandardMaterial({ color: '#fff', side: THREE.DoubleSide }));
    r.position.set(k ? 0.3 : -0.3, 0.6, 0.1); r.visible = false; g.add(r); g.userData.ribbons.push(r);
  }
  g.scale.setScalar(1.0); g.visible = false; scene.add(g); trophy = g;
}

// ---------- world ----------
let pool = [];
async function init(cfg) {
  CFG = cfg; sport = cfg.sport;
  for (const T of CFG.teams) T._shirtTex = shirtTex(T);
  glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false); renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  scene = new THREE.Scene();
  const sky = canvasTex(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cfg.sky?.[0] || '#060a1a'); gr.addColorStop(0.6, cfg.sky?.[1] || '#18244a'); gr.addColorStop(1, cfg.sky?.[2] || '#3a3550'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  scene.background = sky;
  scene.fog = new THREE.Fog(cfg.sky?.[1] || '#18244a', 140, 320);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight('#cfe0ff', '#2a4a22', 1.4));
  const d = new THREE.DirectionalLight('#fff4e0', 2.2); d.position.set(30, 60, 20); scene.add(d);
  const d2 = new THREE.DirectionalLight('#aac4ff', 0.9); d2.position.set(-40, 40, -30); scene.add(d2);
  camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 800);
  buildField(); const nBefore = scene.children.length; buildStadium(); if (sport === 'tennis') { const sg = new THREE.Group(); scene.children.slice(nBefore).forEach(o => sg.add(o)); sg.scale.set(0.42, 0.45, 0.42); scene.add(sg); } buildBall(); buildConfetti(); buildTrophy();
  const nums = CFG.numbers || [[], []];
  for (let t = 0; t < 2; t++) for (let i = 0; i < 11; i++) {
    const n = sport === 'tennis' ? null : nums[t][i] != null ? nums[t][i] : (sport === 'nfl' ? [12, 28, 87, 11, 80, 64, 70, 66, 75, 61, 33][i] : [1, 2, 4, 5, 3, 8, 6, 7, 10, 9, 11][i]);
    players[t].push(makePlayer(t, i, n));
  }
  out = document.createElement('canvas'); out.width = W; out.height = H; octx = out.getContext('2d');
  document.body.appendChild(out);
  // build shot table
  let tt = 0;
  CFG.shots.forEach((s, k) => { const st = k === 0 ? 0 : CFG.segs[k].start - 0.15; s._t0 = st; });
  CFG.shots.forEach((s, k) => { s._t1 = k < CFG.shots.length - 1 ? CFG.shots[k + 1]._t0 : CFG.total; });
  await document.fonts.ready;
  return true;
}

// ---------- shots ----------
const SH = {};
const nfl = () => sport === 'nfl';
function setCam(pos, look, fov = 50) { camera.position.copy(pos); camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(look); }
function team(t) { return players[t]; }
function formationNFL(los, dir, t, which = 'both', ready = true) {
  // offense team A attacking +dir
  const off = team(CFG.offense ?? 0), def = team(1 - (CFG.offense ?? 0));
  const ol = [0, 1.2, -1.2, 2.4, -2.4];
  if (which !== 'def') {
    off[0] && place(off[0], V(los - dir * (CFG.shotgun ? 5 : 1.2), 0, 0), dir > 0 ? Math.PI / 2 : -Math.PI / 2);
    for (let k = 0; k < 5; k++) { const P = off[5 + k]; place(P, V(los - dir * 0.6, 0, ol[k]), dir > 0 ? Math.PI / 2 : -Math.PI / 2); if (ready) stance(P, t); }
    const sk = [[1, 0, -14], [2, -0.5, 12], [3, -1, 8], [4, -0.5, -9], [10, -4, 0.8]];
    for (const [i, dx, z] of sk) { place(off[i], V(los + dir * (dx - 0.8), 0, z), dir > 0 ? Math.PI / 2 : -Math.PI / 2); if (ready && i !== 10) stance(off[i], t); }
  }
  if (which !== 'off') {
    const dz = [0.6, -0.6, 2.0, -2.0, 3.6, -3.6, 0, 6, -6, 13, -13];
    const dx = [1, 1, 1, 1, 1.2, 1.2, 5, 5.5, 5.5, 8, 8];
    for (let k = 0; k < 11; k++) { place(def[k], V(los + dir * dx[k] * 1.0, 0, dz[k]), dir > 0 ? -Math.PI / 2 : Math.PI / 2); if (ready && k < 6) stance(def[k], t); else idle(def[k], t); }
  }
}

SH.intro = (o, p, lt, D) => {
  const a = lerp(o.a0 ?? -0.6, o.a1 ?? 0.5, ease(p)), r = lerp(o.r0 ?? 150, o.r1 ?? 95, ease(p)), h = lerp(o.h0 ?? 85, o.h1 ?? 40, ease(p));
  setCam(V(Math.cos(a) * r, h, Math.sin(a) * r), V(0, 0, 0), 48);
  if (nfl()) formationNFL(o.los ?? 0, 1, lt); else soccerShape(lt, o);
};
SH.aerial = SH.intro;

function soccerShape(lt, o = {}) {
  if (sport === 'tennis') { tennisIdle(lt); return; }
  const pos = [[-48, 0], [-38, -20], [-40, -7], [-40, 7], [-38, 20], [-22, -14], [-24, 0], [-22, 14], [-8, -22], [-3, 0], [-8, 22]];
  for (let t = 0; t < 2; t++) for (let i = 0; i < 11; i++) {
    const s = t ? 1 : -1; const [x, z] = pos[i];
    const P = team(t)[i]; const ph = lt * 8 + i;
    const px = -s * x * (o.compact ?? 1), pz = z + Math.sin(lt * 0.7 + i) * 1.5;
    place(P, V(px * 0.95, 0, pz), s < 0 ? Math.PI / 2 : -Math.PI / 2);
    if (o.walk) run(P, ph, 0.4); else idle(P, lt);
  }
}

SH.lineup = (o, p, lt, D) => {
  const los = o.los ?? 0, dir = o.dir ?? 1;
  formationNFL(los, dir, lt);
  const back = V(los - dir * lerp(16, 9, ease(p)), lerp(4.5, 2.6, ease(p)), lerp(-6, -2, p));
  setCam(back, V(los + dir * 8, 1.2, 0), 42);
  if (o.ballSnap && p > 0.85) { }
  setBall(V(los - dir * 0.2, 0.15, 0), 0, 0, V(dir, 0, 0)); ball.rotation.z = 0;
};

SH.stat = (o, p, lt) => {
  if (nfl()) formationNFL(o.los ?? 0, 1, lt, 'both', false); else soccerShape(lt, { walk: true });
  const x = lerp(o.x0 ?? -30, o.x1 ?? 10, p);
  setCam(V(x, o.h ?? 1.2, o.z ?? 32), V(x + 18, 0.8, 0), 40);
};

SH.hero = (o, p, lt) => {
  const T = o.team ?? 0, P = team(T)[o.idx ?? 0];
  if (nfl()) formationNFL(o.los ?? 25, 1, lt, 'both', false); else soccerShape(lt, {});
  const c = V(o.x ?? -22, 0, o.z ?? 0); place(P, c, Math.PI / 2 + Math.sin(lt * 0.5) * 0.1); idle(P, lt);
  if (o.ballInHand && nfl()) { P.armR.root.rotation.x = -0.9; P.armR.joint.rotation.x = -1.4; P.g.updateMatrixWorld(true); setBall(handPos(P), 0, 0, V(1, 0, 0)); }
  else if (!nfl()) { setBall(V(c.x + 0.6, 0.12, c.z + 0.3), 0, 0); }
  const a = lerp(-0.9, 0.3, ease(p)) + Math.PI / 2, r = lerp(7.5, 5.2, ease(p));
  setCam(V(c.x + Math.sin(a) * r, 1.1 + p * 0.4, c.z + Math.cos(a) * r), V(c.x, 1.25, c.z), 40);
};

SH.runTD = (o, p, lt, D) => {
  // ball carrier runs from x0 into endzone (+60 side). defenders chase / dive
  const A = team(o.team ?? 0), B = team(1 - (o.team ?? 0));
  const x0 = o.x0 ?? 30, xe = o.xe ?? 53;
  const tr = ease(seg(p, 0, o.dive ? 0.8 : 0.85));
  const carrier = A[o.idx ?? 1];
  const cx = lerp(x0, xe, tr), cz = (o.z ?? 0) + Math.sin(tr * 3) * 2;
  const cp = V(cx, 0, cz);
  place(carrier, cp, Math.PI / 2);
  if (o.dive && p > 0.72) {
    const dp = seg(p, 0.72, 0.9);
    carrier.g.position.x = xe - 1.5 + dp * 3.5; carrier.body.rotation.x = dp * 1.35; carrier.body.position.y = Math.sin(dp * Math.PI) * 0.6 + dp * 0.3;
    carrier.armL.root.rotation.x = -2.8; carrier.armR.root.rotation.x = -2.8;
  } else if (p < 0.85) run(carrier, lt * 11);
  else celebrate(carrier, lt);
  carrier.g.updateMatrixWorld(true);
  const hp = handPos(carrier, o.dive && p > 0.72 ? 'R' : 'R');
  if (p > 0.88 && !o.dive) setBall(V(cp.x + 0.5, 0.15, cp.z), 0, 0, V(1, 0, 0)); else setBall(hp, 0, 0, V(1, 0, 0.3));
  // defenders
  for (let k = 0; k < 4; k++) {
    const D2 = B[6 + k]; const off = [[-3, 4], [-4, -3], [-6, 1.5], [2, 6]][k];
    let dx = cx + off[0] + (k === 3 ? -p * 9 : 0), dz = cz + off[1] * (1 - tr * 0.4);
    const dpos = V(dx, 0, dz); place(D2, dpos, face(dpos, cp)); run(D2, lt * 11 + k);
    if (k === 3 && p > 0.4) { const dd = seg(p, 0.4, 0.6); D2.body.rotation.x = dd * 1.4; D2.body.position.y = Math.sin(dd * Math.PI) * 0.5; D2.armL.root.rotation.x = -2.6; D2.armR.root.rotation.x = -2.6; if (dd >= 1) D2.body.position.y = -0.0; }
  }
  for (let k = 0; k < 3; k++) { const bl = A[5 + k]; const bp = V(cx - 4 - k * 2, 0, cz + (k - 1) * 4); place(bl, bp, Math.PI / 2); run(bl, lt * 11 + k * 2); }
  const camSide = o.camSide ?? 1;
  setCam(V(cx - lerp(9, 4, p), 2.2 + p * 0.5, cz + camSide * lerp(10, 7, p)), V(cx + 3, 1.0, cz), 45);
};

SH.pass = (o, p, lt, D) => {
  // QB drops & throws to receiver; o.leap for leaping catch, o.helmet for helmet catch, o.td
  const off = team(o.team ?? 0), def = team(1 - (o.team ?? 0));
  const los = o.los ?? 0, qb = off[0], rec = off[o.rec ?? 2];
  const tThrow = o.tThrow ?? 0.3, tCatch = o.tCatch ?? 0.75;
  const qx = los - 3 - ease(seg(p, 0, tThrow)) * 4; const qp = V(qx, 0, o.qz ?? 0);
  place(qb, qp, Math.PI / 2);
  const throwP = seg(p, tThrow - 0.08, tThrow + 0.04);
  if (p < tThrow - 0.08) { run(qb, lt * 8, 0.5); qb.armR.root.rotation.x = -1.0; qb.armR.joint.rotation.x = -1.6; }
  else { qb.armR.root.rotation.x = lerp(-2.6, -0.4, throwP); qb.armR.joint.rotation.x = lerp(-1.6, 0, throwP); qb.body.rotation.x = throwP * 0.25; qb.legR.root.rotation.x = 0.4; qb.legL.root.rotation.x = -0.3; }
  const rEnd = V(o.rx ?? los + 30, 0, o.rz ?? 8);
  const rStart = V(los + 2, 0, (o.rz ?? 8) + (o.rzs ?? -6));
  const rt = seg(p, 0, tCatch);
  const rp = vl(rStart, rEnd, rt); if (p > tCatch) rp.x += (p - tCatch) * (o.td ? 6 : 2);
  place(rec, rp, face(rStart, rEnd));
  const catchH = o.leap ? 3.0 : 1.5;
  let leapY = 0;
  if (o.leap) { const lp = seg(p, tCatch - 0.12, tCatch + 0.18); leapY = Math.sin(lp * Math.PI) * 1.05; }
  rec.g.position.y = leapY;
  rec.sh.position.y = 0.02 - leapY;
  if (p < tCatch - 0.12) run(rec, lt * 11);
  else if (p < tCatch + 0.2) {
    if (o.helmet) { rec.armL.root.rotation.x = -2.9; rec.armR.root.rotation.x = -2.6; rec.armL.joint.rotation.x = -0.8; rec.armR.joint.rotation.x = -1.2; rec.head.rotation.x = -0.4; }
    else armsUp(rec, 0, 0);
    rec.legL.joint.rotation.x = 1.0; rec.legR.root.rotation.x = -0.6; rec.legR.joint.rotation.x = 0.5;
  } else if (o.td) celebrate(rec, lt); else run(rec, lt * 9, 0.6);
  // defenders: one covering receiver
  const cb = def[9]; const cbp = rp.clone().add(V(o.helmet ? 0.6 : 1.2, 0, o.helmet ? -0.5 : 0.9)); place(cb, cbp, face(cbp, rp));
  if (p < tCatch - 0.12) run(cb, lt * 11 + 1); else { armsUp(cb, 0, 0); cb.g.position.y = leapY * 0.8; cb.sh.position.y = 0.02 - leapY * 0.8; cb.armR.root.rotation.x = o.helmet ? -2.2 : -2.9; }
  if (o.helmet) { cb.armL.root.rotation.z = 1.2; }
  // linemen
  for (let k = 0; k < 5; k++) { const P = off[5 + k]; place(P, V(los - 1 - Math.min(p, 0.3) * 3, 0, [0, 1.2, -1.2, 2.4, -2.4][k]), Math.PI / 2); stance(P, lt); P.body.rotation.x = 0.35; }
  for (let k = 0; k < 4; k++) { const P = def[k]; const dp = V(los + 0.2 - Math.min(p, 0.35) * 5, 0, [0.6, -0.6, 2, -2][k] * (1 + k * 0.1)); place(P, dp, face(dp, qp)); run(P, lt * 10 + k, 0.6); }
  // ball
  rec.g.updateMatrixWorld(true); qb.g.updateMatrixWorld(true);
  if (p < tThrow) setBall(handPos(qb), 0, 0, V(1, 0, 0));
  else if (p < tCatch) {
    const bp0 = V(qx, 2.2, qp.z), bp1 = vl(rStart, rEnd, 1).add(V(0, o.helmet ? 2.25 + 1.05 : catchH + leapY * 0 + 0.6, 0));
    if (o.leap) bp1.y = catchH + 0.3;
    const bt = seg(p, tThrow, tCatch);
    const bp = arc(bp0, bp1, o.arcH ?? 9, bt); setBall(bp, lt, 1, bp1.clone().sub(bp0));
  } else {
    let hp = o.helmet ? rec.head.getWorldPosition(new THREE.Vector3()).add(V(0.1, 0.2, 0.05)) : handPos(rec, 'L').lerp(handPos(rec, 'R'), 0.5);
    if (p > tCatch + 0.2) hp = chestPos(rec);
    setBall(hp, 0, 0, V(1, 0, 0));
  }
  // camera
  const mode = o.cam ?? 'follow';
  if (mode === 'follow') {
    const bpos = ball.position;
    const look = p < tThrow ? V(qx + 3, 1.6, qp.z) : vl(V(qx + 6, 2, 0), V(rEnd.x, 2, rEnd.z), seg(p, tThrow, tCatch));
    const cpos = look.clone().add(V(-lerp(12, 8, p), 4 + Math.sin(p * Math.PI) * 4, -lerp(14, 9, p)));
    setCam(cpos, look, 46);
  }
  if (o.slowmo && p > tCatch - 0.2 && p < tCatch + 0.25) {
    const c = rEnd.clone(); const a = lerp(-1.2, 0.2, seg(p, tCatch - 0.2, tCatch + 0.25));
    setCam(V(c.x + Math.cos(a) * 5.5, 0.6, c.z + Math.sin(a) * 5.5), V(c.x, 2.2, c.z), 40);
  }
};

SH.catchLeap = (o, p, lt, D) => {
  // pure slow-mo leaping catch close-up, receiver at x=55 endzone
  const off = team(o.team ?? 0), def = team(1 - (o.team ?? 0));
  const rec = off[o.rec ?? 2]; const c = V(o.x ?? 56, 0, o.z ?? 3);
  const lp = seg(p, o.p0 ?? 0.05, o.p1 ?? 0.75); const leapY = Math.sin(lp * Math.PI) * 1.15;
  place(rec, V(c.x - (1 - lp) * 1.2, leapY, c.z), Math.PI / 2 + (o.yaw ?? -0.5)); rec.sh.position.y = 0.02 - leapY;
  if (o.helmet) { rec.armL.root.rotation.x = -2.9; rec.armR.root.rotation.x = -2.5; rec.armR.joint.rotation.x = -1.4; rec.armL.joint.rotation.x = -0.9; rec.head.rotation.x = -0.35; }
  else { armsUp(rec, 0, 0); rec.armL.root.rotation.x = -3.0; rec.armR.root.rotation.x = -3.0; }
  rec.legL.joint.rotation.x = 1.3; rec.legL.root.rotation.x = -0.5; rec.legR.joint.rotation.x = 0.4; rec.body.rotation.x = -0.15;
  if (lp >= 1) { resetPose(rec); place(rec, V(c.x - 0.0, 0, c.z), Math.PI / 2 + (o.yaw ?? -0.5)); celebrate(rec, lt); }
  const cb = def[9]; const cbY = Math.sin(seg(p, (o.p0 ?? 0.05) + 0.03, (o.p1 ?? 0.75) - 0.05) * Math.PI) * 0.9;
  place(cb, V(c.x + 0.7, cbY, c.z - 0.6), -Math.PI / 2 - 0.5); cb.sh.position.y = 0.02 - cbY;
  armsUp(cb, 0, 0); cb.armL.root.rotation.z = o.helmet ? 1.3 : 0.4; cb.legL.joint.rotation.x = 1.0;
  if (lp >= 1) { resetPose(cb); place(cb, V(c.x + 1.2, 0, c.z - 1.0), -2.2); sad(cb, lt, 2); }
  rec.g.updateMatrixWorld(true);
  const bp1 = o.helmet ? rec.head.getWorldPosition(new THREE.Vector3()).add(V(0.12, 0.22, 0)) : handPos(rec, 'L').lerp(handPos(rec, 'R'), 0.5).add(V(0, 0.05, 0));
  const catchAt = (o.p0 ?? 0.05) + ((o.p1 ?? 0.75) - (o.p0 ?? 0.05)) * 0.5;
  if (p < catchAt) { const bt = seg(p, 0, catchAt); const b0 = V(c.x - 14, 7, c.z - 6); setBall(arc(b0, bp1, 2, bt), lt * 0.4, 1, bp1.clone().sub(b0)); }
  else if (lp < 1) setBall(bp1, 0, 0, V(1, 0, 0)); else setBall(chestPos(rec), 0, 0, V(1, 0, 0));
  for (let k = 0; k < 4; k++) { const P = def[5 + k]; const pp = V(c.x - 6 - k * 3, 0, c.z - 6 + k * 3.5); place(P, pp, face(pp, c)); run(P, lt * 7 + k, 0.5); }
  const a = lerp(o.a0 ?? -2.1, o.a1 ?? -1.2, ease(p)), r = lerp(8.5, 6.5, ease(p));
  setCam(V(c.x + Math.cos(a) * r, 1.5, c.z + Math.sin(a) * r), V(c.x, 1.7 + leapY * 0.6, c.z), 44);
};

SH.scramble = (o, p, lt) => {
  const off = team(o.team ?? 0), def = team(1 - (o.team ?? 0));
  const los = o.los ?? 44, qb = off[0];
  let qx, qz;
  if (o.escape) {
    // defenders collapse; QB spins out at p~0.45 then runs/throws
    qx = los - 6 - seg(p, 0.5, 1) * 2; qz = Math.sin(seg(p, 0.35, 0.6) * Math.PI) * 1.2 + seg(p, 0.55, 1) * 3.5;
  } else { qx = los - 5 + p * 2.5; qz = lerp(0, 16, ease(p)); }
  const qp = V(qx, 0, qz); place(qb, qp, o.escape && p < 0.6 ? Math.PI / 2 + Math.sin(p * 30) * 0.6 * seg(p, 0.3, 0.6) : (o.escape ? Math.PI / 2 : 0.4));
  if (o.escape && p > 0.3 && p < 0.58) { qb.body.rotation.z = Math.sin(lt * 9) * 0.15; qb.body.rotation.x = 0.35; qb.armR.root.rotation.x = -1.0; qb.legL.joint.rotation.x = 0.6; qb.legR.joint.rotation.x = 0.4; qb.body.position.y = -0.1; }
  else run(qb, lt * 10, o.escape && p < 0.3 ? 0.3 : 1);
  if (o.throwAt && p > o.throwAt) { const tp = seg(p, o.throwAt, o.throwAt + 0.1); resetPose(qb); qb.armR.root.rotation.x = lerp(-2.6, -0.4, tp); qb.body.rotation.x = 0.2 * tp; qb.legR.root.rotation.x = 0.4; qb.legL.root.rotation.x = -0.3; }
  qb.g.updateMatrixWorld(true);
  if (o.throwAt && p > o.throwAt + 0.06) { const bt = (p - o.throwAt - 0.06) * 3; setBall(arc(V(qx + 0.3, 2.3, qz), V(qx + 30, 2, qz + 4), 8, bt), lt, 1, V(1, 0, 0.1)); }
  else { qb.armR.root.rotation.x = Math.min(qb.armR.root.rotation.x, -0.9); qb.armR.joint.rotation.x = -1.5; qb.g.updateMatrixWorld(true); setBall(handPos(qb), 0, 0, V(1, 0, 0)); }
  for (let k = 0; k < 3; k++) {
    const P = def[k]; let dp;
    if (o.escape) {
      const ang = k * 2.1 + 0.5; const rr = lerp(3.5, 0.55, ease(seg(p, 0, 0.42)));
      dp = V(los - 6 + Math.cos(ang) * rr, 0, Math.sin(ang) * rr);
      if (p > 0.55) dp.add(V(Math.cos(ang) * 0, 0, 0));
      place(P, dp, face(dp, V(los - 6, 0, 0)));
      if (p < 0.42) run(P, lt * 11 + k); else { P.armL.root.rotation.x = -1.4; P.armR.root.rotation.x = -1.4; P.body.rotation.x = 0.4 + seg(p, 0.55, 0.8) * 1.0; P.body.position.y = -seg(p, 0.55, 0.8) * 0.4; }
      if (k === 1 && p > 0.3 && p < 0.58) { P.armR.root.rotation.x = -1.6; P.g.rotation.y += 0.3; }
    } else {
      dp = V(qx - 2.5 - k * 1.8, 0, qz - 2 - k * 1.5 + Math.sin(lt * 3 + k)); place(P, dp, face(dp, qp)); run(P, lt * 11 + k);
      if (k === 0) { P.armL.root.rotation.x = -1.6; P.armR.root.rotation.x = -1.6; }
    }
  }
  for (let k = 0; k < 5; k++) { const P = off[5 + k]; const lp = V(los - 1.5, 0, [0, 1.2, -1.2, 2.4, -2.4][k] * 1.3); place(P, lp, Math.PI / 2); stance(P, lt); P.body.rotation.x = 0.3; }
  for (let k = 3; k < 7; k++) { const P = def[k]; const lp = V(los - 0.5, 0, (k - 5) * 2.2); place(P, lp, -Math.PI / 2); stance(P, lt); }
  const look = V(qx + 1, 1.4, qz);
  if (o.escape) setCam(V(qx - lerp(8, 6, p), 3.0, qz - lerp(8, 5.5, p)), look, 44);
  else setCam(V(qx + lerp(5, 3, p), 2.0, qz + 9), look, 46);
};

// ----- soccer shots -----
const GX = 52.5;
function keeper(t) { return team(t)[0]; }
SH.goal = (o, p, lt, D) => {
  // attacker (team o.team) shoots at goal x=+GX (if o.team==0) ; keeper dives other way
  const at = o.team ?? 0, dt = 1 - at, s = o.side ?? 1, gx = s * GX;
  const shooter = team(at)[o.idx ?? 9];
  const sx = gx - s * (o.dist ?? 14), sz = o.sz ?? -4;
  const tKick = o.tKick ?? 0.45, tIn = o.tIn ?? 0.6;
  const runStart = V(sx - s * 10, 0, sz - 3);
  const sp = vl(runStart, V(sx, 0, sz), ease(seg(p, 0, tKick)));
  if (p > tKick) sp.x += s * (p - tKick) * 5;
  place(shooter, sp, face(sp, V(gx, 0, 0)));
  if (p < tKick - 0.05) run(shooter, lt * 11);
  else if (p < tKick + 0.08) { const kp = seg(p, tKick - 0.05, tKick + 0.08); shooter.legR.root.rotation.x = lerp(0.9, -1.4, kp); shooter.legR.joint.rotation.x = lerp(1.2, 0.1, kp); shooter.armL.root.rotation.z = 1.1; shooter.armR.root.rotation.z = -1.1; shooter.body.rotation.x = -0.1; }
  else if (p > tIn + 0.05) { celebrate(shooter, lt); shooter.g.rotation.y = face(sp, V(0, 0, 40 * Math.sign(sz || 1))); }
  else run(shooter, lt * 8, 0.6);
  // ball
  const target = V(gx + s * 0.4, o.ty ?? 1.6, o.tz ?? 2.6);
  const b0 = V(sx + s * 0.5, 0.12, sz + 0.2);
  if (p < tKick) { const bp = sp.clone().add(V(s * 0.7, 0.12, 0.25)); setBall(bp, lt * 0.8, 1); }
  else if (p < tIn) { const bt = seg(p, tKick, tIn); const bp = arc(b0, target, o.loft ?? 0.6, bt); bp.z += Math.sin(bt * Math.PI) * (o.curve ?? 1.2); setBall(bp, lt * 2, 2); }
  else { const bp = target.clone().add(V(s * Math.min((p - tIn) * 8, 1.6), -Math.min((p - tIn) * 6, target.y - 0.12), 0)); setBall(bp, lt, 0.3); }
  netRipple(s, p > tIn ? Math.max(0, 1 - (p - tIn) * 3) * 0.9 : 0, target.z, target.y);
  // keeper
  const K = keeper(dt); const dive = seg(p, tKick + 0.02, tIn + 0.05);
  const kz = o.kDive ?? -2.5;
  const kp = V(gx - s * 1.0, 0, lerp(sz * 0.15, kz, easeOut(dive)));
  place(K, kp, face(kp, V(sx, 0, sz)));
  if (dive > 0) { K.body.rotation.z = Math.sign(kz) * s * dive * 1.4; K.body.position.y = Math.sin(dive * Math.PI) * 0.6; armsUp(K, 0, 0); }
  else { K.legL.root.rotation.z = 0.2; K.legR.root.rotation.z = -0.2; K.legL.joint.rotation.x = 0.4; K.legR.joint.rotation.x = 0.4; K.body.position.y = -0.08; K.armL.root.rotation.z = 0.6; K.armR.root.rotation.z = -0.6; }
  if (p > tIn + 0.15) { resetPose(K); place(K, V(gx - s * 1.0, 0, kz), face(kp, V(0, 0, 0))); sad(K, lt, 1); }
  // defenders & teammates
  for (let k = 0; k < 4; k++) {
    const P = team(dt)[1 + k]; const dp = V(sx + s * (3 + k * 1.5), 0, sz + (k - 1.5) * 3.5 + Math.sin(lt + k)); place(P, dp, face(dp, sp));
    if (p < tIn + 0.05) run(P, lt * 9 + k, 0.5); else sad(P, lt, k);
  }
  for (let k = 0; k < 3; k++) {
    const P = team(at)[6 + k]; const tp = V(sx - s * (4 + k * 3), 0, sz + 8 - k * 8); place(P, tp, face(tp, V(gx, 0, 0)));
    if (p < tIn + 0.05) run(P, lt * 10 + k, 0.7); else { P.g.position.lerp(sp, seg(p, tIn + 0.05, 1) * 0.6); celebrate(P, lt); }
  }
  // camera
  const cm = o.cam ?? 'behind';
  if (cm === 'behind') {
    const cp = vl(V(sx - s * 14, 3.2, sz - 4), V(sx - s * 7, 2.2, sz - 1.5), ease(p));
    setCam(cp, vl(V(sx + s * 2, 1, sz), V(gx, 1.2, 0), ease(seg(p, 0.2, 0.7))), 44);
  } else if (cm === 'goal') {
    const cp = V(gx + s * 6, 1.6, lerp(5, 3, p)); setCam(cp, vl(sp.clone().add(V(0, 1.2, 0)), V(gx, 1.2, target.z), seg(p, tKick, tIn)), 50);
  } else if (cm === 'side') {
    setCam(V(lerp(sx - s * 4, gx - s * 6, p), 2.5, 20), V(lerp(sx, gx, ease(p)), 1, 0), 42);
  }
  if (p > tIn + 0.08) { const cel = seg(p, tIn + 0.08, 1); const c = shooter.g.position; const a = cel * 1.2 + 0.4; setCam(V(c.x - s * Math.cos(a) * 5, 1.4, c.z + Math.sin(a) * 5 + 1), V(c.x, 1.4, c.z), 42); }
};

SH.penalty = (o, p, lt, D) => {
  const at = o.team ?? 0, dt = 1 - at, s = o.side ?? 1, gx = s * GX;
  const K = keeper(dt), kicker = team(at)[o.idx ?? 9];
  const spot = V(gx - s * 11, 0, 0);
  const tKick = o.tKick ?? 0.45, tArr = o.tArr ?? 0.58;
  const runP = seg(p, 0.05, tKick);
  const kp = vl(V(spot.x - s * 6, 0, -3), V(spot.x - s * 0.6, 0, -0.4), runP);
  if (p > tKick) kp.x += s * (p - tKick) * 2.0;
  place(kicker, kp, face(kp, V(gx, 0, 0)));
  if (p < 0.05) idle(kicker, lt); else if (p < tKick - 0.05) run(kicker, lt * 9, 0.7);
  else if (p < tKick + 0.08) { const k = seg(p, tKick - 0.05, tKick + 0.08); kicker.legR.root.rotation.x = lerp(0.9, -1.3, k); kicker.legR.joint.rotation.x = lerp(1.3, 0.1, k); kicker.armL.root.rotation.z = 1.0; kicker.armR.root.rotation.z = -1.0; }
  else if (o.outcome === 'goal' && p > tArr + 0.05) { celebrate(kicker, lt); kicker.g.rotation.y = face(kp, V(gx - s * 30, 0, 20)); kicker.g.position.lerp(V(spot.x - s * 8, 0, 6), seg(p, tArr + 0.05, 1)); }
  else if (o.outcome !== 'goal' && p > tArr + 0.05 && !o.rebound) sad(kicker, lt, 2);
  else run(kicker, lt * 8, 0.4);
  const tz = o.tz ?? 2.4, ty = o.ty ?? 0.9;
  const target = V(gx + s * 0.2, ty, tz);
  const kz = o.outcome === 'goal' ? -(o.kDiveMag ?? 2.6) * Math.sign(tz) : tz;
  const dive = seg(p, tKick - 0.01, tArr + 0.02);
  const kpos = V(gx - s * 0.6, 0, lerp(0, kz * 0.85, easeOut(dive)));
  place(K, kpos, s > 0 ? -Math.PI / 2 : Math.PI / 2);
  if (dive > 0) { K.body.rotation.z = -Math.sign(kz) * s * dive * 1.35; K.body.position.y = Math.sin(dive * Math.PI) * 0.55 + dive * 0.15; armsUp(K, 0, 0); }
  else { K.legL.root.rotation.z = 0.25; K.legR.root.rotation.z = -0.25; K.legL.joint.rotation.x = 0.4; K.legR.joint.rotation.x = 0.4; K.armL.root.rotation.z = 0.8; K.armR.root.rotation.z = -0.8; K.body.position.y = -0.1 + Math.sin(lt * 6) * 0.03; K.g.position.z = Math.sin(lt * 3) * 0.3; }
  if (p > tArr + 0.2) { resetPose(K); if (o.outcome === 'goal') { place(K, V(gx - s * 0.6, 0, kz * 0.85), 0); sad(K, lt, 1); } else { place(K, V(gx - s * 1.2, 0, kz * 0.5), s > 0 ? -Math.PI / 2 : Math.PI / 2); if (o.keeperCeleb !== false) celebrate(K, lt); } }
  const b0 = spot.clone().add(V(0, 0.12, 0));
  let saved = o.outcome !== 'goal';
  if (p < tKick) setBall(b0, 0, 0);
  else if (p < tArr) setBall(arc(b0, target, 0.3, seg(p, tKick, tArr)), lt * 2, 2);
  else if (!saved) { const bp = target.clone().add(V(s * Math.min((p - tArr) * 7, 1.6), -Math.min((p - tArr) * 5, ty - 0.12), 0)); setBall(bp, lt, 0.3); }
  else {
    // deflect out
    const q = p - tArr; const reb = V(gx - s * (2 + q * 22), Math.max(0.12, 1.2 - q * 4 + Math.sin(Math.min(q * 8, Math.PI)) * 0.8), tz - q * 10);
    if (o.rebound) {
      const tReb = o.tReb ?? 0.78; // rebound shot from kicker
      const rp = V(gx - s * 6, 0.12, tz * 0.4);
      if (p < tReb) { setBall(vl(target, rp, seg(p, tArr, tReb)).setY(Math.max(0.12, 1 - seg(p, tArr, tReb))), lt, 1); }
      else { const t2 = seg(p, tReb, tReb + 0.08); const goalPt = V(gx + s * 0.4, 0.8, -tz * 0.6); setBall(t2 < 1 ? vl(rp, goalPt, t2) : goalPt.clone().add(V(s * Math.min((p - tReb - 0.08) * 6, 1.5), -Math.min((p - tReb - 0.08) * 3, 0.6), 0)), lt, 1); if (t2 >= 1) netRipple(s, Math.max(0, 1 - (p - tReb - 0.08) * 3), goalPt.z, goalPt.y); }
      // kicker follows to rebound
      if (p > tArr) { const kk = vl(kp, V(rp.x - s * 0.8, 0, rp.z - 0.3), seg(p, tArr, tReb)); place(kicker, kk, face(kk, V(gx, 0, 0))); if (p < tReb) run(kicker, lt * 11); else if (p < tReb + 0.06) { kicker.legR.root.rotation.x = -1.2; } else celebrate(kicker, lt); }
    } else setBall(reb, lt, 1);
  }
  if (!saved && p > tArr) netRipple(s, Math.max(0, 1 - (p - tArr) * 3), tz, ty); else if (!o.rebound) netRipple(s, 0);
  // teammates at the halfway / edge of box
  for (let k = 0; k < 5; k++) { const P = team(k % 2 ? dt : at)[2 + k]; const pp = V(gx - s * (21 + (k % 2) * 1.2), 0, (k - 2) * 3.4); place(P, pp, face(pp, V(gx, 0, 0))); if (o.rebound && P.team === at && p > 0.75) celebrate(P, lt); else idle(P, lt); }
  if (o.confetti && p > 0.65) showConfetti(V(gx - s * 3, 0, 0), lt, 14);
  const cm = o.cam ?? 'behind';
  if (cm === 'behind') setCam(vl(V(spot.x - s * 11, 2.6, -1.5), V(spot.x - s * 6.5, 1.9, -0.8), ease(p)), V(gx, 1.1, 0), 40);
  else setCam(V(gx + s * 5, 1.5, lerp(-2, -1, p)), V(spot.x, 1.0, 0), 52);
  if (o.celebrate && p > 0.75) { const c = kicker.g.position; const a = (p - 0.75) * 3; setCam(V(c.x - s * 4 * Math.cos(a), 1.5, c.z + 4 * Math.sin(a) + 1), V(c.x, 1.3, c.z), 42); }
};

SH.save = (o, p, lt, D) => {
  // 1v1 attacker vs keeper, keeper saves (o.double for two saves)
  const at = o.team ?? 1, dt = 1 - at, s = o.side ?? 1, gx = s * GX;
  const K = keeper(dt), A = team(at)[o.idx ?? 9];
  const t1 = o.t1 ?? 0.4, t2 = o.t2 ?? 0.7;
  const ap = vl(V(gx - s * 20, 0, -6), V(gx - s * 7.5, 0, -2.5), ease(seg(p, 0, t1)));
  place(A, ap, face(ap, V(gx, 0, 0)));
  if (p < t1 - 0.04) run(A, lt * 11); else if (p < t1 + 0.06) { const k = seg(p, t1 - 0.04, t1 + 0.06); A.legR.root.rotation.x = lerp(0.9, -1.3, k); A.legR.joint.rotation.x = lerp(1.2, 0.1, k); }
  else if (o.double && p < t2) { A.g.position.lerp(V(gx - s * 4.5, 0, -1), seg(p, t1 + 0.06, t2 - 0.04)); run(A, lt * 12); if (p > t2 - 0.04) { A.legR.root.rotation.x = -1.2; } }
  else sad(A, lt, 2);
  const kBase = V(gx - s * 2.5, 0, -0.8);
  const d1 = seg(p, t1 - 0.02, t1 + 0.12);
  place(K, kBase, face(kBase, ap));
  let ballP;
  const shot1T = V(gx - s * 2.5, 0.5, 1.4);
  if (p < t1) { ballP = ap.clone().add(V(s * 0.8, 0.12, 0.2)); ballP.y = 0.12; K.legL.joint.rotation.x = 0.6; K.legR.joint.rotation.x = 0.6; K.body.position.y = -0.2; K.armL.root.rotation.z = 0.9; K.armR.root.rotation.z = -0.9; }
  else if (!o.double || p < t2 - 0.05) {
    // first save: keeper spreads / dives right, ball deflects
    K.body.rotation.z = -s * d1 * 1.3; K.body.position.y = Math.sin(d1 * Math.PI) * 0.35; armsUp(K, 0, 0); K.legR.root.rotation.z = -0.7;
    const bt = seg(p, t1, t1 + 0.07);
    const b0 = V(ap.x + s * 0.8, 0.12, ap.z + 0.2);
    ballP = bt < 1 ? vl(b0, shot1T, bt) : vl(shot1T, o.double ? V(gx - s * 4.3, 0.12, -1.0) : V(gx - s * 8, 2.5, 6), seg(p, t1 + 0.07, o.double ? t2 - 0.05 : t1 + 0.35));
    if (!o.double && p > t1 + 0.35) ballP = V(gx + s * 2, 0.12, 9);
    if (o.double) ballP.y = Math.max(0.12, ballP.y);
  } else {
    // second save: keeper still on ground lifts arm, ball over the bar
    K.body.rotation.z = -s * 1.3; K.body.position.y = 0.35; armsUp(K, 0, 0);
    const k2 = seg(p, t2 - 0.03, t2 + 0.05); K.armR.root.rotation.x = -2.9 - k2 * 0.3; K.g.position.z = -0.8 + k2 * 0.6;
    const b0 = V(gx - s * 4.3, 0.12, -1.0); const hit = V(gx - s * 2.6, 1.6, -0.6);
    const bt = seg(p, t2 - 0.03, t2 + 0.03);
    ballP = bt < 1 ? vl(b0, hit, bt) : arc(hit, V(gx + s * 3, 0.12, 0.5), 2.2, seg(p, t2 + 0.03, t2 + 0.25));
  }
  if (p > (o.double ? t2 + 0.15 : t1 + 0.25)) { resetPose(K); place(K, kBase, face(kBase, V(0, 0, 0))); if (o.keeperCeleb !== false) celebrate(K, lt); }
  setBall(ballP, lt, 1.5);
  for (let k = 0; k < 4; k++) { const P = team(dt)[2 + k]; const pp = vl(V(gx - s * (24 - k), 0, -8 + k * 4), V(gx - s * (9 + k), 0, -2 + k * 1.5), ease(p)); place(P, pp, face(pp, V(gx, 0, 0))); run(P, lt * 11 + k); }
  const cm = o.cam ?? 'goal';
  if (cm === 'goal') setCam(V(gx + s * 3, 1.2, lerp(4, 3, p)), vl(ap.clone().add(V(0, 1, 0)), V(gx - s * 3, 0.8, 0), seg(p, t1 - 0.1, t1 + 0.1)), 52);
  else setCam(V(lerp(gx - s * 16, gx - s * 10, p), 2.0, 10), V(gx - s * 4, 0.9, -1), 44);
};

SH.corner = (o, p, lt, D) => {
  const at = o.team ?? 0, dt = 1 - at, s = o.side ?? 1, gx = s * GX;
  const flag = V(gx - s * 0.6, 0, o.cz ?? -33.5);
  const taker = team(at)[7]; const K = keeper(dt);
  const tKick = o.tKick ?? 0.3, tHead = o.tHead ?? 0.62, tIn = o.tIn ?? 0.75;
  const tp = vl(V(flag.x - s * 3, 0, flag.z + 2 * Math.sign(-flag.z) * -1), flag, ease(seg(p, 0.05, tKick)));
  place(taker, tp, face(tp, V(gx - s * 8, 0, 0)));
  if (p < tKick - 0.05) run(taker, lt * 8, 0.5); else if (p < tKick + 0.06) { const k = seg(p, tKick - 0.05, tKick + 0.06); taker.legR.root.rotation.x = lerp(0.9, -1.4, k); taker.legR.joint.rotation.x = lerp(1.3, 0.1, k); } else idle(taker, lt);
  const b0 = flag.clone().add(V(0, 0.12, 0)).add(V(-s * 0.3, 0, -Math.sign(flag.z) * 0.3));
  const headPt = V(gx - s * (o.hx ?? 6), o.flick ? 2.0 : 2.1, o.hz ?? -1.5);
  const goalPt = V(gx + s * 0.4, o.gy ?? 0.7, o.gz ?? 1.5);
  // header guy
  const H = team(at)[o.idx ?? 9]; const hp0 = V(gx - s * 12, 0, (o.hz ?? -1.5) + 4); const hpos = vl(hp0, headPt.clone().setY(0), ease(seg(p, tKick, tHead)));
  place(H, hpos, face(hpos, V(gx, 0, 0)));
  const jump = Math.sin(seg(p, tHead - 0.08, tHead + 0.06) * Math.PI) * 0.55;
  H.g.position.y = jump; H.sh.position.y = 0.02 - jump;
  if (p < tHead - 0.08) run(H, lt * 11); else if (p < tHead + 0.08) { H.armL.root.rotation.x = -1.2; H.armR.root.rotation.x = -1.2; H.armL.root.rotation.z = 0.8; H.armR.root.rotation.z = -0.8; H.legL.joint.rotation.x = 1.2; H.head.rotation.x = 0.3; }
  else if (!o.setupOnly && p > tIn) celebrate(H, lt); else run(H, lt * 7, 0.4);
  // second player for flick goal (finisher)
  let F = null;
  if (o.flick) {
    F = team(at)[10]; const f0 = V(gx - s * 9, 0, 2.5); const fpos = vl(f0, V(gx - s * 1.8, 0, goalPt.z - 0.2), ease(seg(p, tKick, tIn)));
    place(F, fpos, face(fpos, V(gx, 0, 0)));
    if (p < tIn - 0.04) run(F, lt * 12); else if (p < tIn + 0.05) { F.legR.root.rotation.x = -1.6; F.legR.joint.rotation.x = 0.1; F.body.rotation.x = -0.3; F.armL.root.rotation.z = 1.0; } else { celebrate(F, lt); F.g.rotation.y = face(fpos, V(gx - s * 20, 0, 34)); F.g.position.lerp(V(gx - s * 10, 0, 20), seg(p, tIn + 0.05, 1) * 0.5); }
  }
  // ball
  if (p < tKick) setBall(b0, 0, 0);
  else if (p < tHead) setBall(arc(b0, headPt.clone().add(V(0, 0.45, 0)), 6, seg(p, tKick, tHead)), lt * 2, 2);
  else if (o.setupOnly) setBall(arc(headPt.clone().add(V(0, 0.45, 0)), V(gx - s * 20, 0.12, 6), 3, seg(p, tHead, 1)), lt, 1);
  else if (o.flick) {
    const fP = V(gx - s * 1.8, 0.4, goalPt.z - 0.2);
    if (p < tIn) setBall(arc(headPt.clone().add(V(0, 0.45, 0)), fP, 0.6, seg(p, tHead, tIn)), lt, 1);
    else { const q = seg(p, tIn, tIn + 0.05); setBall(q < 1 ? vl(fP, goalPt, q) : goalPt.clone().add(V(s * Math.min((p - tIn - 0.05) * 5, 1.4), -Math.min((p - tIn) * 4, goalPt.y - 0.12), 0)), lt, 1); }
  } else {
    if (p < tIn) setBall(vl(headPt.clone().add(V(0, 0.45, 0)), goalPt, seg(p, tHead, tIn)), lt, 1);
    else setBall(goalPt.clone().add(V(s * Math.min((p - tIn) * 6, 1.5), -Math.min((p - tIn) * 4, goalPt.y - 0.12), 0)), lt, 0.4);
  }
  if (!o.setupOnly && p > tIn) netRipple(s, Math.max(0, 1 - (p - tIn) * 3) * 0.9, goalPt.z, goalPt.y); else netRipple(s, 0);
  // keeper
  const kd = seg(p, tHead, tIn);
  const kpos = V(gx - s * 0.8, 0, lerp(0, -goalPt.z * 0.9, kd * (o.setupOnly ? 0 : 1)));
  place(K, kpos, s > 0 ? -Math.PI / 2 : Math.PI / 2);
  if (!o.setupOnly && kd > 0) { K.body.rotation.z = s * Math.sign(goalPt.z) * kd * 0.8; armsUp(K, 0, 0); } else { K.armL.root.rotation.z = 0.6; K.armR.root.rotation.z = -0.6; }
  // box crowd: defenders and attackers
  for (let k = 0; k < 7; k++) {
    const isD = k % 2 === 0; const P = team(isD ? dt : at)[isD ? 1 + k / 2 : 2 + (k - 1) / 2];
    const bz = (k - 3) * 2.4 + Math.sin(lt * 2 + k) * 0.6; const bx = gx - s * (5 + (k % 3) * 2.5);
    const pp = V(bx, 0, bz); place(P, pp, face(pp, isD ? V(flag.x, 0, flag.z) : V(gx, 0, 0)));
    const j = p > tHead - 0.1 && p < tHead + 0.05 && k < 4 ? Math.sin(seg(p, tHead - 0.1, tHead + 0.05) * Math.PI) * 0.4 : 0;
    P.g.position.y = j; P.sh.position.y = 0.02 - j;
    if (!o.setupOnly && p > tIn + 0.05) { if (P.team === at) celebrate(P, lt); else sad(P, lt, k); } else idle(P, lt);
  }
  const cm = o.cam ?? 'tv';
  if (cm === 'tv') setCam(V(gx - s * lerp(22, 18, p), 9, lerp(30, 26, p)), vl(V(gx - s * 8, 0, -8), V(gx - s * 4, 1, 0), ease(seg(p, tKick, tHead))), 42);
  else if (cm === 'flag') setCam(V(flag.x - s * 6, 2.2, flag.z - Math.sign(flag.z) * 6), vl(V(flag.x, 0.5, flag.z), headPt, ease(seg(p, tKick, tHead))), 50);
  else if (cm === 'goal') setCam(V(gx + s * 4, 1.8, 3.5), vl(V(gx - s * 12, 2, -10), headPt, ease(seg(p, tKick, tHead))), 52);
  if (!o.setupOnly && p > tIn + 0.1) { const c = (F || H).g.position; const a = seg(p, tIn + 0.1, 1); setCam(V(c.x - s * 4.5, 1.6, c.z + 3 + a * 2), V(c.x, 1.3, c.z), 44); }
};

SH.header = (o, p, lt, D) => SH.corner({ ...o, cz: o.cz ?? 20, flagCross: true }, p, lt, D);

SH.celebrate = (o, p, lt) => {
  const T = o.team ?? 0, A = team(T), B = team(1 - T);
  const c = V(o.x ?? 0, 0, o.z ?? 0);
  for (let i = 0; i < 11; i++) {
    const ang = i / 11 * Math.PI * 2 + 0.3, rr = 1.2 + (i % 3) * 0.9;
    const pp = c.clone().add(V(Math.cos(ang) * rr, 0, Math.sin(ang) * rr));
    place(A[i], pp, face(pp, c) + Math.PI + Math.sin(lt + i) * 0.5); celebrate(A[i], lt);
  }
  for (let i = 0; i < 11; i++) {
    const pp = V(c.x + (o.sadDir ?? 1) * (12 + (i % 4) * 4), 0, -14 + i * 2.8); place(B[i], pp, face(pp, c) + 2); sad(B[i], lt, i);
    if (o.noSad) B[i].g.visible = false;
  }
  if (o.confetti) showConfetti(c, lt, 16);
  hideBall();
  if (o.trophy) { trophy.visible = true; trophy.position.set(c.x, 2.6 + Math.sin(lt * 2) * 0.05 + Math.sin(lt * 5.5) * 0.15, c.z); trophy.rotation.y = lt * 0.6; }
  const a = lerp(o.a0 ?? -0.4, o.a1 ?? 0.9, p), r = lerp(o.r0 ?? 12, o.r1 ?? 8.5, ease(p));
  setCam(V(c.x + Math.cos(a) * r, lerp(o.h0 ?? 1.5, o.h1 ?? 2.4, p), c.z + Math.sin(a) * r), V(c.x, 1.6, c.z), 44);
};

SH.trophy = (o, p, lt) => {
  const T = o.team ?? 0, A = team(T);
  const c = V(o.x ?? 0, 0, o.z ?? 0);
  trophy.visible = true;
  const lift = o.lift ? seg(p, 0.15, 0.55) : 0;
  const lifter = A[o.idx ?? 9];
  if (o.lift) {
    place(lifter, c, Math.PI * 0.25); armsUp(lifter, 0, 0); lifter.armL.root.rotation.x = lerp(-0.9, -3.0, ease(lift)); lifter.armR.root.rotation.x = lerp(-0.9, -3.0, ease(lift));
    lifter.armL.root.rotation.z = 0.15; lifter.armR.root.rotation.z = -0.15;
    trophy.position.set(c.x, lerp(1.2, 2.55, ease(lift)) + Math.sin(lt * 6) * 0.04 * lift, c.z + 0.15);
    trophy.rotation.set(0, 0.7, Math.sin(lt * 6) * 0.05 * lift);
    for (let i = 0; i < 11; i++) {
      if (i === (o.idx ?? 9)) continue; const ang = Math.PI + 0.8 + (i / 10 - 0.5) * 2.6, rr = 2.0 + (i % 3) * 1.1;
      const pp = c.clone().add(V(Math.cos(ang) * rr, 0, Math.sin(ang) * rr)); place(A[i], pp, face(pp, c)); if (lift > 0.8) celebrate(A[i], lt); else armsUp(A[i], lt);
    }
  } else {
    trophy.position.set(c.x, 1.0, c.z); trophy.rotation.set(0, lt * 0.5, 0);
    const ped = trophy.userData.ped || (trophy.userData.ped = (() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 1.0, 24), new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.3, metalness: 0.5 })); scene.add(m); return m; })());
    ped.visible = true; ped.position.set(c.x, 0.5, c.z);
  }
  if (o.ribbons) trophy.userData.ribbons.forEach((r, k) => { r.visible = true; r.material.color.set(o.ribbons[k % o.ribbons.length]); r.rotation.z = Math.sin(lt * 2 + k) * 0.1; });
  trophy.scale.setScalar(o.scale ?? 1);
  if (o.confetti) showConfetti(c, lt, 14);
  hideBall();
  const a = lerp(o.a0 ?? 0.3, o.a1 ?? 1.3, ease(p)), r = o.lift ? lerp(6.5, 4.8, ease(p)) : lerp(6, 4.6, ease(p));
  const ly = o.lift ? lerp(1.8, 2.3, ease(lift)) : 1.55;
  setCam(V(c.x + Math.cos(a) * r, o.lift ? lerp(1.3, 0.9, p) : lerp(1.4, 1.8, p), c.z + Math.sin(a) * r), V(c.x, ly, c.z), 42);
};

SH.crowd = (o, p, lt) => {
  // camera near stands looking at fans
  const nflS = nfl();
  const a0 = nflS ? 72 : 64;
  const x = lerp(-18, 18, p);
  if (!nflS) soccerShape(lt, {});
  setCam(V(x, 6, -(nflS ? 14 : 18)), V(x + 4, 13, -(nflS ? 60 : 70)), 46);
  if (!scarfMesh) {
    scarfMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.9, 0.18), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), 600);
    for (let i = 0; i < 600; i++) scarfMesh.setColorAt(i, new THREE.Color(i % 2 ? (o.scarf || CFG.teams[0].shirt) : '#ffffff'));
    scene.add(scarfMesh);
  }
  scarfMesh.visible = true;
  const b0 = nflS ? 40 : 46;
  for (let i = 0; i < 600; i++) {
    const f = hash(i * 1.9), xx = (hash(i * 4.1) - 0.5) * 70;
    const z = -(b0 + f * 40) + 0.6, y = 1.5 + f * 34 + 1.4 + Math.abs(Math.sin(lt * 5 + i)) * 0.4;
    _e.set(0, 0, Math.sin(lt * 4 + i * 0.3) * 0.4); _q.setFromEuler(_e);
    _m.compose(V(xx, y, z), _q, _s); scarfMesh.setMatrixAt(i, _m);
  }
  scarfMesh.instanceMatrix.needsUpdate = true;
  hideBall();
};

SH.outro = (o, p, lt) => {
  if (sport === 'tennis') { tennisIdle(lt); hideBall(); const a = lerp(0.8, 1.6, p), r = lerp(14, 24, ease(p)); setCam(V(Math.cos(a) * r, lerp(7, 14, ease(p)), Math.sin(a) * r), V(0, 0, 0), 50); return; }
  if (nfl()) formationNFL(0, 1, lt, 'both', false); else soccerShape(lt, {});
  const a = lerp(0.8, 1.6, p), r = lerp(38, 58, ease(p));
  setCam(V(Math.cos(a) * r, lerp(14, 34, ease(p)), Math.sin(a) * r), V(0, 0, 0), 55);
  hideBall();
};


// ---------- VERSUS (Messi vs CR7) ----------
let vsObjs = null;
function vsBuild() {
  if (vsObjs) return vsObjs;
  const gold = new THREE.MeshStandardMaterial({ color: '#f3c442', metalness: 0.8, roughness: 0.25, envMapIntensity: 2, emissive: '#3a2600' });
  const mk = (col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.35, metalness: 0.3, emissive: col, emissiveIntensity: 0.25 });
  const pods = [0, 1].map(i => { const m = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.8, 32), new THREE.MeshStandardMaterial({ color: '#1b1d24', roughness: 0.3, metalness: 0.6 })); scene.add(m); return m; });
  const rings = [0, 1].map(i => { const m = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.06, 8, 48), mk(i ? CFG.teams[1].shirt : CFG.teams[0].shirt)); m.rotation.x = Math.PI / 2; scene.add(m); return m; });
  const bars = [0, 1].map(i => { const g = new THREE.BoxGeometry(1.6, 1, 1.6); g.translate(0, 0.5, 0); const m = new THREE.Mesh(g, mk(i ? CFG.teams[1].shirt : CFG.teams[0].alt || CFG.teams[0].shirt)); scene.add(m); return m; });
  const crowns = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), gold); scene.add(m); return m; });
  vsObjs = { pods, rings, bars, crowns, mk }; return vsObjs;
}
function vsHide() { if (!vsObjs) return; for (const k of ['pods', 'rings', 'bars', 'crowns']) vsObjs[k].forEach(m => m.visible = false); }
SH.versus = (o, p, lt) => {
  const V2 = vsBuild(); const A = team(0)[9], B = team(1)[9];
  const xs = [-2.2, 2.2], podH = 0.8;
  const vals = o.vals || [1, 1]; const mx = Math.max(...vals.map(v => typeof v === 'number' ? v : 1));
  const grow = easeOut(seg(p, 0.12, 0.55));
  [0, 1].forEach(i => {
    V2.pods[i].visible = true; V2.pods[i].position.set(xs[i], 0.4, 0); V2.rings[i].visible = true; V2.rings[i].position.set(xs[i], 0.82, 0);
    const h = o.noBars ? 0 : 0.2 + 3.2 * (typeof vals[i] === 'number' ? vals[i] / mx : 1) * grow;
    V2.bars[i].visible = !o.noBars; V2.bars[i].position.set(xs[i], 0, -2.4); V2.bars[i].scale.set(1, Math.max(0.01, h), 1);
    const isW = o.win === i || o.win === 2; const showW = p > 0.55 && isW;
    V2.crowns[i].visible = showW && !o.noBars; V2.crowns[i].position.set(xs[i], h + 0.7 + Math.sin(lt * 4) * 0.1, -2.4);
    const P = i ? B : A; place(P, V(xs[i], podH, 0), i ? -0.35 : 0.35);
    if (showW) celebrate(P, lt); else if (p > 0.55 && o.win != null && o.win !== 2) sad(P, lt, 2); else idle(P, lt);
    P.g.position.y = podH + (showW ? P.body.position.y * 0 : 0);
    if (!o.noBars && typeof vals[i] !== 'undefined') CFG._labels.push({ w: V(xs[i], h + 0.25, -2.4), txt: String(o.txt ? o.txt[i] : Math.round(typeof vals[i] === 'number' ? vals[i] * (o.countUp ? grow : 1) : 0)), col: isW && p > 0.55 ? '#ffd400' : '#ffffff' });
  });
  if (o.confetti) showConfetti(V(0, 0, 0), lt, 10);
  hideBall();
  const a = lerp(o.a0 ?? -0.25, o.a1 ?? 0.25, ease(p)), r = lerp(o.r0 ?? 19, o.r1 ?? 16, ease(p));
  setCam(V(Math.sin(a) * r, lerp(o.h0 ?? 2.6, o.h1 ?? 2.2, p), Math.cos(a) * r), V(0, 2.0, -0.8), 40);
};
SH.vsIntro = (o, p, lt) => {
  vsHide(); const A = team(0)[9], B = team(1)[9]; const d = lerp(6, 1.6, easeOut(seg(p, 0, 0.6)));
  place(A, V(-d, 0, 0), Math.PI / 2); place(B, V(d, 0, 0), -Math.PI / 2);
  if (p < 0.6) { run(A, lt * 9, 0.6); run(B, lt * 9 + 1, 0.6); } else { idle(A, lt); idle(B, lt); }
  setBall(V(0, 0.12, 0.4), lt, 0.2);
  const a = lerp(-1.2, -0.2, ease(p)); setCam(V(Math.sin(a) * 7, lerp(0.8, 1.5, p), Math.cos(a) * 7), V(0, 1.4, 0), 44);
};


// ---------- TENNIS 3D ----------
function TP(i) { return team(i)[1]; }
function tennisIdle(lt) { [0, 1].forEach(i => { const P = TP(i); const x = i ? 12.4 : -12.4; place(P, V(x, 0, Math.sin(lt * 0.8 + i) * 0.6), i ? -Math.PI / 2 : Math.PI / 2); idle(P, lt); P.body.position.y = Math.abs(Math.sin(lt * 5 + i)) * 0.05; P.legL.joint.rotation.x = 0.3; P.legR.joint.rotation.x = 0.3; }); }
function swingArm(P, sw, back = false) { P.armR.root.rotation.x = -0.9 + (back ? -0.4 : 0); P.armR.root.rotation.z = lerp(-1.3, 1.1, sw); P.armR.joint.rotation.x = -0.4; P.body.rotation.y = lerp(-0.5, 0.5, sw); }
function tennisRally(lt, p, o) {
  const cyc = o.cyc ?? 1.7; const ph = (lt % cyc) / cyc; const AtoB = ph < 0.5; const q = AtoB ? ph * 2 : ph * 2 - 1;
  const zs = [Math.sin(lt * 1.1) * 3, Math.cos(lt * 0.9) * 3];
  const pos = [V(-12.2, 0, zs[0]), V(12.2, 0, zs[1])];
  [0, 1].forEach(i => { const P = TP(i); place(P, pos[i], i ? -Math.PI / 2 : Math.PI / 2); run(P, lt * 7 + i, 0.35);
    const hitPh = i === 0 ? 0 : 0.5; let d = Math.abs(ph - hitPh); d = Math.min(d, 1 - d); swingArm(P, clamp(1 - d * 6)); });
  const from = AtoB ? pos[0] : pos[1], to = AtoB ? pos[1] : pos[0]; const s = AtoB ? 1 : -1;
  const hitA = from.clone().add(V(s * 0.5, 1.1, -0.4)), hitB = to.clone().add(V(-s * 0.5, 1.0, -0.4)); const bounce = V(to.x - s * 3.5, 0.08, lerp(hitA.z, hitB.z, 0.8));
  let bp; if (q < 0.72) bp = arc(hitA, bounce, 1.6, q / 0.72); else bp = arc(bounce, hitB, 0.5, (q - 0.72) / 0.28);
  setBall(bp, lt, 2); return pos;
}
SH.tIntro3 = (o, p, lt) => { tennisIdle(lt); hideBall(); const a = lerp(o.a0 ?? 0.6, o.a1 ?? 1.4, ease(p)), r = lerp(46, 26, ease(p)); setCam(V(Math.cos(a) * r, lerp(26, 11, ease(p)), Math.sin(a) * r), V(0, 0, 0), 46); };
SH.tRally3 = (o, p, lt) => {
  const pos = tennisRally(lt, p, o);
  if (o.winner != null && p > (o.winAt ?? 0.65)) { const L = TP(1 - o.winner); const dv = seg(p, o.winAt ?? 0.65, (o.winAt ?? 0.65) + 0.15); L.body.rotation.z = dv * 1.2; L.body.position.y = Math.sin(dv * Math.PI) * 0.3; const W2 = TP(o.winner); resetPose(W2); place(W2, pos[o.winner], o.winner ? -Math.PI / 2 : Math.PI / 2); celebrate(W2, lt); setBall(V(o.winner ? -16 : 16, 0.1 + Math.max(0, 1 - dv) * 0.5, 4.5), lt, 1); }
  const cm = o.cam || 'tv';
  if (cm === 'tv') setCam(V(-21, 7, lerp(-1.5, 1.5, p)), V(0, 0.3, 0), 52);
  else if (cm === 'tvB') setCam(V(21, 7, lerp(1.5, -1.5, p)), V(0, 0.3, 0), 52);
  else if (cm === 'side') setCam(V(lerp(-18, -15, p), 5.5, lerp(9, 7, p)), V(-5, 0.6, -0.5), 54);
  else if (cm === 'low') { const P = TP(o.focus ?? 0); const c = P.g.position; setCam(c.clone().add(V((o.focus ? 1 : -1) * 4.5, 1.3, 3.2)), c.clone().add(V(0, 1.1, 0)), 44); }
};
SH.tStat3 = (o, p, lt) => { tennisIdle(lt); hideBall(); setCam(V(lerp(-3, 3, p), 1.3, 9.5), V(0, 1.6, 0), 46); if (o.crowd) setCam(V(0, 3, -4), V(lerp(-8, 8, p), 7, -17), 50); };
SH.tCeleb3 = (o, p, lt) => { const W2 = TP(o.w ?? 0), L = TP(1 - (o.w ?? 0)); place(W2, V(o.w ? 6 : -6, 0, 0), o.w ? -Math.PI / 2 : Math.PI / 2); celebrate(W2, lt); place(L, V(o.w ? -3 : 3, 0, 1.5), o.w ? Math.PI / 2 : -Math.PI / 2); sad(L, lt, 2);
  hideBall(); if (o.confetti !== false) showConfetti(W2.g.position, lt, 10);
  if (o.trophy) { trophy.visible = true; trophy.position.copy(W2.g.position).add(V(0, 2.55 + W2.body.position.y, 0)); trophy.rotation.y = lt; }
  const c = W2.g.position; const a = lerp(-0.6, 0.6, p); setCam(c.clone().add(V((o.w ? -1 : 1) * Math.cos(a) * 7, 1.8, Math.sin(a) * 7)), c.clone().add(V(0, 1.5, 0)), 44); };

// ---------- overlay ----------
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function fitFont(g, txt, max, size, weight = 'bold') { let s = size; g.font = `${weight} ${s}px DejaVu Sans`; while (g.measureText(txt).width > max && s > 20) { s -= 4; g.font = `${weight} ${s}px DejaVu Sans`; } return s; }

function drawScoreboard(g, sh, p, t) {
  const sc = valAt(sh.score, p) || [0, 0], clk = valAt(sh.clock, p) || '';
  const A = CFG.teams[0], B = CFG.teams[1];
  const x = 90, y = 190, w = 900, h = 96;
  g.save();
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 20;
  rr(g, x, y, w, h, 18); g.fillStyle = 'rgba(12,14,22,0.88)'; g.fill(); g.shadowBlur = 0;
  // team blocks
  const tb = (T, bx, align) => {
    g.fillStyle = T.shirt === '#ffffff' ? (T.alt || '#ddd') : T.shirt; rr(g, bx, y + 14, 16, h - 28, 6); g.fill();
    if (T.stripes) { g.fillStyle = T.stripes; g.fillRect(bx + 5, y + 14, 6, h - 28); }
  };
  tb(A, x + 18, 'l'); tb(B, x + w - 34, 'r');
  g.fillStyle = '#fff'; g.textBaseline = 'middle';
  g.font = 'bold 46px DejaVu Sans'; g.textAlign = 'left'; g.fillText(A.abbr, x + 50, y + h / 2 + 2);
  g.textAlign = 'right'; g.fillText(B.abbr, x + w - 50, y + h / 2 + 2);
  // score box
  const cx = x + w / 2;
  const bump = (k) => { const ch = sh._chg && sh._chg[k] != null ? clamp(1 - (p - sh._chg[k]) * 8) : 0; return ch; };
  const longS = String(sc[0]).length > 2 || String(sc[1]).length > 2; const bw2 = longS ? 440 : 300, off = longS ? 112 : 75;
  rr(g, cx - bw2 / 2, y + 8, bw2, h - 16, 12); g.fillStyle = CFG.accent || '#ffd400'; g.fill();
  g.fillStyle = '#111'; g.textAlign = 'center';
  const sa = String(sc[0]), sb = String(sc[1]);
  for (const [k, txt, xx] of [[0, sa, cx - off], [1, sb, cx + off]]) {
    const ch = changeAt(sh.score, p); const b = ch && ch.k.includes(k) && p - ch.p < 0.25 ? 1 + 0.35 * Math.max(0, Math.sin((p - ch.p) * 40)) : 1;
    g.save(); g.translate(xx, y + h / 2 + 3); g.scale(b, b); fitFont(g, txt, longS ? 190 : 130, longS ? 52 : 60); g.fillText(txt, 0, 0); g.restore();
  }
  g.font = 'bold 40px DejaVu Sans'; g.fillText('-', cx, y + h / 2);
  // clock & label
  if (clk) {
    g.font = 'bold 34px DejaVu Sans'; const cw = g.measureText(clk).width + 40;
    rr(g, cx - cw / 2, y + h + 10, cw, 52, 10); g.fillStyle = 'rgba(12,14,22,0.85)'; g.fill();
    g.fillStyle = '#fff'; g.fillText(clk, cx, y + h + 37);
  }
  g.font = 'bold 28px DejaVu Sans'; g.fillStyle = 'rgba(255,255,255,0.9)'; g.textAlign = 'center';
  g.fillText(CFG.label, cx, y - 26);
  g.restore();
}
function isSeq(v) { return Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && v[0].length === 2 && typeof v[0][1] !== 'number'; }
function changeAt(v, p) { if (!isSeq(v)) return null; let r = null; for (let i = 1; i < v.length; i++) if (p >= v[i][0]) { const a = v[i - 1][1], b = v[i][1]; r = { p: v[i][0], k: [0, 1].filter(k => String(a[k]) !== String(b[k])) }; } return r; }
function startOf(v, p) { if (!isSeq(v)) return 0; let r = 0; for (const [pp] of v) if (p >= pp) r = pp; return r; }
function valAt(v, p) {
  if (v == null) return null;
  if (Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && v[0].length === 2 && typeof v[0][1] !== 'number') { // [[p, val],...]
    let r = v[0][1]; for (const [pp, val] of v) if (p >= pp) r = val; return r;
  }
  return v;
}

function drawCaption(g, segI, t) {
  const S = CFG.segs[segI]; if (!S) return;
  const words = S.text.split(/\s+/);
  const span = Math.max(0.5, S.end - S.start);
  const lens = words.map(w => w.length + 1.5), tot = lens.reduce((a, b) => a + b, 0);
  let acc = 0; const wt = lens.map(l => { const s = S.start + acc / tot * span; acc += l; return s; });
  // chunk words into groups of max ~16 chars
  const chunks = []; let cur = [];
  words.forEach((w, i) => { const len = cur.reduce((a, k) => a + words[k].length + 1, 0) + w.length; if (cur.length && (len > 17 || /[.,:!?]$/.test(words[cur[cur.length - 1]]))) { chunks.push(cur); cur = []; } cur.push(i); });
  if (cur.length) chunks.push(cur);
  let ci = 0; for (let k = 0; k < chunks.length; k++) if (t >= wt[chunks[k][0]] - 0.05) ci = k;
  if (t < S.start - 0.2) return;
  const ch = chunks[ci]; const st = wt[ch[0]];
  const pop = clamp((t - st + 0.05) / 0.12); const sc = 0.85 + 0.15 * easeOut(pop);
  const y = 1240;
  g.save(); g.translate(W / 2, y); g.scale(sc, sc);
  const txts = ch.map(i => words[i].toUpperCase());
  let fs = 92; g.font = `bold ${fs}px DejaVu Sans`;
  const sp = 24; let tw = txts.reduce((a, s) => a + g.measureText(s).width, 0) + sp * (txts.length - 1);
  while (tw > 960 && fs > 50) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; tw = txts.reduce((a, s) => a + g.measureText(s).width, 0) + sp * (txts.length - 1); }
  let x = -tw / 2; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineJoin = 'round';
  txts.forEach((s, k) => {
    const i = ch[k]; const active = t >= wt[i] && (i === words.length - 1 || t < wt[i + 1]);
    const w = g.measureText(s).width;
    g.lineWidth = 16; g.strokeStyle = 'rgba(0,0,0,0.9)'; g.strokeText(s, x, 0);
    g.fillStyle = active ? (CFG.accent || '#ffd400') : '#ffffff'; g.fillText(s, x, 0);
    x += w + sp;
  });
  g.restore();
}

function drawBig(g, sh, p, t, lt, D) {
  const big = valAt(sh.big, p); if (!big) return;
  const a = clamp((p - startOf(sh.big, p)) * D / 0.25);
  const sc = big === sh._lastBig ? 1 : 1;
  const k = easeOut(a); const s = lerp(1.8, 1, k);
  g.save(); g.globalAlpha = k; g.translate(W / 2, sh.bigY ?? 760); g.scale(s, s); g.rotate(-0.04);
  const lines = big.split('\n');
  lines.forEach((ln, i) => {
    const fs = fitFont(g, ln, 980, i === 0 ? (sh.bigSize ?? 170) : 80, 'bold');
    const yy = (i - (lines.length - 1) / 2) * (i === 0 ? 0 : 1) * 130 + (i > 0 ? 40 : 0);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    g.lineWidth = 22; g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(ln, 0, yy);
    const gr = g.createLinearGradient(0, yy - fs / 2, 0, yy + fs / 2);
    gr.addColorStop(0, '#fff7c2'); gr.addColorStop(0.5, CFG.accent || '#ffd400'); gr.addColorStop(1, '#ff9d00');
    g.fillStyle = i === 0 ? gr : '#fff'; g.fillText(ln, 0, yy);
  });
  g.restore();
}

function drawOutro(g, p) {
  const k = easeOut(clamp(p * 2.5));
  g.save(); g.globalAlpha = k;
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 0, W, H);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 120px DejaVu Sans'; g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round';
  g.translate(W / 2, 760); g.scale(lerp(1.4, 1, k), lerp(1.4, 1, k));
  g.strokeText('SÍGUENOS', 0, 0); g.fillStyle = CFG.accent || '#ffd400'; g.fillText('SÍGUENOS', 0, 0);
  g.font = 'bold 52px DejaVu Sans'; g.lineWidth = 12; g.strokeText('+ PARTIDOS LEGENDARIOS', 0, 110); g.fillStyle = '#fff'; g.fillText('+ PARTIDOS LEGENDARIOS', 0, 110);
  // follow button
  const bw = 420, bh = 110, by = 230;
  rr(g, -bw / 2, by, bw, bh, 55); g.fillStyle = '#ff2d55'; g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 54px DejaVu Sans'; g.fillText('SEGUIR  +', 0, by + bh / 2 + 2);
  g.restore();
}

let lastSegFlash = -1;
window.renderAt = function (t) {
  // determine shot
  const shots = CFG.shots; let si = 0;
  for (let k = 0; k < shots.length; k++) if (t >= shots[k]._t0) si = k;
  const sh = shots[si]; const D = sh._t1 - sh._t0; const lt = t - sh._t0; let p = clamp(lt / D);
  if (sh.speed) p = clamp(p * sh.speed);
  if (sh.pr) p = lerp(sh.pr[0], sh.pr[1], p);
  // reset
  for (const tm of players) for (const P of tm) { P.g.visible = false; resetPose(P); }
  hideBall(); confetti.visible = false; trophy.visible = false; trophy.scale.setScalar(1);
  trophy.userData.ribbons.forEach(r => r.visible = false); if (trophy.userData.ped) trophy.userData.ped.visible = false;
  if (scarfMesh) scarfMesh.visible = false; netRipple(1, 0);
  if (sport === 'tennis') { const sf = valAt(sh.surface, p) || CFG.surface || 'grass'; if (CFG._surf !== sf) { setSurface(sf); CFG._surf = sf; } }
  CFG._labels = []; if (!sh.type.startsWith('vs') && sh.type !== 'versus') vsHide();
  SH[sh.type](sh, p, lt, D);
  // shake
  if (sh.shake) { const amp = sh.shake * Math.max(0, 1 - Math.abs(p - (sh.shakeAt ?? 0.6)) * 6); camera.position.x += Math.sin(t * 61) * amp * 0.15; camera.position.y += Math.sin(t * 47) * amp * 0.12; }
  // crowd flashes
  const col = flashes.geometry.attributes.color; const intensity = sh.flashes ?? 0.4;
  for (let i = 0; i < col.count; i++) { const on = hash(i * 13.1 + Math.floor(t * 12) * 7.3) < 0.03 * intensity ? 1 : 0; col.setXYZ(i, on, on, on * 0.95); }
  col.needsUpdate = true;
  crowdTex.offset.y = Math.sin(t * 9) * 0.002 * (sh.crowdJump ?? 1);
  renderer.render(scene, camera);
  // composite
  const g = octx;
  g.filter = CFG.grade || 'none';
  g.drawImage(glc, 0, 0); g.filter = 'none';
  // vignette
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  if (CFG.grain) { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,240,220,${hash(i + t * 1000) * 0.08})`; g.fillRect(hash(i * 3 + t) * W, hash(i * 7 + t * 2) * H, 2, 2); } }
  // letterbox top gradient for scoreboard legibility
  const tg = g.createLinearGradient(0, 0, 0, 420); tg.addColorStop(0, 'rgba(0,0,0,0.55)'); tg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = tg; g.fillRect(0, 0, W, 420);
  for (const L of CFG._labels || []) { const v = L.w.clone().project(camera); if (v.z > 1) continue; const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H; g.save(); g.font = 'bold 96px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.lineJoin = 'round'; g.lineWidth = 16; g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(L.txt, sx, sy); g.fillStyle = L.col; g.fillText(L.txt, sx, sy); g.restore(); }
  if (sh.type !== 'outro') drawScoreboard(g, sh, p, t);
  if (sh.type === 'outro') drawOutro(g, p);
  drawBig(g, sh, p, t, lt, D * (sh.pr ? 1 / (sh.pr[1] - sh.pr[0]) : 1));
  // caption: active segment by time
  let ci = 0; CFG.segs.forEach((s, k) => { if (t >= s.start - 0.2) ci = k; });
  if (sh.type !== 'outro') drawCaption(g, ci, t);
  // transition flash
  const fl = clamp(1 - lt / 0.18); if (si > 0 && fl > 0) { g.fillStyle = `rgba(255,255,255,${fl * 0.7})`; g.fillRect(0, 0, W, H); }
  if (t < 0.25) { g.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; g.fillRect(0, 0, W, H); }
  // series tag
  g.save(); g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,0.75)'; g.fillText(CFG.series || 'PARTIDOS LEGENDARIOS · 3D', W / 2, 105); g.restore();
  return out.toDataURL('image/jpeg', 0.9);
};
window.initEngine = init;
