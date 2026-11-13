import * as THREE from 'three';
import { RoomEnvironment } from './node_modules/three/examples/jsm/environments/RoomEnvironment.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const seg = (p, a, b) => clamp((p - a) / (b - a));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }

let CFG, renderer, scene, camera, out, octx, glc;
let golfer, ball, trail, trailGeo, condor, flag, confetti, glowSp;
const HOLE_D = 473;
const cx = d => 22 * Math.sin(d / HOLE_D * Math.PI * 1.15) ; // fairway centerline x at distance d (z = -d)
const HOLE = () => V(cx(HOLE_D), 0, -HOLE_D);

function M(color, o = {}) { return new THREE.MeshStandardMaterial({ color, roughness: o.r ?? 0.6, metalness: o.m ?? 0, ...(o.e ? { emissive: o.e, emissiveIntensity: o.ei ?? 1 } : {}), ...(o.flat ? { flatShading: true } : {}) }); }

function buildWorld() {
  const sky = canvasTex(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2f6fc4'); gr.addColorStop(0.55, '#8cc2f0'); gr.addColorStop(1, '#f4e6c8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  scene.background = sky; scene.fog = new THREE.Fog('#c9def0', 500, 2600);
  scene.add(new THREE.HemisphereLight('#dceeff', '#3a5a22', 0.8));
  const sun = new THREE.DirectionalLight('#fff3dc', 2.3); sun.position.set(-200, 300, -400); scene.add(sun);
  // ground (rough)
  const rough = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#4c8a36'; g.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { g.fillStyle = hash(i) > .5 ? '#447f30' : '#57973e'; g.fillRect(hash(i * 3) * w, hash(i * 7) * h, 3, 3); } });
  rough.wrapS = rough.wrapT = THREE.RepeatWrapping; rough.repeat.set(300, 300);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ map: rough, roughness: 1 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  // fairway ribbon with mowing stripes
  const stripes = canvasTex(64, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#6cbf4a' : '#5fb043'; g.fillRect(0, i * h / 8, w, h / 8); } });
  stripes.wrapS = stripes.wrapT = THREE.RepeatWrapping;
  const pos = [], uv = [], idx = []; const N = 300;
  for (let i = 0; i <= N; i++) {
    const d = -20 + i / N * (HOLE_D + 10); const x = cx(Math.max(0, d)); const wdt = d < 30 ? 14 : (d > HOLE_D - 40 ? 16 : 22 + 6 * Math.sin(d / 60));
    pos.push(x - wdt, 0.03, -d, x + wdt, 0.03, -d); uv.push(0, d / 30, 1, d / 30);
  }
  for (let i = 0; i < N; i++) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); fg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); fg.setIndex(idx); fg.computeVertexNormals();
  scene.add(new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.9, side: THREE.DoubleSide })));
  // green
  const h = HOLE(); const gc = h.clone().add(V(-3, 0, -4));
  const greenTex = canvasTex(256, 256, (g, w) => { for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#7fd35c' : '#74c853'; g.fillRect(0, i * w / 10, w, w / 10); } });
  const fringe = new THREE.Mesh(new THREE.CircleGeometry(21, 64), M('#5fae43')); fringe.rotation.x = -Math.PI / 2; fringe.position.copy(gc).setY(0.04); fringe.scale.set(1.15, 1, 1); scene.add(fringe);
  const green = new THREE.Mesh(new THREE.CircleGeometry(18, 64), new THREE.MeshStandardMaterial({ map: greenTex, roughness: 0.7 })); green.rotation.x = -Math.PI / 2; green.position.copy(gc).setY(0.05); green.scale.set(1.15, 1, 1); scene.add(green);
  const cup = new THREE.Mesh(new THREE.CircleGeometry(0.16, 24), new THREE.MeshBasicMaterial({ color: '#0b0b0b' })); cup.rotation.x = -Math.PI / 2; cup.position.copy(h).setY(0.06); scene.add(cup);
  const cupRing = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.19, 24), new THREE.MeshBasicMaterial({ color: '#f2f2f2' })); cupRing.rotation.x = -Math.PI / 2; cupRing.position.copy(h).setY(0.061); scene.add(cupRing);
  // flag
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.4), M('#f4f4f4')); pole.position.copy(h).setY(1.2); scene.add(pole);
  const ftex = canvasTex(256, 160, (g, w, hh) => { g.fillStyle = '#d8322b'; g.fillRect(0, 0, w, hh); g.fillStyle = '#fff'; g.font = 'bold 120px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('9', w / 2, hh / 2 + 6); });
  flag = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6, 16, 4), new THREE.MeshStandardMaterial({ map: ftex, side: THREE.DoubleSide, roughness: 0.8 }));
  flag.geometry.translate(0.45, 0, 0); flag.geometry.userData.base = Float32Array.from(flag.geometry.attributes.position.array); flag.position.copy(h).setY(2.1); scene.add(flag);
  // bunkers
  const sand = M('#efdca6', { r: 1 });
  for (const [d, off, sx, sz, rot] of [[HOLE_D - 8, 24, 7, 4, 0.4], [HOLE_D + 6, -22, 6, 3.5, -0.3], [300, 30, 9, 4, 0.2], [240, -32, 8, 4, -0.5], [420, -28, 6, 3, 0.1]]) {
    const b = new THREE.Mesh(new THREE.CircleGeometry(1, 40), sand); b.rotation.x = -Math.PI / 2; b.rotation.z = rot; b.scale.set(sx, sz, 1); b.position.set(cx(d) + off, 0.045, -d); scene.add(b);
  }
  // tee box
  const tee = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 10), M('#66b84a')); tee.position.set(0, 0.07, 2); scene.add(tee);
  
  // trees (instanced pines + round)
  const pineG = new THREE.ConeGeometry(3, 11, 7); pineG.translate(0, 7.5, 0);
  const trunkG = new THREE.CylinderGeometry(0.4, 0.5, 3); trunkG.translate(0, 1.5, 0);
  const NT = 520; const pines = new THREE.InstancedMesh(pineG, M('#2e5f33', { flat: true }), NT), trunks = new THREE.InstancedMesh(trunkG, M('#5a4030'), NT);
  const m4 = new THREE.Matrix4(); let k = 0;
  for (let i = 0; i < NT; i++) {
    const d = -40 + hash(i) * (HOLE_D + 120); const side = hash(i * 2) > 0.5 ? 1 : -1; const off = 38 + hash(i * 3) * 140; const s = 0.7 + hash(i * 5) * 0.9;
    const x = cx(Math.max(0, Math.min(HOLE_D, d))) + side * off; if (Math.abs(-d + HOLE_D) < 40 && Math.abs(x - HOLE().x) < 34) continue;
    m4.compose(V(x, 0, -d), new THREE.Quaternion(), V(s, s * (0.8 + hash(i * 7) * 0.5), s)); pines.setMatrixAt(k, m4); trunks.setMatrixAt(k, m4); pines.setColorAt(k, new THREE.Color().setHSL(0.32 + hash(i * 9) * 0.05, 0.45, 0.22 + hash(i * 11) * 0.08)); k++;
  }
  pines.count = trunks.count = k; scene.add(pines, trunks);
  // mountains (Rockies) far west (-z) and around
  const mt = new THREE.MeshStandardMaterial({ color: '#6a7d9a', flatShading: true, roughness: 1 }), snow = new THREE.MeshStandardMaterial({ color: '#f4f7fb', flatShading: true, roughness: 0.9 });
  for (let i = 0; i < 60; i++) {
    const a = -Math.PI / 2 + (hash(i) - 0.5) * Math.PI * 1.6; const r = 1500 + hash(i * 3) * 900; const hgt = 260 + hash(i * 5) * 420; const rad = 260 + hash(i * 7) * 260;
    const x = Math.cos(a) * r, z = Math.sin(a) * r - 300;
    const c = new THREE.Mesh(new THREE.ConeGeometry(rad, hgt, 6 + Math.floor(hash(i * 9) * 3)), mt); c.position.set(x, hgt / 2 - 10, z); c.rotation.y = hash(i) * 3; scene.add(c);
    const sc = new THREE.Mesh(new THREE.ConeGeometry(rad * 0.32, hgt * 0.32, c.geometry.parameters.radialSegments), snow); sc.position.set(x, hgt - hgt * 0.16 - 10 + 1, z); sc.rotation.y = c.rotation.y; scene.add(sc);
  }
  // clouds
  const ct = canvasTex(128, 128, (g, w) => { for (let i = 0; i < 12; i++) { const x = 64 + (hash(i) - .5) * 60, y = 64 + (hash(i * 3) - .5) * 30, r = 22 + hash(i * 7) * 22; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); } });
  for (let i = 0; i < 26; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false })); s.position.set((hash(i) - .5) * 2400, 280 + hash(i * 2) * 250, -300 - hash(i * 3) * 1600); s.scale.set(300 + hash(i * 4) * 300, 120 + hash(i * 5) * 80, 1); scene.add(s); }
  const sunTex = canvasTex(128, 128, (g, w) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(0.2, 'rgba(255,240,200,0.8)'); gr.addColorStop(1, 'rgba(255,220,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  glowSp = sunTex;
  const sunS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); sunS.position.set(-500, 700, -1800); sunS.scale.set(600, 600, 1); scene.add(sunS);
}

function buildGolfer() {
  const g = new THREE.Group(); const skin = M('#e2a87c'), shirt = M('#d8322b', { r: 0.7 }), pants = M('#c9b48a'), white = M('#f6f6f6');
  const legs = [-0.14, 0.14].map(z => { const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.75, 4, 8), pants); l.position.set(0, 0.5, z); g.add(l); const sh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.12), white); sh.position.set(0.05, 0.05, z); g.add(sh); return l; });
  const torso = new THREE.Group(); torso.position.y = 0.98; g.add(torso);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.42, 4, 10), shirt); body.position.y = 0.33; body.scale.set(0.85, 1, 1.15); torso.add(body);
  const head = new THREE.Group(); head.position.y = 0.82; torso.add(head);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skin));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white); cap.position.y = 0.02; head.add(cap);
  const brim = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.015, 0.2), white); brim.position.set(0.12, 0.03, 0); head.add(brim);
  const arms = new THREE.Group(); arms.position.y = 0.55; torso.add(arms);
  for (const z of [-0.22, 0.22]) { const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.55, 4, 8), shirt); a.position.set(0.18, -0.3, z * 0.55); a.rotation.z = 0.35; a.rotation.x = -z * 0.9; arms.add(a); }
  const hands = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), white); hands.position.set(0.32, -0.62, 0); arms.add(hands);
  const club = new THREE.Group(); club.position.copy(hands.position); arms.add(club);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.05), M('#bfc5cc', { m: 0.8, r: 0.3 })); shaft.position.set(0.18, -0.48, 0); shaft.rotation.z = 0.36; club.add(shaft);
  const headC = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), M('#222', { m: 0.6, r: 0.3 })); headC.scale.set(1.2, 0.7, 1.6); headC.position.set(0.37, -0.98, 0.05); club.add(headC);
  g.userData = { torso, arms, head };
  scene.add(g); return g;
}
function swing(q) { // 0 address .45 top .62 impact 1 finish
  const k = [[0, 0, 0], [0.45, 2.3, 1.0], [0.62, 0, -0.15], [1, -2.6, -1.3]];
  let a = k[0], b = k[1]; for (let i = 0; i < k.length - 1; i++) if (q >= k[i][0]) { a = k[i]; b = k[i + 1]; }
  const tt = clamp((q - a[0]) / (b[0] - a[0])); const e = b[0] === 0.62 ? tt * tt : ease(tt);
  const { torso, arms, head } = golfer.userData;
  arms.rotation.x = lerp(a[1], b[1], e); torso.rotation.y = lerp(a[2], b[2], e) * 0.6; torso.rotation.z = -0.35; head.rotation.z = 0.25; head.rotation.y = q > 0.75 ? -0.6 * seg(q, 0.75, 0.9) : 0;
}

function buildCondor() {
  const g = new THREE.Group(); const black = M('#121212', { r: 0.5 }), white = M('#f0f0f0'), head = M('#b8746a');
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 14), black); body.scale.set(0.8, 0.7, 1.6); g.add(body);
  const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.09, 10, 20), white); ruff.position.set(0, 0.05, 0.62); g.add(ruff);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.3), head); neck.rotation.x = Math.PI / 2; neck.position.set(0, 0.08, 0.78); g.add(neck);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), head); hd.scale.set(0.9, 0.9, 1.2); hd.position.set(0, 0.1, 0.96); g.add(hd);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 8), M('#e6d8c8')); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.07, 1.12); g.add(beak);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.5), black); tail.position.set(0, 0, -0.75); g.add(tail);
  const wings = [];
  for (const s of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(s * 0.25, 0.1, 0.1); g.add(piv);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.75), black); inner.position.set(s * 0.65, 0, 0); piv.add(inner);
    const patch = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.055, 0.28), white); patch.position.set(s * 0.65, 0.005, -0.18); piv.add(patch);
    const outerP = new THREE.Group(); outerP.position.set(s * 1.3, 0, 0); piv.add(outerP);
    const outer = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.6), black); outer.position.set(s * 0.45, 0, 0.02); outerP.add(outer);
    for (let f = 0; f < 6; f++) { const fe = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.025, 0.08), black); fe.position.set(s * (1.1), 0, 0.26 - f * 0.1); fe.rotation.y = s * (f - 2.5) * 0.12; outerP.add(fe); }
    wings.push({ piv, outerP, s });
  }
  g.userData.wings = wings; g.scale.setScalar(1.6); g.visible = false; scene.add(g); return g;
}
function flapCondor(t, amt = 0.25) { condor.userData.wings.forEach(({ piv, outerP, s }) => { const a = Math.sin(t * 2.2) * amt; piv.rotation.z = s * (a + 0.08); outerP.rotation.z = s * (a * 0.8 + 0.12); }); }

// ball physics (scripted)
function ballAt(T) { // T seconds since impact
  const start = V(0.6, 0.1, -0.2); let d, h;
  if (T <= 0) return start;
  if (T < 6) { const u = T / 6; d = 455 * (1 - Math.pow(1 - u, 1.35)); h = 42 * Math.sin(Math.PI * Math.pow(u, 0.82)); }
  else if (T < 7.3) { const u = (T - 6) / 1.3; d = lerp(455, 466, u); const bounces = [[0, 0.55, 1.6], [0.55, 0.85, 0.5], [0.85, 1, 0.15]]; h = 0; for (const [a, b, hh] of bounces) if (u >= a && u < b) h = hh * Math.sin(Math.PI * (u - a) / (b - a)); }
  else if (T < 9.2) { const u = (T - 7.3) / 1.9; d = lerp(466, HOLE_D, 1 - Math.pow(1 - u, 2.2)); h = 0; }
  else { d = HOLE_D; h = -Math.min(0.35, (T - 9.2) * 2); }
  const x = cx(d) - 0.0 + (d < HOLE_D ? 0 : 0); return V(x, 0.1 + Math.max(h, -0.35), -d);
}
function buildBall() {
  ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.35, roughness: 0.3 })); scene.add(ball);
  trailGeo = new THREE.BufferGeometry(); trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(600 * 3), 3));
  trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85 })); trail.frustumCulled = false; scene.add(trail);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowSp, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: '#fff2c0' })); halo.scale.set(0.55, 0.55, 1); halo.material.opacity = 0.55; ball.add(halo); ball.userData.halo = halo;
}
function setBall(T, showTrail = true) {
  const p = ballAt(T); ball.position.copy(p); ball.visible = true;
  const a = trailGeo.attributes.position; let n = 0;
  if (showTrail && T > 0) { const T0 = Math.max(0, T - 6.5); for (let i = 0; i < 600; i++) { const tt = lerp(T0, T, i / 599); if (tt > 6.2) break; const q = ballAt(tt); a.setXYZ(n++, q.x, q.y, q.z); } }
  trailGeo.setDrawRange(0, n); a.needsUpdate = true; trail.visible = n > 1;
  return p;
}
function buildConfetti() {
  const N = 500; confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.12, 0.18), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), N);
  const cols = ['#d8322b', '#ffd400', '#ffffff', '#2a5bd7']; for (let i = 0; i < N; i++) confetti.setColorAt(i, new THREE.Color(cols[i % 4])); confetti.visible = false; scene.add(confetti);
}
function showConfetti(c, t) { confetti.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(); for (let i = 0; i < confetti.count; i++) { const y = ((10 + hash(i) * 10 - t * (1.5 + hash(i * 2))) % 14 + 14) % 14; e.set(t * 3 + i, t * 2 + i, 0); q.setFromEuler(e); m.compose(V(c.x + (hash(i * 3) - .5) * 14, y, c.z + (hash(i * 5) - .5) * 14), q, V(1, 1, 1)); confetti.setMatrixAt(i, m); } confetti.instanceMatrix.needsUpdate = true; }

function setCam(pos, look, fov = 50) { camera.position.copy(pos); camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(look); }
const SH = {};
SH.condorFly = (o, p, lt) => {
  condor.visible = true; const c = V(lerp(-60, 60, p), 120 + Math.sin(lt * 0.8) * 3, -900); condor.position.copy(c); condor.rotation.set(0, Math.PI / 2, -0.15 + Math.sin(lt) * 0.05); flapCondor(lt, 0.18);
  const a = lerp(-0.5, 0.6, ease(p)); setCam(c.clone().add(V(-6 + Math.sin(a) * 3, 1.2, 7 * Math.cos(a))), c.clone().add(V(0.5, 0.2, 0)), 42);
  setBall(-1, false); ball.visible = false;
};
SH.aerial = (o, p, lt) => {
  const z = lerp(30, -HOLE_D * 0.75, ease(p)); setCam(V(cx(-z) + 40, lerp(160, 110, p), z + 60), V(cx(HOLE_D), 0, -HOLE_D), 52);
  setBall(-1, false); ball.visible = false;
};
SH.flyover = (o, p, lt) => {
  const d = lerp(0, HOLE_D - 25, ease(p)); setCam(V(cx(d) + 6, 6 + Math.sin(p * Math.PI) * 6, -d + 10), V(cx(d + 60), 2, -d - 60), 60);
  CFG._m = Math.round(lerp(0, HOLE_D, ease(p))); setBall(-1, false); ball.visible = false;
};
SH.bunker = (o, p, lt) => { const d = HOLE_D - 8; const bp = V(cx(d) + 24, 0.08, -d); ball.visible = true; ball.position.copy(bp); ball.userData.halo.visible = false; trail.visible = false; const a = lerp(0.3, 0.9, p); setCam(bp.clone().add(V(Math.cos(a) * 4, 1.0, Math.sin(a) * 4)), bp.clone().add(V(-6, 0.3, -2)), 46); };
SH.greenOrbit = (o, p, lt) => { const h = HOLE(); const a = lerp(0.4, 1.6, p); setCam(h.clone().add(V(Math.cos(a) * 9, lerp(1.2, 2.5, p), Math.sin(a) * 9)), h.clone().setY(1.2), 44); setBall(-1, false); ball.visible = false; };
SH.swing = (o, p, lt, D) => {
  const tImp = 0.62, sw = seg(p, 0.15, 0.95); swing(sw);
  const impT = 0.15 + 0.8 * tImp; const T = (p - impT) * D * 1.4;
  setBall(T, true);
  if (p < impT + 0.05) setCam(V(5.2, 1.3, -1.2), V(0.2, 0.95, -0.2), 40);
  else { const b = ball.position; const T2 = Math.max(T, 0.05); const dir = ballAt(T2 + 0.15).sub(ballAt(T2)).normalize(); setCam(b.clone().sub(dir.multiplyScalar(lerp(4, 9, seg(p, impT, 1)))).add(V(2, 1.2, 0)), b.clone(), 50); }
  CFG._flash = Math.max(0, 1 - Math.abs(p - impT) * 30);
};
SH.flight = (o, p, lt, D) => {
  ball.userData.halo.visible = true; const T = lerp(o.T[0], o.T[1], p); const b = setBall(T); const next = ballAt(T + 0.15); const dir = next.clone().sub(b).normalize();
  condor.visible = true; flapCondor(lt, 0.3); const cp = b.clone().add(V(-4.5, 1.0 + Math.sin(lt * 2) * 0.3, -4)); condor.position.copy(cp); condor.lookAt(cp.clone().add(dir)); condor.rotateZ(0.25);
  setCam(b.clone().sub(dir.clone().multiplyScalar(9)).add(V(3.5, 2.2, 0)), b.clone().add(V(-1.2, 0.5, 0)), 50);
  CFG._yd = Math.round(-b.z / 0.9144);
};
SH.landing = (o, p, lt, D) => {
  const T = lerp(o.T[0], o.T[1], p); const b = setBall(T, T < 6.3); const h = HOLE();
  ball.userData.halo.visible = false;
  if (o.cam === 'cup') setCam(h.clone().add(V(-1.6, 0.35, -2.8)), vl2(b, h, 0.5).setY(0.15), 45);
  else setCam(h.clone().add(V(-3, 1.2, -14)), b.clone().setY(Math.max(0.3, b.y * 0.6)), 46);
  if (T > 9.2) { ball.visible = T < 9.5; }
  CFG._in = T > 9.2;
};
function vl2(a, b, t) { return a.clone().lerp(b, t); }
SH.celebrate = (o, p, lt) => { const h = HOLE(); showConfetti(h, lt); setBall(10, false); ball.visible = false; const a = lerp(2.0, 2.9, p); setCam(h.clone().add(V(Math.cos(a) * 7, lerp(1.0, 2.0, p), Math.sin(a) * 7)), h.clone().setY(1.4), 44); };
SH.condorGreen = (o, p, lt) => {
  const h = HOLE(); condor.visible = true; const a = lt * 0.5; const c = h.clone().add(V(Math.cos(a) * 10, 9 + Math.sin(lt) * 0.5, Math.sin(a) * 10)); condor.position.copy(c);
  condor.lookAt(h.clone().add(V(Math.cos(a + 0.3) * 10, 9, Math.sin(a + 0.3) * 10))); condor.rotateZ(-0.35); flapCondor(lt, 0.12);
  setCam(h.clone().add(V(-16, 1.6, 18)), c.clone().lerp(h.clone().setY(5), 0.12), 50); setBall(10, false); ball.visible = false;
};
SH.outro = (o, p, lt) => { const h = HOLE(); const a = lerp(1.2, 2.2, p); setCam(h.clone().add(V(Math.cos(a) * 40, lerp(12, 30, p), Math.sin(a) * 40)), h.clone(), 50); condor.visible = true; condor.position.copy(h.clone().add(V(Math.cos(lt * 0.6) * 18, 16, Math.sin(lt * 0.6) * 18))); condor.lookAt(h.clone().add(V(Math.cos(lt * 0.6 + 0.3) * 18, 16, Math.sin(lt * 0.6 + 0.3) * 18))); flapCondor(lt, 0.12); setBall(10, false); ball.visible = false; };

// overlay
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function fitFont(g, txt, max, size) { let s = size; g.font = `bold ${s}px DejaVu Sans`; while (g.measureText(txt).width > max && s > 20) { s -= 4; g.font = `bold ${s}px DejaVu Sans`; } return s; }
function isSeq(v) { return Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && v[0].length === 2 && typeof v[0][1] !== 'number'; }
function startOf(v, p) { if (!isSeq(v)) return 0; let r = 0; for (const [pp] of v) if (p >= pp) r = pp; return r; }
function valAt(v, p) { if (v == null) return null; if (isSeq(v)) { let r = v[0][1]; for (const [pp, val] of v) if (p >= pp) r = val; return r; } return v; }
function drawTop(g, sh, p) {
  const info = valAt(sh.info, p) || CFG.info || 'HOYO 9 · PAR 5 · 517 YD'; const x = 90, y = 190, w = 900, h = 86;
  g.save(); g.shadowColor = 'rgba(0,0,0,0.4)'; g.shadowBlur = 18; rr(g, x, y, w, h, 16); g.fillStyle = 'rgba(14,30,18,0.88)'; g.fill(); g.shadowBlur = 0;
  rr(g, x, y, 16, h, 8); g.fillStyle = '#f2b632'; g.fill(); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.textAlign = 'center'; fitFont(g, info, 820, 40); g.fillText(info, W / 2 + 8, y + h / 2 + 2);
  g.font = 'bold 28px DejaVu Sans'; g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillText(CFG.label || 'EL GOLPE MÁS RARO DEL GOLF', W / 2, y - 26); g.restore();
}
function drawCaption(g, t) {
  let si = 0; CFG.segs.forEach((s, k) => { if (t >= s.start - 0.2) si = k; }); const S = CFG.segs[si];
  const words = S.text.split(/\s+/).filter(Boolean); const span = Math.max(0.5, S.end - S.start); const lens = words.map(w => w.length + 1.5), tot = lens.reduce((a, b) => a + b, 0); let acc = 0; const wt = lens.map(l => { const s = S.start + acc / tot * span; acc += l; return s; });
  const chunks = []; let cur = []; words.forEach((w, i) => { const len = cur.reduce((a, k) => a + words[k].length + 1, 0) + w.length; if (cur.length && (len > 17 || /[.,:!?…]$/.test(words[cur[cur.length - 1]]))) { chunks.push(cur); cur = []; } cur.push(i); }); if (cur.length) chunks.push(cur);
  let ci = 0; for (let k = 0; k < chunks.length; k++) if (t >= wt[chunks[k][0]] - 0.05) ci = k; const ch = chunks[ci]; const st = wt[ch[0]]; const pop = clamp((t - st + 0.05) / 0.12); const sc = 0.85 + 0.15 * easeOut(pop);
  g.save(); g.translate(W / 2, 1240); g.scale(sc, sc); const txts = ch.map(i => words[i].toUpperCase()); let fs = 92; g.font = `bold ${fs}px DejaVu Sans`; const sp = 24; let tw = txts.reduce((a, s) => a + g.measureText(s).width, 0) + sp * (txts.length - 1);
  while (tw > 960 && fs > 50) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; tw = txts.reduce((a, s) => a + g.measureText(s).width, 0) + sp * (txts.length - 1); }
  let x = -tw / 2; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineJoin = 'round';
  txts.forEach((s, k) => { const i = ch[k]; const active = t >= wt[i] && (i === words.length - 1 || t < wt[i + 1]); const w = g.measureText(s).width; g.lineWidth = 16; g.strokeStyle = 'rgba(0,0,0,0.9)'; g.strokeText(s, x, 0); g.fillStyle = active ? '#f2b632' : '#fff'; g.fillText(s, x, 0); x += w + sp; }); g.restore();
}
function drawBig(g, sh, p, D) {
  let big = valAt(sh.big, p); if (!big) return; big = big.replace('{m}', CFG._m ?? 0).replace('{yd}', CFG._yd ?? 0);
  const a = clamp((p - startOf(sh.big, p)) * D / 0.25); const k = easeOut(a); const s = lerp(1.8, 1, k);
  g.save(); g.globalAlpha = k; g.translate(W / 2, sh.bigY ?? 760); g.scale(s, s); g.rotate(-0.04);
  big.split('\n').forEach((ln, i) => { const fs = fitFont(g, ln, 980, i === 0 ? (sh.bigSize ?? 160) : 76); const yy = i === 0 ? 0 : 130 + (i - 1) * 90; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(ln, 0, yy); const gr = g.createLinearGradient(0, yy - fs / 2, 0, yy + fs / 2); gr.addColorStop(0, '#fff7c2'); gr.addColorStop(0.5, '#f2b632'); gr.addColorStop(1, '#ff8a00'); g.fillStyle = i === 0 ? gr : '#fff'; g.fillText(ln, 0, yy); });
  g.restore();
}
function drawCard(g, p) {
  const k = easeOut(clamp(p * 3)); g.save(); g.translate(W / 2, 1520); g.scale(k, k); rr(g, -400, -110, 800, 220, 26); g.fillStyle = 'rgba(250,246,232,0.97)'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#1d3a22'; g.stroke();
  const cols = [['HOYO', '9'], ['PAR', '5'], ['GOLPES', '1'], ['', '−4']]; g.textAlign = 'center'; g.textBaseline = 'middle';
  cols.forEach(([h, v], i) => { const x = -300 + i * 200; g.fillStyle = '#1d3a22'; g.font = 'bold 34px DejaVu Sans'; g.fillText(h, x, -60); g.font = 'bold 90px DejaVu Sans'; g.fillStyle = i === 3 ? '#d8322b' : '#1d3a22'; g.fillText(v, x, 25); if (i === 2) { g.lineWidth = 8; g.strokeStyle = '#d8322b'; g.beginPath(); g.arc(x, 25, 62 * clamp(p * 4 - 0.6), 0, Math.PI * 2 * clamp(p * 4 - 0.6)); g.stroke(); } });
  g.restore();
}
const ROWS = [['6', 'BOGEY', '+1', '#c94f4f'], ['5', 'PAR', 'E', '#7a8a96'], ['4', 'BIRDIE', '−1', '#3c8fc4'], ['3', 'ÁGUILA', '−2', '#8a5a2e'], ['2', 'ALBATROS', '−3', '#2f6f8f'], ['1', 'CÓNDOR', '−4', '#c08a1e']];
function drawRow(g, row, p) {
  const [n, l, d, col] = ROWS[row]; const k = easeOut(clamp(p * 4)); const bounce = 1 + 0.12 * Math.sin(clamp(p * 4) * Math.PI);
  g.save(); g.translate(330, 1520); g.scale(k * bounce, k * bounce);
  g.beginPath(); g.arc(0, 0, 150, 0, Math.PI * 2); g.fillStyle = col; g.fill(); g.lineWidth = 10; g.strokeStyle = '#fff'; g.stroke();
  g.fillStyle = '#fff'; g.font = 'bold 170px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 12; g.strokeStyle = 'rgba(0,0,0,0.6)'; g.strokeText(n, 0, 8); g.fillText(n, 0, 8);
  rr(g, -170, 140, 340, 86, 22); g.fillStyle = '#fff'; g.fill(); g.fillStyle = '#152018'; g.font = 'bold 52px DejaVu Sans'; g.fillText(l, 0, 185);
  g.restore();
  // ladder right
  g.save(); g.translate(600, 1330); rr(g, 0, 0, 420, 70 + 6 * 64, 22); g.fillStyle = 'rgba(14,30,18,0.85)'; g.fill();
  g.fillStyle = '#f2b632'; g.font = 'bold 38px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PAR 5', 210, 36);
  for (let i = 0; i <= row; i++) { const [nn, ll, dd, cc] = ROWS[i]; const y = 70 + i * 64; const a = i === row ? easeOut(clamp(p * 4)) : 1; g.globalAlpha = a; rr(g, 14, y, 392, 54, 12); g.fillStyle = i === row ? cc : 'rgba(255,255,255,0.12)'; g.fill(); g.fillStyle = '#fff'; g.font = 'bold 34px DejaVu Sans'; g.textAlign = 'left'; g.fillText(nn + '  ' + ll, 34, y + 29); g.textAlign = 'right'; g.fillText(dd, 390, y + 29); g.globalAlpha = 1; }
  g.restore();
}
function drawOutro(g, p, q) {
  const k = easeOut(clamp(p * 2.5)); g.save(); g.globalAlpha = k; g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, 0, W, H); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.translate(W / 2, 640);
  fitFont(g, q, 960, 84); g.lineWidth = 18; g.strokeStyle = '#000'; g.strokeText(q, 0, 0); g.fillStyle = '#fff'; g.fillText(q, 0, 0);
  g.font = 'bold 60px DejaVu Sans'; g.lineWidth = 12; g.strokeText('COMENTA ↓', 0, 110); g.fillStyle = '#f2b632'; g.fillText('COMENTA ↓', 0, 110);
  const s2 = lerp(1.4, 1, k); g.translate(0, 330); g.scale(s2, s2); g.font = 'bold 110px DejaVu Sans'; g.lineWidth = 18; g.strokeText('SÍGUEME', 0, 0); g.fillStyle = '#f2b632'; g.fillText('SÍGUEME', 0, 0);
  g.font = 'bold 48px DejaVu Sans'; g.lineWidth = 12; g.strokeText('+ TIPS Y CURIOSIDADES DE GOLF', 0, 100); g.fillStyle = '#fff'; g.fillText('+ TIPS Y CURIOSIDADES DE GOLF', 0, 100);
  rr(g, -210, 170, 420, 110, 55); g.fillStyle = '#ff2d55'; g.fill(); g.fillStyle = '#fff'; g.font = 'bold 54px DejaVu Sans'; g.fillText('SEGUIR  +', 0, 227); g.restore();
}

window.renderAt = function (t) {
  const shots = CFG.shots; let si = 0; for (let k = 0; k < shots.length; k++) if (t >= shots[k]._t0) si = k;
  const sh = shots[si]; const D = sh._t1 - sh._t0, lt = t - sh._t0, p = clamp(lt / D);
  condor.visible = false; confetti.visible = false; CFG._flash = 0; swing(0);
  SH[sh.type](sh, p, lt, D);
  const a = flag.geometry.attributes.position, b = flag.geometry.userData.base; for (let i = 0; i < a.count; i++) { const x = b[i * 3]; a.setZ(i, Math.sin(x * 5 - t * 7) * 0.08 * x); } a.needsUpdate = true;
  if (sh.shake) { const amp = sh.shake * Math.max(0, 1 - Math.abs(p - (sh.shakeAt ?? 0.5)) * 6); camera.position.x += Math.sin(t * 61) * amp * 0.08; camera.position.y += Math.sin(t * 47) * amp * 0.06; }
  renderer.render(scene, camera);
  const g = octx; g.drawImage(glc, 0, 0);
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.45)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const tg = g.createLinearGradient(0, 0, 0, 420); tg.addColorStop(0, 'rgba(0,0,0,0.5)'); tg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = tg; g.fillRect(0, 0, W, 420);
  if (sh.type !== 'outro') drawTop(g, sh, p); else drawOutro(g, p, sh.cta);
  if (sh.card) drawCard(g, p);
  if (sh.row != null) drawRow(g, sh.row, p);
  drawBig(g, sh, p, D);
  if (sh.type !== 'outro') drawCaption(g, t);
  if (CFG._flash > 0) { g.fillStyle = `rgba(255,255,255,${CFG._flash * 0.8})`; g.fillRect(0, 0, W, H); }
  const fl = clamp(1 - lt / 0.18); if (si > 0 && fl > 0) { g.fillStyle = `rgba(255,255,255,${fl * 0.7})`; g.fillRect(0, 0, W, H); }
  if (t < 0.25) { g.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; g.fillRect(0, 0, W, H); }
  g.save(); g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText('GOLF EXPLICADO · 3D', W / 2, 105); g.restore();
  return out.toDataURL('image/jpeg', 0.9);
};
window.initEngine = async function (cfg) {
  CFG = cfg; glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true }); renderer.setSize(W, H, false); renderer.setPixelRatio(1); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.82;
  scene = new THREE.Scene(); const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.4;
  camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 6000);
  buildWorld(); golfer = buildGolfer(); condor = buildCondor(); buildBall(); buildConfetti();
  out = document.createElement('canvas'); out.width = W; out.height = H; octx = out.getContext('2d'); document.body.appendChild(out);
  CFG.shots.forEach((s, k) => { s._t0 = k === 0 ? 0 : CFG.segs[k].start - 0.15; }); CFG.shots.forEach((s, k) => { s._t1 = k < CFG.shots.length - 1 ? CFG.shots[k + 1]._t0 : CFG.total; });
  await document.fonts.ready; return true;
};
window.CONFIGS = {
  g3x: { label: 'BIRDIE, ÁGUILA, ALBATROS Y CÓNDOR', info: 'HOYO PAR 5 · ¿QUÉ SIGNIFICA?', shots: [
    { type: 'condorFly', big: [[0, null], [0.6, '¿CÓNDOR?']] },
    { type: 'greenOrbit', big: [[0, null], [0.1, 'PAR\n= GOLPES ESPERADOS']], bigSize: 200 },
    { type: 'aerial', big: [[0, null], [0.1, 'PAR 5']], bigSize: 200 },
    { type: 'bunker', row: 0 },
    { type: 'greenOrbit', row: 1 },
    { type: 'flyover', row: 2 },
    { type: 'aerial', row: 3 },
    { type: 'flight', T: [0.5, 5.95], row: 4 },
    { type: 'landing', T: [5.6, 9.7], cam: 'cup', row: 5, big: [[0, null], [0.85, '¡CÓNDOR!']], shake: 0.6, shakeAt: 0.88 },
    { type: 'condorGreen', big: [[0, null], [0.1, '≈5\nEN LA HISTORIA']], bigSize: 220 },
    { type: 'outro', cta: '¿CUÁL ES TU MEJOR?' },
  ] },
  g3d: { shots: [
    { type: 'condorFly', big: [[0, null], [0.55, 'EL CÓNDOR']], info: 'GOLF · −4 EN UN HOYO' },
    { type: 'aerial', big: [[0, null], [0.15, '1 GOLPE\nEN UN PAR 5']], bigSize: 130 },
    { type: 'flyover', big: '{m} M', bigSize: 170 },
    { type: 'greenOrbit', big: [[0, null], [0.2, '0\nEN TORNEOS PRO']], bigSize: 200 },
    { type: 'swing', big: [[0, '2002'], [0.5, null]], info: 'DENVER · HOYO 9 · PAR 5 · 517 YD', shake: 0.6, shakeAt: 0.65 },
    { type: 'flight', T: [0.5, 5.95], big: '{yd} YD', bigSize: 170 },
    { type: 'landing', T: [5.6, 9.7], cam: 'cup', big: [[0, null], [0.85, '¡ENTRA!']], shake: 0.6, shakeAt: 0.88 },
    { type: 'celebrate', card: true },
    { type: 'condorGreen', big: [[0, null], [0.1, 'CÓNDOR\n4 BAJO PAR']], bigSize: 150 },
    { type: 'outro', cta: '¿ALGÚN PRO LO LOGRARÁ?' },
  ] },
};
window.ready = true;
