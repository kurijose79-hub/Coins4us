// Flat 2D illustrated golf explainer
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const back = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const seg = (p, a, b) => clamp((p - a) / (b - a));
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
const INK = '#22301f', CREAM = '#f7efd8', GOLD = '#f2b632', RED = '#d8322b';
const C = { sky0: '#f7efd8', sky1: '#f6dcae', sun: '#f6c76b', hill1: '#a9cf92', hill2: '#86b874', hill3: '#6aa25e', tree: '#3f7a45', tree2: '#356b3b', grass: '#7fb36a', grass2: '#74a95f' };
let CFG, cv, g;

function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function inked(fill, lw = 7) { g.fillStyle = fill; g.fill(); g.lineWidth = lw; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke(); }
function circle(x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); }

// ---------- background ----------
function background(t, o = {}) {
  const gr = g.createLinearGradient(0, 0, 0, 1100); gr.addColorStop(0, '#f3ead2'); gr.addColorStop(1, '#f6d7a2');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // sun
  g.fillStyle = 'rgba(246,199,107,0.35)'; circle(330, 980, 190); g.fill();
  g.fillStyle = C.sun; circle(330, 980, 130); g.fill();
  // clouds
  for (let i = 0; i < 4; i++) { const x = ((i * 330 + t * 18) % 1400) - 160, y = 520 + i * 70; g.fillStyle = 'rgba(255,255,255,0.75)'; for (const [dx, dy, r] of [[0, 0, 40], [45, -18, 50], [95, 0, 38]]) { circle(x + dx, y + dy, r); g.fill(); } }
  // hills
  const hill = (y0, amp, col, ph) => { g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, y0 + Math.sin(x / 260 + ph) * amp + Math.sin(x / 120 + ph * 2) * amp * 0.25); g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill(); };
  hill(1020, 40, C.hill1, 0.4); hill(1080, 30, C.hill2, 2.1);
  // trees
  for (const [x, y, s] of [[90, 1060, 1.1], [250, 1085, 0.7], [820, 1050, 1.0], [980, 1080, 0.75], [600, 1075, 0.6]]) tree(x, y, s);
  // fairway
  g.fillStyle = C.grass; g.fillRect(0, 1110, W, H - 1110);
  for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.035)'; g.beginPath(); g.moveTo(W / 2 + (i - 4.5) * 40, 1110); g.lineTo(W / 2 + (i - 4) * 40, 1110); g.lineTo(W / 2 + (i - 4) * 420, H); g.lineTo(W / 2 + (i - 4.5) * 420, H); g.fill(); }
  // flag in distance
  if (!o.noFlag) { g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(870, 1120); g.lineTo(870, 1010); g.stroke(); g.beginPath(); g.moveTo(870, 1010); g.lineTo(935, 1028 + Math.sin(t * 5) * 4); g.lineTo(870, 1048); g.closePath(); inked(RED, 4); g.fillStyle = '#fff'; g.font = 'bold 22px DejaVu Sans'; g.textAlign = 'center'; g.fillText(o.flagNum || '5', 897, 1036); }
}
function tree(x, y, s) {
  g.fillStyle = '#5b4632'; g.fillRect(x - 6 * s, y - 20 * s, 12 * s, 40 * s);
  g.fillStyle = C.tree; circle(x, y - 60 * s, 55 * s); g.fill(); g.fillStyle = C.tree2; circle(x + 18 * s, y - 50 * s, 34 * s); g.fill();
}

// ---------- golfer ----------
// pose: angles in radians. shoulders at body top. arms: [upper, lower] angle from straight down (positive = toward screen right)
function golfer(x, y, s, pose, t) {
  g.save(); g.translate(x, y + (pose.jump || 0)); g.scale(s, s);
  const legL = pose.legL ?? 0.12, legR = pose.legR ?? -0.12;
  // shadow
  g.fillStyle = 'rgba(0,0,0,0.15)'; g.beginPath(); g.ellipse(0, 0, 150, 22, 0, 0, Math.PI * 2); g.fill();
  const limb = (x0, y0, a1, l1, a2, l2, w, col, end) => {
    const x1 = x0 + Math.sin(a1) * l1, y1 = y0 + Math.cos(a1) * l1, x2 = x1 + Math.sin(a1 + a2) * l2, y2 = y1 + Math.cos(a1 + a2) * l2;
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = INK; g.lineWidth = w + 14; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    if (end) end(x2, y2, a1 + a2); return [x2, y2];
  };
  // legs
  const shoe = (x2, y2) => { rr(x2 - 34, y2 - 10, 78, 34, 14); inked('#f2f2f2', 6); };
  const PANTS = pose.pants || '#c9b48a', SHIRT = pose.shirt || RED;
  limb(-38, -330, legL, 170, 0, 170, 62, PANTS, shoe); limb(38, -330, legR, 170, 0, 170, 62, PANTS, shoe);
  // belt / hips
  rr(-80, -360, 160, 50, 18); inked(PANTS, 7); if (!pose.racket && pose.racket !== 0) { g.fillStyle = '#3b2f25'; g.fillRect(-78, -352, 156, 14); }
  // torso
  g.save(); g.rotate(pose.lean || 0);
  g.beginPath(); g.moveTo(-95, -560); g.quadraticCurveTo(-110, -450, -88, -350); g.lineTo(88, -350); g.quadraticCurveTo(110, -450, 95, -560); g.quadraticCurveTo(0, -585, -95, -560); g.closePath(); inked(SHIRT, 8);
  g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(30, -555, 55, 200);
  // collar
  g.beginPath(); g.moveTo(-42, -572); g.lineTo(0, -540); g.lineTo(42, -572); g.lineTo(20, -585); g.lineTo(-20, -585); g.closePath(); inked('#fff', 6);
  g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -540); g.lineTo(0, -505); g.stroke();
  // arms
  const sk = pose.skin || '#e2a87c';
  const hand = glove => (x2, y2) => { circle(x2, y2, 24); inked(glove ? '#fff' : sk, 6); };
  const club = pose.club;
  let gripPt = null;
  const rArm = limb(-92, -540, -(pose.rA1 ?? 0.35), 120, -(pose.rA2 ?? 0.1), 115, 46, sk, hand(false));
  const lArm = limb(92, -540, -(pose.lA1 ?? -0.35), 120, -(pose.lA2 ?? -0.1), 115, 46, sk, hand(true));
  // sleeves
  for (const [sx, a] of [[-92, -(pose.rA1 ?? 0.35)], [92, -(pose.lA1 ?? -0.35)]]) { g.save(); g.translate(sx, -540); g.rotate(-a); rr(-34, -10, 68, 78, 22); inked(SHIRT, 7); g.restore(); }
  if (pose.racket != null) { const [hx, hy] = rArm; const a = pose.racket; const ex = hx + Math.sin(a) * 120, ey = hy - Math.cos(a) * 120;
    g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 22; g.beginPath(); g.moveTo(hx, hy); g.lineTo(ex, ey); g.stroke(); g.strokeStyle = '#3b3b3b'; g.lineWidth = 10; g.beginPath(); g.moveTo(hx, hy); g.lineTo(ex, ey); g.stroke();
    g.save(); g.translate(ex + Math.sin(a) * 80, ey - Math.cos(a) * 80); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 62, 82, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fill(); g.lineWidth = 14; g.strokeStyle = INK; g.stroke(); g.lineWidth = 8; g.strokeStyle = pose.rcol || '#d8322b'; g.stroke();
    g.strokeStyle = 'rgba(40,40,40,0.5)'; g.lineWidth = 2; for (let i = -50; i <= 50; i += 16) { g.beginPath(); g.moveTo(i, -Math.sqrt(Math.max(0, 1 - (i / 62) ** 2)) * 80); g.lineTo(i, Math.sqrt(Math.max(0, 1 - (i / 62) ** 2)) * 80); g.stroke(); g.beginPath(); g.moveTo(-Math.sqrt(Math.max(0, 1 - (i / 82) ** 2)) * 60, i); g.lineTo(Math.sqrt(Math.max(0, 1 - (i / 82) ** 2)) * 60, i); g.stroke(); } g.restore(); }
  if (club != null) { // club from midpoint of hands
    const hx = (rArm[0] + lArm[0]) / 2, hy = (rArm[1] + lArm[1]) / 2;
    const cx = hx + Math.sin(club) * 300, cy = hy + Math.cos(club) * 300;
    if (pose.bat) { g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 40; g.beginPath(); g.moveTo(hx, hy); g.lineTo(cx, cy); g.stroke(); g.strokeStyle = '#c8945a'; g.lineWidth = 26; g.beginPath(); g.moveTo(hx, hy); g.lineTo(cx, cy); g.stroke(); } else {
    g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.moveTo(hx, hy); g.lineTo(cx, cy); g.stroke(); g.strokeStyle = '#bfc5cc'; g.lineWidth = 8; g.beginPath(); g.moveTo(hx, hy); g.lineTo(cx, cy); g.stroke();
    g.save(); g.translate(cx, cy); g.rotate(-club); rr(-12, -8, 48, 26, 8); inked('#59616b', 6); g.restore(); }
    gripPt = [hx, hy];
  }
  // head
  g.save(); g.translate(0, -640); g.rotate(pose.head || 0);
  rr(-24, 20, 48, 40, 10); inked(sk, 6);
  circle(0, 0, 70); inked(sk, 7);
  circle(-70, 8, 16); inked(sk, 6); circle(70, 8, 16); inked(sk, 6);
  if (pose.hair) { // tennis look: hair + optional headband / long hair
    if (pose.long) { g.beginPath(); g.ellipse(0, 40, 82, 95, 0, 0, Math.PI * 2); g.fillStyle = pose.hair; g.fill(); circle(0, 0, 70); inked(sk, 7); }
    g.beginPath(); g.moveTo(-72, 0); g.quadraticCurveTo(-76, -78, 0, -80); g.quadraticCurveTo(76, -78, 72, 0); g.quadraticCurveTo(40, -40, 0, -36); g.quadraticCurveTo(-40, -40, -72, 0); g.closePath(); inked(pose.hair, 6);
    if (pose.band) { rr(-74, -42, 148, 22, 10); inked(pose.band, 5); }
  } else {
  g.beginPath(); g.moveTo(-74, -6); g.quadraticCurveTo(-74, -82, 0, -84); g.quadraticCurveTo(74, -82, 74, -6); g.closePath(); inked(pose.cap || '#fafafa', 7);
  g.beginPath(); g.ellipse(0, -8, 98, 22, 0, Math.PI, Math.PI * 2); g.closePath(); inked(pose.cap || '#fafafa', 7);
  rr(-20, -60, 40, 24, 6); g.fillStyle = pose.capLogo || RED; g.fill(); }
  // face
  const ex = pose.eyes || 0;
  g.fillStyle = INK;
  if (pose.face === 'wow') { circle(-26, 8, 10); g.fill(); circle(26, 8, 10); g.fill(); circle(0, 42, 14); g.fill(); }
  else if (pose.face === 'sad') { circle(-26 + ex, 10, 8); g.fill(); circle(26 + ex, 10, 8); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.arc(0, 52, 18, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
  else { const blink = (t % 3.1) < 0.12; if (blink) { g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.moveTo(-34, 10); g.lineTo(-18, 10); g.moveTo(18, 10); g.lineTo(34, 10); g.stroke(); } else { circle(-26 + ex, 10, 8); g.fill(); circle(26 + ex, 10, 8); g.fill(); }
    g.beginPath(); g.arc(0, 28, 26, 0.15 * Math.PI, 0.85 * Math.PI); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); }
  if (CFG && CFG.dad && !pose.hair) { g.fillStyle = '#3a2618'; g.beginPath(); g.ellipse(-16, 20, 22, 9, 0.15, 0, Math.PI * 2); g.ellipse(16, 20, 22, 9, -0.15, 0, Math.PI * 2); g.fill(); }
  g.restore();
  g.restore();
  g.restore();
}
const POSE = {
  open: t => ({ rA1: 1.0 + Math.sin(t * 2) * 0.05, rA2: -0.3, lA1: -1.0 - Math.sin(t * 2) * 0.05, lA2: 0.3, legL: 0.2, legR: -0.2 }),
  idle: t => ({ rA1: 0.25, rA2: 0.1, lA1: -0.25, lA2: -0.1, head: Math.sin(t) * 0.04 }),
  point: t => ({ rA1: 0.25, rA2: 0.1, lA1: -1.7, lA2: 0.05 + Math.sin(t * 6) * 0.06, head: -0.08, eyes: 6 }),
  thumbs: t => ({ rA1: 0.25, rA2: 0.1, lA1: -0.9, lA2: -2.2, head: 0.05 }),
  sad: t => ({ rA1: 2.6, rA2: 1.7, lA1: -0.2, lA2: -0.05, head: 0.15, face: 'sad', lean: 0.03 }),
  wow: t => ({ rA1: 2.4, rA2: 0.4, lA1: -2.4, lA2: -0.4, face: 'wow', jump: 0 }),
  cheer: t => { const j = Math.abs(Math.sin(t * 7)); return { rA1: 2.8 + Math.sin(t * 14) * 0.15, rA2: 0.2, lA1: -2.8 - Math.sin(t * 14) * 0.15, lA2: -0.2, jump: -j * 60, legL: 0.25 * (1 - j), legR: -0.25 * (1 - j) }; },
  address: t => ({ rA1: 0.18, rA2: 0.05, lA1: -0.12, lA2: -0.05, club: 0.12, lean: 0.05, legL: 0.2, legR: -0.2, head: 0.1 }),
};
function swingPose(q) { // q 0..1: address -> top -> impact -> finish
  const keys = [[0, 0.12, 0.18, -0.12], [0.45, 2.6, 0.9, 2.2], [0.62, 0.15, 0.05, -0.05], [1, -2.5, -0.6, -2.8]];
  let a = keys[0], b = keys[1]; for (let i = 0; i < keys.length - 1; i++) if (q >= keys[i][0]) { a = keys[i]; b = keys[i + 1]; }
  const k = ease(clamp((q - a[0]) / (b[0] - a[0])));
  const club = lerp(a[1], b[1], k), arm = lerp(a[2], b[2], k);
  return { rA1: arm + 0.05, rA2: 0.05, lA1: arm - 0.25, lA2: -0.05, club: club + 0.15, legL: 0.2, legR: -0.2, head: q > 0.7 ? -0.3 : 0.1, lean: q > 0.62 ? -0.08 : 0.05 };
}

// ---------- birds ----------
const BIRDS = {
  birdie: { body: '#5fb4e6', belly: '#f5e7a8', wing: '#3c8fc4', head: '#5fb4e6', beak: '#f2a33a', span: 0.9, size: 0.6 },
  eagle: { body: '#6b4a2e', belly: '#7d5636', wing: '#4e3420', head: '#ffffff', beak: '#f2c230', span: 1.6, size: 0.95 },
  albatross: { body: '#ffffff', belly: '#f2f2f2', wing: '#2b2b2b', head: '#ffffff', beak: '#f0c7a0', span: 2.6, size: 0.95, tipWhite: false },
  condor: { body: '#151515', belly: '#202020', wing: '#151515', head: '#c9867a', beak: '#e6d8c8', span: 2.9, size: 1.3, ruff: true, patch: '#e9e9e9' },
};
function bird(type, x, y, s, flap, dir = 1) {
  const B = BIRDS[type]; g.save(); g.translate(x, y); g.scale(s * B.size * dir, s * B.size);
  const wing = (side) => {
    g.save(); if (side < 0) { g.translate(-14, -6); g.scale(0.85, 0.2 + 0.8 * Math.sin(flap + 0.3)); } else g.scale(1, 0.2 + 0.8 * Math.sin(flap));
    const L = 120 * B.span;
    g.beginPath(); g.moveTo(-20, -10); g.quadraticCurveTo(-L * 0.3, -70, -L * 0.15, -L * 0.55); g.lineTo(L * 0.05, -L * 0.62);
    if (type === 'condor') { for (let f = 0; f < 5; f++) { g.lineTo(L * (0.12 + f * 0.05), -L * (0.62 - f * 0.03) - 18); g.lineTo(L * (0.14 + f * 0.05), -L * (0.6 - f * 0.03)); } }
    g.quadraticCurveTo(L * 0.35, -60, 30, -10); g.closePath(); inked(B.wing, 6);
    if (B.patch) { g.beginPath(); g.moveTo(-5, -30); g.quadraticCurveTo(L * 0.05, -L * 0.3, L * 0.1, -L * 0.45); g.lineTo(L * 0.2, -L * 0.42); g.quadraticCurveTo(L * 0.15, -50, 20, -24); g.closePath(); g.fillStyle = B.patch; g.fill(); }
    g.restore();
  };
  wing(-1);
  // tail
  g.beginPath(); g.moveTo(-60, -8); g.lineTo(-115, -24); g.lineTo(-115, 18); g.lineTo(-60, 10); g.closePath(); inked(B.wing, 6);
  // body
  g.beginPath(); g.ellipse(0, 0, 75, 38, 0, 0, Math.PI * 2); inked(B.body, 7);
  g.beginPath(); g.ellipse(10, 14, 50, 18, 0, 0, Math.PI * 2); g.fillStyle = B.belly; g.fill();
  if (B.ruff) { g.beginPath(); g.ellipse(62, -6, 26, 30, 0, 0, Math.PI * 2); inked('#f4f4f4', 6); }
  // head
  circle(84, -22, type === 'birdie' ? 34 : 28); inked(B.head, 6);
  g.beginPath(); g.moveTo(108, -30); g.lineTo(140, -16); g.lineTo(106, -10); g.closePath(); inked(B.beak, 5);
  g.fillStyle = INK; circle(92, -30, 6); g.fill();
  wing(1);
  g.restore();
}

// ---------- text ----------
function bigText(lines, y, size, prog, opts = {}) {
  const k = back(clamp(prog)); g.save(); g.translate(W / 2, y); g.scale(lerp(0.4, 1, k), lerp(0.4, 1, k)); g.globalAlpha = clamp(prog * 3);
  lines.forEach((ln, i) => {
    const parts = ln.split('|'); let fs = size; g.font = `bold ${fs}px DejaVu Sans`;
    const full = parts.join(''); while (g.measureText(full).width > 980 && fs > 40) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; }
    let x = -g.measureText(full).width / 2; const yy = i * fs * 1.08;
    parts.forEach((p, j) => {
      const hl = j % 2 === 1; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineJoin = 'round';
      g.lineWidth = fs * 0.2; g.strokeStyle = INK; g.strokeText(p, x + 5, yy + 7); g.fillStyle = INK; g.fillText(p, x + 5, yy + 7);
      g.strokeStyle = INK; g.strokeText(p, x, yy); g.fillStyle = hl ? (opts.hl || GOLD) : '#fff'; g.fillText(p, x, yy);
      x += g.measureText(p).width;
    });
  });
  g.restore();
}
function badge(x, y, num, label, sub, col, prog) {
  const k = back(clamp(prog)); g.save(); g.translate(x, y); g.scale(k, k); g.rotate(-0.06);
  circle(0, 0, 150); inked(col, 10); circle(0, 0, 120); g.lineWidth = 5; g.strokeStyle = 'rgba(255,255,255,0.5)'; g.stroke();
  g.fillStyle = '#fff'; g.font = 'bold 170px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText(num, 0, 8); g.fillText(num, 0, 8);
  rr(-170, 130, 340, 90, 24); inked('#fff', 8); g.fillStyle = INK; g.font = 'bold 56px DejaVu Sans'; g.fillText(label, 0, 177);
  if (sub) { rr(-90, 230, 180, 64, 20); inked(col, 6); g.fillStyle = '#fff'; g.font = 'bold 44px DejaVu Sans'; g.fillText(sub, 0, 264); }
  g.restore();
}
const ROWS = [['6', 'BOGEY', '+1', '#c94f4f'], ['5', 'PAR', 'E', '#7a8a96'], ['4', 'BIRDIE', '−1', '#3c8fc4'], ['3', 'ÁGUILA', '−2', '#7d5636'], ['2', 'ALBATROS', '−3', '#2f6f8f'], ['1', 'CÓNDOR', '−4', '#c08a1e']];
function ladder(x, y, upto, active, prog) {
  g.save(); g.translate(x, y);
  rr(-10, -70, 400, 70 + 6 * 82 + 20, 26); inked(CREAM, 8);
  g.fillStyle = INK; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PAR 5', 190, -32);
  for (let i = 0; i <= upto && i < 6; i++) {
    const [n, l, d, col] = ROWS[i]; const yy = 10 + i * 82; const isA = i === active; const pop = i === upto ? back(clamp(prog * 3)) : 1;
    g.save(); g.translate(190, yy + 32); g.scale(pop * (isA ? 1.06 : 1), pop * (isA ? 1.06 : 1));
    rr(-185, -32, 370, 66, 18); inked(isA ? col : '#fff', 5);
    g.fillStyle = isA ? '#fff' : INK; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'left'; g.fillText(n, -165, 2);
    g.font = 'bold 34px DejaVu Sans'; g.fillText(l, -115, 2); g.textAlign = 'right'; g.fillText(d, 165, 2);
    g.restore();
  }
  g.restore();
}

// ---------- hole map ----------
function holeMap(t, prog, ballQ, o = {}) {
  const ox = 120, oy = 600, w = 840, h = 860;
  g.save(); rr(ox, oy, w, h, 40); g.fillStyle = '#9fd08a'; g.fill(); g.clip();
  for (let i = 0; i < 40; i++) { g.fillStyle = C.tree; circle(ox + hash(i) * w, oy + hash(i * 3) * h, 26 + hash(i * 5) * 18); if (Math.abs(ox + hash(i) * w - (ox + w / 2 + Math.sin(hash(i * 3) * 3) * 120)) > 170) g.fill(); }
  // fairway path
  const path = q => [ox + w / 2 + Math.sin(q * 3) * 130 * (1 - q * 0.3), oy + h - 80 - q * (h - 200)];
  g.lineCap = 'round'; g.strokeStyle = '#6fb35a'; g.lineWidth = 190; g.beginPath(); for (let q = 0; q <= 1.001; q += 0.02) { const [x, y] = path(q); q === 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  g.strokeStyle = '#7cc366'; g.lineWidth = 150; g.stroke();
  const [gx, gy] = path(1); g.fillStyle = '#93d77b'; g.beginPath(); g.ellipse(gx, gy - 10, 110, 80, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = 6; g.strokeStyle = '#5c9e4a'; g.stroke();
  g.fillStyle = '#f0dca0'; g.beginPath(); g.ellipse(gx + 120, gy + 40, 50, 28, 0.4, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(path(0.55)[0] - 120, path(0.55)[1], 46, 26, -0.3, 0, Math.PI * 2); g.fill();
  const [tx, ty] = path(0); rr(tx - 50, ty - 20, 100, 50, 10); g.fillStyle = '#5fa04c'; g.fill();
  // hole + flag
  g.fillStyle = INK; circle(gx, gy - 10, 10); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(gx, gy - 10); g.lineTo(gx, gy - 110); g.stroke(); g.beginPath(); g.moveTo(gx, gy - 110); g.lineTo(gx + 60, gy - 92 + Math.sin(t * 6) * 4); g.lineTo(gx, gy - 74); g.closePath(); inked(RED, 4);
  // shot dots
  if (o.dots) { for (let i = 0; i < o.dots; i++) { const q = i / (o.dots - 1 || 1); const [x, y] = path(q); const k = back(clamp(prog * o.dots - i)); if (k <= 0) continue; g.save(); g.translate(x, y); g.scale(k, k); circle(0, 0, 30); inked('#fff', 6); g.fillStyle = INK; g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i + 1), 0, 2); g.restore(); } }
  // ball flight one shot
  if (ballQ != null) {
    const q = clamp(ballQ); const [x0, y0] = path(0); const [x1, y1] = [gx, gy - 10];
    g.setLineDash([6, 18]); g.lineWidth = 8; g.strokeStyle = '#fff'; g.beginPath();
    for (let k = 0; k <= q + 1e-6; k += 0.02) { const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 160; k === 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.setLineDash([]);
    const bx = lerp(x0, x1, q), by = lerp(y0, y1, q) - Math.sin(q * Math.PI) * 160; const r = 16 + Math.sin(q * Math.PI) * 10;
    if (q < 1) { circle(bx, by, r); inked('#fff', 5); } else { g.fillStyle = 'rgba(255,215,90,0.6)'; circle(x1, y1, 30 + Math.sin(t * 10) * 6); g.fill(); }
  }
  g.restore();
  rr(ox, oy, w, h, 40); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  rr(ox + 30, oy + 30, 230, 90, 24); inked('#fff', 7); g.fillStyle = INK; g.font = 'bold 54px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PAR 5', ox + 145, oy + 77);
}

// ---------- captions (top, mulligang-like) ----------
function caption(t) {
  let si = 0; CFG.segs.forEach((s, k) => { if (t >= s.start - 0.2) si = k; });
  const S = CFG.segs[si]; const words = S.text.split(/\s+/).filter(Boolean); const span = Math.max(0.5, S.end - S.start);
  const lens = words.map(w => w.length + 1.5), tot = lens.reduce((a, b) => a + b, 0); let acc = 0; const wt = lens.map(l => { const s = S.start + acc / tot * span; acc += l; return s; });
  const chunks = []; let cur = [];
  words.forEach((w, i) => { const len = cur.reduce((a, k) => a + words[k].length + 1, 0) + w.length; if (cur.length && (len > 20 || /[.,:!?…]$/.test(words[cur[cur.length - 1]]))) { chunks.push(cur); cur = []; } cur.push(i); });
  if (cur.length) chunks.push(cur);
  let ci = 0; for (let k = 0; k < chunks.length; k++) if (t >= wt[chunks[k][0]] - 0.05) ci = k;
  const ch = chunks[ci]; const st = wt[ch[0]];
  // split chunk into 2 lines
  const ws = ch.map(i => words[i].toUpperCase()); let l1 = [], l2 = [];
  const half = ws.join(' ').length / 2; let c = 0; ws.forEach((w, k) => { (c < half || !l1.length ? l1 : l2).push([w, ch[k]]); c += w.length + 1; });
  const active = i => t >= wt[i] && (i === words.length - 1 || t < wt[i + 1]);
  const mk = arr => arr.map(([w, i]) => active(i) ? `|${w}|` : w).join(' ').replace(/\| \|/g, ' ');
  const lines = [mk(l1)]; if (l2.length) lines.push(mk(l2));
  bigText(lines, 300, 112, (t - st + 0.05) / 0.25);
}

// ---------- scenes ----------
const SC = {};
SC.hook = (o, p, lt, t) => {
  background(t); golfer(540, 1560, 0.95, POSE.open(t), t);
  const pos = [[220, 760, 'birdie'], [860, 740, 'eagle'], [240, 1050, 'albatross'], [840, 1050, 'condor']];
  pos.forEach(([x, y, b], i) => { const k = back(clamp((p - i * 0.18) * 4)); if (k <= 0) return; bird(b, x + Math.sin(t * 2 + i) * 10, y + Math.cos(t * 3 + i) * 10, 0.55 * k, t * 10 + i, i % 2 ? -1 : 1); g.save(); g.fillStyle = '#fff'; g.strokeStyle = INK; g.lineWidth = 10; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.globalAlpha = k; const lb = ['BIRDIE', 'ÁGUILA', 'ALBATROS', '¿CÓNDOR?'][i]; g.strokeText(lb, x, y + 110); g.fillText(lb, x, y + 110); g.restore(); });
};
SC.par = (o, p, lt, t) => {
  background(t); golfer(330, 1600, 0.85, POSE.point(t), t);
  const k = back(clamp(p * 3)); g.save(); g.translate(720, 860); g.scale(k, k); g.rotate(0.04);
  rr(-260, -200, 520, 400, 36); inked(CREAM, 10);
  g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 140px DejaVu Sans'; g.fillText('PAR', 0, -80);
  g.font = 'bold 44px DejaVu Sans'; g.fillText('= golpes que', 0, 40); g.fillText('"deberías" usar', 0, 100); g.restore();
};
SC.map = (o, p, lt, t) => { background(t, { noFlag: true }); holeMap(t, p, null, { dots: 5 }); };
SC.row = (o, p, lt, t) => {
  background(t); const [n, l, d, col] = ROWS[o.row];
  golfer(300, 1650, 0.78, POSE[o.pose](t), t);
  ladder(620, 640, o.row, o.row, p);
  badge(560, 1340, n, l, d, col, (p - 0.1) * 3);
  if (o.bird) { const q = (lt * 0.25) % 1; bird(o.bird, lerp(-200, 1300, q), 560 + Math.sin(lt * 2) * 30, o.bs || 0.6, t * (o.bird === 'albatross' ? 4 : 11), 1); }
  if (o.row === 0) { g.fillStyle = 'rgba(120,130,140,0.85)'; for (const [dx, dy, r] of [[0, 0, 50], [50, -20, 60], [110, 0, 45]]) { circle(180 + dx, 760 + dy, r); g.fill(); } g.strokeStyle = '#6aa0d8'; g.lineWidth = 6; for (let i = 0; i < 6; i++) { const y0 = 820 + ((lt * 300 + i * 40) % 140); g.beginPath(); g.moveTo(170 + i * 22, y0); g.lineTo(162 + i * 22, y0 + 26); g.stroke(); } }
};
SC.condor = (o, p, lt, t) => {
  if (p < 0.45) { background(t, { noFlag: true }); holeMap(t, p, seg(p, 0.05, 0.4)); if (p > 0.4) bigText(['¡HOYO EN |UNO|!'], 560, 100, (p - 0.4) * 8); return; }
  background(t); const q = seg(p, 0.45, 1);
  g.fillStyle = `rgba(255,215,90,${0.25 + 0.15 * Math.sin(t * 6)})`; circle(540, 900, 520 * easeOut(q)); g.fill();
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t * 0.4; g.strokeStyle = 'rgba(255,240,180,0.5)'; g.lineWidth = 18; g.beginPath(); g.moveTo(540 + Math.cos(a) * 200, 900 + Math.sin(a) * 200); g.lineTo(540 + Math.cos(a) * 700, 900 + Math.sin(a) * 700); g.stroke(); }
  bird('condor', lerp(-300, 560, easeOut(q)), 860 + Math.sin(t * 2) * 20, 1.0, t * 3.5);
  golfer(800, 1700, 0.65, POSE.cheer(t), t);
  ladder(60, 1180, 5, 5, 1);
};
SC.rare = (o, p, lt, t) => {
  background(t); golfer(300, 1650, 0.75, POSE.wow(t), t);
  const k = back(clamp(p * 3)); g.save(); g.translate(700, 900); g.scale(k, k);
  circle(0, 0, 230); inked(GOLD, 12); g.fillStyle = '#fff'; g.font = 'bold 280px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 18; g.strokeStyle = INK; g.strokeText('5', 0, 20); g.fillText('5', 0, 20);
  rr(-260, 250, 520, 100, 28); inked('#fff', 8); g.fillStyle = INK; g.font = 'bold 50px DejaVu Sans'; g.fillText('EN LA HISTORIA', 0, 302); g.restore();
  for (let i = 0; i < 5; i++) { const kk = back(clamp(p * 5 - i * 0.6 - 0.5)); if (kk <= 0) continue; g.save(); g.translate(560 + i * 100, 1380); g.scale(kk, kk); g.fillStyle = GOLD; g.beginPath(); for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2 - Math.PI / 2, r = j % 2 ? 18 : 42; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); inked(GOLD, 5); g.restore(); }
};
SC.cta = (o, p, lt, t) => {
  background(t); golfer(290, 1650, 0.75, POSE.thumbs(t), t); ladder(560, 640, 5, Math.floor(lt * 2) % 6, 1);
  const k = back(clamp((p - 0.1) * 3)); g.save(); g.translate(560, 1400); g.scale(k, k);
  rr(-250, -60, 500, 120, 60); inked(RED, 8); g.fillStyle = '#fff'; g.font = 'bold 56px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COMENTA ↓', 0, 4); g.restore();
};


// ---------- DAD: hardest sport ----------
function stands(t) { for (let r = 0; r < 6; r++) for (let c = 0; c < 40; c++) { const x = c * 28 + (r % 2) * 14, y = 860 + r * 34; g.fillStyle = ['#d8322b', '#3c8fc4', '#f2b632', '#ffffff', '#6b4a2e'][(c * 7 + r * 3) % 5]; circle(x, y + Math.abs(Math.sin(t * 6 + c + r)) * -4, 11); g.fill(); } g.fillStyle = '#4a5560'; g.fillRect(0, 1060, W, 50); }
function bgFor(kind, t) {
  background(t, { noFlag: kind !== 'golf' });
  if (kind === 'soccer' || kind === 'baseball') { g.fillStyle = '#7d8a96'; g.fillRect(0, 820, W, 290); stands(t); }
  if (kind === 'track') { g.fillStyle = '#5b5f66'; g.fillRect(0, 1250, W, 330); g.fillStyle = '#fff'; for (let i = 0; i < 8; i++) g.fillRect(((i * 200 - t * 900) % 1600 + 1600) % 1600 - 200, 1405, 110, 16); for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? '#d8322b' : '#fff'; g.fillRect(((i * 60 - t * 900) % 1200 + 1200) % 1200 - 60, 1240, 60, 18); } }
  if (kind === 'baseball') { g.fillStyle = '#c99a62'; g.beginPath(); g.ellipse(540, 1700, 700, 260, 0, 0, Math.PI * 2); g.fill(); }
}
function stamp(txt, prog, col = RED, y = 760) { const k = back(clamp(prog * 2.5)); if (k <= 0) return; g.save(); g.translate(540, y); g.rotate(-0.12); g.scale(k, k); rr(-300, -90, 600, 180, 30); g.lineWidth = 14; g.strokeStyle = col; g.stroke(); g.fillStyle = col; g.font = 'bold 120px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 8); g.restore(); }
function meter(label, val, prog, col) {
  const k = clamp(prog * 1.6); g.save(); g.translate(540, 1330);
  rr(-420, -120, 840, 260, 40); inked(CREAM, 10);
  g.fillStyle = INK; g.font = 'bold 50px DejaVu Sans'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(label, -380, -62);
  g.textAlign = 'right'; g.fillText('DIFICULTAD', 380, -62);
  rr(-380, 0, 600, 70, 35); g.fillStyle = '#e4dcc4'; g.fill();
  const v = val * easeOut(k); const wv = 600 * v / 10; if (wv > 1) { rr(-380, 0, Math.max(70, wv), 70, 35); g.fillStyle = col; g.fill(); }
  g.lineWidth = 6; g.strokeStyle = INK; rr(-380, 0, 600, 70, 35); g.stroke();
  g.font = 'bold 110px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = col; g.lineWidth = 12; g.strokeStyle = INK; const txt = `${Math.round(v)}/10`; g.strokeText(txt, 310, 38); g.fillText(txt, 310, 38);
  g.restore();
}
function f1car(x, y, s, rot, t) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(-260, -40, 520, 70, 30); inked('#d8322b', 8); rr(-300, -10, 80, 40, 10); inked('#22301f', 6); rr(230, -70, 40, 80, 8); inked('#22301f', 6); rr(180, -90, 120, 26, 8); inked('#d8322b', 6);
  circle(-10, -60, 42); inked('#f2b632', 7); rr(-40, -72, 60, 22, 10); g.fillStyle = INK; g.fill();
  for (const wx of [-170, 160]) { g.save(); g.translate(wx, 40); g.rotate(t * 30); circle(0, 0, 58); inked('#2a2a2a', 7); circle(0, 0, 24); g.fillStyle = '#bbb'; g.fill(); g.fillStyle = '#666'; g.fillRect(-4, -50, 8, 100); g.restore(); }
  g.fillStyle = '#fff'; g.font = 'bold 44px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1', 90, -6); g.restore(); }
function puff(x, y, r, a) { g.fillStyle = `rgba(230,230,230,${a})`; circle(x, y, r); g.fill(); circle(x + r * 0.7, y - r * 0.3, r * 0.8); g.fill(); circle(x - r * 0.7, y - r * 0.2, r * 0.7); g.fill(); }
SC.dadIntro = (o, p, lt, t) => { bgFor('golf', t); golfer(540, 1640, 0.9, POSE.open(t), t);
  const items = [['golf', 230, 760], ['soccer', 850, 760], ['f1', 230, 1080], ['baseball', 850, 1080]];
  items.forEach(([k, x, y], i) => { const q = back(clamp((p - i * 0.15) * 4)); if (q <= 0) return; g.save(); g.translate(x, y + Math.sin(t * 3 + i) * 10); g.scale(q, q);
    circle(0, 0, 95); inked('#fff', 8);
    if (k === 'golf') { circle(0, 0, 40); inked('#fff', 5); for (let d = 0; d < 9; d++) { g.fillStyle = '#ccc'; circle(-15 + (d % 3) * 15, -15 + Math.floor(d / 3) * 15, 4); g.fill(); } }
    if (k === 'soccer') { circle(0, 0, 50); inked('#fff', 5); g.fillStyle = INK; for (let j = 0; j < 5; j++) { const a = j / 5 * Math.PI * 2; circle(Math.cos(a) * 28, Math.sin(a) * 28, 10); g.fill(); } circle(0, 0, 13); g.fill(); }
    if (k === 'f1') f1car(0, 10, 0.28, 0, t);
    if (k === 'baseball') { circle(0, 0, 48); inked('#fff', 5); g.strokeStyle = RED; g.lineWidth = 5; g.beginPath(); g.arc(-60, 0, 45, -0.8, 0.8); g.stroke(); g.beginPath(); g.arc(60, 0, 45, Math.PI - 0.8, Math.PI + 0.8); g.stroke(); }
    g.restore(); });
};
SC.dadGolf = (o, p, lt, t) => { bgFor('golf', t); const q = clamp(p * 1.25); golfer(420, 1650, 0.85, q < 1 ? swingPose(q) : POSE.sad(t), t);
  circle(640, 1648, 16); inked('#fff', 5); if (p > 0.62 && p < 0.9) { g.fillStyle = 'rgba(120,90,50,0.7)'; for (let i = 0; i < 8; i++) { circle(560 + i * 18, 1640 - Math.sin(i) * 40 * seg(p, 0.62, 0.8), 10); g.fill(); } }
  if (p > 0.72) stamp('¡FALLÓ!', (p - 0.72) * 3); };
SC.dadRate = (o, p, lt, t) => { bgFor(o.bg, t);
  if (o.fail === 'golf') { golfer(330, 1150, 0.6, POSE.sad(t), t); circle(560, 1140, 12); inked('#fff', 4); g.fillStyle = INK; circle(880, 1150, 22); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(880, 1150); g.lineTo(880, 1000); g.stroke(); g.beginPath(); g.moveTo(880, 1000); g.lineTo(950, 1020); g.lineTo(880, 1040); g.closePath(); inked(RED, 4); g.fillStyle = INK; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.fillText('11 cm', 880, 1210); }
  if (o.fail === 'soccer') { const bx = lerp(520, 1150, seg(p, 0, 0.5)), by = lerp(1100, 640, seg(p, 0, 0.5)); golfer(330, 1150, 0.6, POSE.wow(t), t); g.save(); g.translate(bx, by); g.rotate(t * 10); circle(0, 0, 30); inked('#fff', 5); g.fillStyle = INK; circle(0, 0, 9); g.fill(); g.restore(); stamp('¡A LA TRIBUNA!', (p - 0.3) * 3, RED, 760); }
  if (o.fail === 'f1') { const rot = t * 9; f1car(540, 1100, 0.85, rot, t); for (let i = 0; i < 6; i++) puff(540 + Math.cos(i * 1.1 + t) * 220, 1150 + Math.sin(i * 1.7) * 40, 60 + i * 6, 0.6); stamp('¡TROMPO!', (p - 0.15) * 3, RED, 760); }
  if (o.fail === 'baseball') { golfer(470, 1180, 0.65, Object.assign(swingPose(1), { bat: true, face: 'wow' }), t); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 10; g.beginPath(); g.moveTo(-50, 1000); g.lineTo(700, 1040); g.stroke(); stamp('¡NI LA VIO!', (p - 0.15) * 3, RED, 760); }
  meter(o.label, o.val, seg(p, o.mAt ?? 0.35, 1), o.col);
};
SC.dadSoccer = (o, p, lt, t) => { bgFor('soccer', t);
  g.save(); g.translate(780, 1290); rr(-220, -230, 440, 230, 4); g.lineWidth = 14; g.strokeStyle = '#fff'; g.stroke(); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 3; for (let x = -210; x < 220; x += 30) { g.beginPath(); g.moveTo(x, -225); g.lineTo(x, 0); g.stroke(); } for (let y = -220; y < 0; y += 30) { g.beginPath(); g.moveTo(-215, y); g.lineTo(215, y); g.stroke(); } g.restore();
  g.save(); g.translate(780, 1240); g.fillStyle = '#2c8f45'; rr(-40, -140, 80, 140, 30); inked('#2c8f45', 6); circle(0, -170, 32); inked('#e2a87c', 6); g.restore();
  const run = seg(p, 0, 0.6); golfer(lerp(120, 330, run), 1650, 0.7, run < 1 ? { rA1: Math.sin(t * 12) * 0.8, lA1: -Math.sin(t * 12) * 0.8, legL: Math.sin(t * 12) * 0.5, legR: -Math.sin(t * 12) * 0.5 } : { legL: -0.9, legR: 0.1, rA1: 1.0, lA1: -1.2 }, t);
  const kick = seg(p, 0.6, 1); g.save(); g.translate(lerp(470, 470, 0), 1630 - kick * 600); g.translate(kick * 500, 0); g.rotate(t * 12); circle(0, 0, 30); inked('#fff', 5); g.fillStyle = INK; circle(0, 0, 9); g.fill(); g.restore();
  g.save(); g.fillStyle = '#fff'; g.strokeStyle = INK; g.lineWidth = 12; g.font = 'bold 90px DejaVu Sans'; g.textAlign = 'center'; const k = back(clamp((p - 0.2) * 3)); g.translate(540, 640); g.scale(k, k); g.strokeText('+100 KM/H', 0, 0); g.fillText('+100 KM/H', 0, 0); g.restore(); };
SC.dadF1 = (o, p, lt, t) => { bgFor('track', t); f1car(540, 1360 + Math.sin(t * 40) * 3, 1.0, 0, t);
  for (let i = 0; i < 14; i++) { g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 6; const y = 900 + i * 40, x = ((i * 137 - t * 2200) % 1400 + 1400) % 1400 - 200; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 180, y); g.stroke(); }
  const k = back(clamp((p - 0.2) * 3)); g.save(); g.translate(540, 760); g.scale(k, k); circle(0, 0, 150); inked(GOLD, 10); g.fillStyle = '#fff'; g.font = 'bold 150px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText('5G', 0, 10); g.fillText('5G', 0, 10); g.restore(); };
SC.dadBaseball = (o, p, lt, t) => { bgFor('baseball', t);
  g.save(); g.translate(170, 1430); g.scale(0.55, 0.55); rr(-60, -280, 120, 260, 40); inked('#3c5f9a', 7); circle(0, -320, 55); inked('#e2a87c', 7); g.restore();
  const thrown = seg(p, 0.35, 0.47); golfer(780, 1660, 0.7, p < 0.5 ? { rA1: 0.9, rA2: -0.4, lA1: 0.4, lA2: -0.6, club: -2.4, bat: true } : Object.assign(swingPose(0.95), { bat: true }), t);
  if (thrown > 0 && thrown < 1) { const bx = lerp(220, 1000, thrown); g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 14; g.beginPath(); g.moveTo(bx - 300, 1300); g.lineTo(bx, 1300); g.stroke(); circle(bx, 1300, 20); inked('#fff', 5); }
  const k = back(clamp((p - 0.5) * 3)); g.save(); g.translate(540, 700); g.scale(k, k); rr(-300, -90, 600, 180, 40); inked(CREAM, 8); g.fillStyle = RED; g.font = 'bold 110px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('0.4 SEG', 0, 8); g.restore(); };
SC.dadCta = (o, p, lt, t) => { bgFor('golf', t); golfer(250, 1700, 0.62, POSE.thumbs(t), t);
  const rows = [['BÉISBOL', 10, '#c94f4f'], ['FÓRMULA 1', 9, '#d8322b'], ['GOLF', 8, '#3c8fc4'], ['FÚTBOL', 6, '#2c8f45']];
  rows.forEach(([l, v, c], i) => { const k = back(clamp(p * 4 - i * 0.4)); if (k <= 0) return; g.save(); g.translate(660, 680 + i * 150); g.scale(k, k); rr(-300, -55, 600, 110, 30); inked('#fff', 7); g.fillStyle = INK; g.font = 'bold 50px DejaVu Sans'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(`${i + 1}. ${l}`, -270, 4); g.textAlign = 'right'; g.fillStyle = c; g.fillText(`${v}/10`, 270, 4); g.restore(); });
  const k = back(clamp((p - 0.4) * 3)); g.save(); g.translate(660, 1320); g.scale(k, k); rr(-250, -60, 500, 120, 60); inked(RED, 8); g.fillStyle = '#fff'; g.font = 'bold 56px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COMENTA ↓', 0, 4); g.restore(); };


// ---------- TENNIS (2dbuena) ----------
const COURTS = { grass: ['#5fa24a', '#6bb054', '#4f8f3c'], clay: ['#c8643c', '#cf6e45', '#b85b36'], hard: ['#2f6db5', '#3577c2', '#3d8b5a'] };
function tP(i) { return CFG.players[i]; }
function tPose(i, base) { const P = tP(i); return Object.assign({ shirt: P.shirt, pants: P.pants || '#ffffff', skin: P.skin, hair: P.hair || '#3a2618', band: P.band, long: P.long, rcol: P.rcol }, base); }
const CY = { far: 1090, net: 1360, near: 1770 };
function courtX(u, y) { const t = (y - CY.far) / (CY.near - CY.far); const half = lerp(250, 520, t); return 540 + u * half; }
function court(t, o = {}) {
  const [c1, c2, out] = COURTS[CFG.court || 'grass'];
  const gr = g.createLinearGradient(0, 0, 0, 1100); gr.addColorStop(0, CFG.indoor ? '#2b2f45' : '#f3ead2'); gr.addColorStop(1, CFG.indoor ? '#3c4160' : '#f6d7a2'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (!CFG.indoor) { g.fillStyle = 'rgba(246,199,107,0.35)'; circle(860, 860, 160); g.fill(); g.fillStyle = C.sun; circle(860, 860, 110); g.fill(); }
  g.fillStyle = '#7d8a96'; g.fillRect(0, 820, W, 240); stands(t);
  g.fillStyle = CFG.court === 'hard' ? '#2c5e3e' : '#3e6e45'; g.fillRect(0, 1040, W, 60);
  g.fillStyle = out; g.fillRect(0, 1060, W, H - 1060);
  g.beginPath(); g.moveTo(courtX(-1.25, CY.far - 30), CY.far - 30); g.lineTo(courtX(1.25, CY.far - 30), CY.far - 30); g.lineTo(courtX(1.25, H), H); g.lineTo(courtX(-1.25, H), H); g.closePath(); g.fillStyle = c1; g.fill();
  if (CFG.court === 'grass') for (let i = 0; i < 12; i++) { const y0 = CY.far + (CY.near - CY.far) * i / 12, y1 = CY.far + (CY.near - CY.far) * (i + 0.5) / 12; g.fillStyle = c2; g.beginPath(); g.moveTo(courtX(-1.2, y0), y0); g.lineTo(courtX(1.2, y0), y0); g.lineTo(courtX(1.2, y1), y1); g.lineTo(courtX(-1.2, y1), y1); g.fill(); }
  g.strokeStyle = '#fff'; g.lineWidth = 6; const L = (u0, y0, u1, y1) => { g.beginPath(); g.moveTo(courtX(u0, y0), y0); g.lineTo(courtX(u1, y1), y1); g.stroke(); };
  L(-1, CY.far, 1, CY.far); L(-1, CY.near, 1, CY.near); L(-1, CY.far, -1, CY.near); L(1, CY.far, 1, CY.near); L(-0.78, CY.far, -0.78, CY.near); L(0.78, CY.far, 0.78, CY.near);
  L(-0.78, 1215, 0.78, 1215); L(-0.78, 1560, 0.78, 1560); L(0, 1215, 0, 1560);
}
function net() { const y = CY.net; const x0 = courtX(-1.15, y), x1 = courtX(1.15, y);
  g.fillStyle = 'rgba(30,30,30,0.55)'; g.fillRect(x0, y - 90, x1 - x0, 90); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 2; for (let x = x0; x < x1; x += 14) { g.beginPath(); g.moveTo(x, y - 90); g.lineTo(x, y); g.stroke(); } for (let yy = y - 90; yy < y; yy += 14) { g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); }
  rr(x0, y - 100, x1 - x0, 16, 6); inked('#fff', 4); for (const x of [x0, x1]) { rr(x - 8, y - 110, 16, 112, 6); inked('#59616b', 4); } }
function ballAt2(q, xn, xf) { const yA = 1560, yB = 1020; const y = lerp(yA, yB, q) - Math.sin(q * Math.PI) * 260; const x = lerp(xn, xf, q); return [x, y, lerp(yA + 40, yB + 60, q)]; }
function drawBall(x, y, sy, r) { g.fillStyle = 'rgba(0,0,0,0.2)'; g.beginPath(); g.ellipse(x, sy, r * 1.1, r * 0.4, 0, 0, Math.PI * 2); g.fill(); circle(x, y, r); inked('#e6f04a', 4); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(x - r * 0.6, y, r * 0.8, -0.8, 0.8); g.stroke(); }
function scoreboard(n, p, o = {}) {
  if (!CFG.sets || n <= 0) return; const sets = CFG.sets; const show = Math.min(sets.length, n);
  const k = back(clamp(p * 4)); g.save(); g.translate(540, 650); g.scale(k, k);
  const w = 260 + show * 110; rr(-w / 2, -110, w, 220, 30); inked(CREAM, 8);
  [0, 1].forEach(i => { const y = -55 + i * 110; const P = tP(i); rr(-w / 2 + 20, y - 34, 20, 68, 8); g.fillStyle = P.chip || P.shirt; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    g.fillStyle = INK; g.font = 'bold 44px DejaVu Sans'; g.textAlign = 'left'; g.textBaseline = 'middle'; const nm = P.name; let fs = 44; while (g.measureText(nm).width > 190 && fs > 24) { fs -= 2; g.font = `bold ${fs}px DejaVu Sans`; } g.fillText(nm, -w / 2 + 52, y + 2);
    for (let j = 0; j < show; j++) { const v = sets[j][i], ov = sets[j][1 - i]; const x = -w / 2 + 250 + j * 110; const won = v > ov; rr(x, y - 40, 92, 80, 14); g.fillStyle = won ? GOLD : '#fff'; g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.textAlign = 'center'; let f2 = 50; g.font = `bold ${f2}px DejaVu Sans`; while (g.measureText(String(v)).width > 80) { f2 -= 4; g.font = `bold ${f2}px DejaVu Sans`; } g.fillText(String(v), x + 46, y + 3); } });
  g.restore(); }
function card(label, value, p, y = 820, col = GOLD) { const k = back(clamp(p * 3)); if (k <= 0) return; g.save(); g.translate(540, y); g.scale(k, k); g.rotate(-0.03);
  rr(-440, -150, 880, 300, 40); inked(CREAM, 10); g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; let lf = 52; g.font = `bold ${lf}px DejaVu Sans`; while (label && g.measureText(label).width > 800 && lf > 30) { lf -= 2; g.font = `bold ${lf}px DejaVu Sans`; } if (label) g.fillText(label, 0, -92);
  let fs = 170; g.font = `bold ${fs}px DejaVu Sans`; while (g.measureText(value).width > 800 && fs > 60) { fs -= 6; g.font = `bold ${fs}px DejaVu Sans`; } g.lineWidth = 16; g.strokeStyle = INK; g.strokeText(value, 0, label ? 30 : 0); g.fillStyle = col; g.fillText(value, 0, label ? 30 : 0); g.restore(); }
function trophy2d(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(-90, -200); g.lineTo(90, -200); g.quadraticCurveTo(90, -40, 0, -20); g.quadraticCurveTo(-90, -40, -90, -200); g.closePath(); inked(GOLD, 8); for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 100, -140, 40, 0, Math.PI * 2); g.lineWidth = 14; g.strokeStyle = INK; g.stroke(); g.lineWidth = 7; g.strokeStyle = GOLD; g.stroke(); } rr(-20, -24, 40, 60, 6); inked(GOLD, 6); rr(-70, 34, 140, 40, 10); inked('#7a5a2a', 6); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(-60, -185, 18, 120); g.restore(); }
function confetti2d(t, p) { const cols = [RED, GOLD, '#3c8fc4', '#fff', '#2c8f45']; for (let i = 0; i < 120; i++) { const x = (hash(i) * W + Math.sin(t * 2 + i) * 30), y = ((hash(i * 3) * H + t * (200 + hash(i * 5) * 200)) % (H + 100)) - 50; g.save(); g.translate(x, y); g.rotate(t * 4 + i); g.fillStyle = cols[i % 5]; g.fillRect(-8, -12, 16, 24); g.restore(); } }
function players(t, p, o = {}) { // far player i=1, near i=0 (o.swap flips)
  const nearI = o.swap ? 1 : 0, farI = 1 - nearI; const cyc = 1.5; const ph = (t % cyc) / cyc; const toFar = ph < 0.5; const q = toFar ? ph * 2 : 2 - ph * 2;
  const xn = courtX(Math.sin(t * 1.3) * 0.5, CY.near), xf = courtX(Math.cos(t * 1.1) * 0.5, CY.far);
  const swingN = Math.max(0, 1 - Math.abs(ph - 0.0) * 8) + Math.max(0, 1 - Math.abs(ph - 1) * 8), swingF = Math.max(0, 1 - Math.abs(ph - 0.5) * 8);
  golfer(xf, CY.far + 10, 0.36, tPose(farI, { rA1: -0.2, lA1: 0.3, racket: lerp(0.6, -1.4, swingF), legL: Math.sin(t * 9) * 0.25, legR: -Math.sin(t * 9) * 0.25 }), t);
  if (o.rally !== false) { const [bx, by, sy] = ballAt2(q, xn, xf); const r = lerp(16, 9, q); return { draw: () => drawBall(bx, by, sy, r), near: () => golfer(xn, CY.near + 20, 0.62, tPose(nearI, Object.assign({ rA1: 0.9 - swingN * 1.6, rA2: -0.3, lA1: -0.5, racket: lerp(-0.9, 1.6, swingN), legL: 0.3, legR: -0.3 }, o.nearPose || {})), t) }; }
  return { draw: () => {}, near: () => golfer(xn, CY.near + 20, 0.62, tPose(nearI, Object.assign({ racket: 0.3 }, o.nearPose || {})), t) };
}
SC.tIntro = (o, p, lt, t) => { court(t); net(); const pl = players(t, p, { rally: false }); pl.near();
  const k = back(clamp(p * 3)); g.save(); g.translate(540, 760); g.scale(k, k); rr(-430, -170, 860, 340, 40); inked(CREAM, 10);
  g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; let fs = 74; g.font = `bold ${fs}px DejaVu Sans`; while (g.measureText(CFG.event).width > 790) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; } g.fillText(CFG.event, 0, -95);
  g.font = 'bold 120px DejaVu Sans'; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText(CFG.year, 0, 15); g.fillStyle = GOLD; g.fillText(CFG.year, 0, 15);
  g.fillStyle = INK; g.font = 'bold 46px DejaVu Sans'; const vs = `${tP(0).name}  vs  ${tP(1).name}`; let f2 = 46; while (g.measureText(vs).width > 800) { f2 -= 2; g.font = `bold ${f2}px DejaVu Sans`; } g.fillText(vs, 0, 120); g.restore(); };
SC.tRally = (o, p, lt, t) => { court(t, o); const pl = players(t, p, o); net(); pl.draw(); pl.near(); if (o.dark) { g.fillStyle = `rgba(10,15,40,${o.dark})`; g.fillRect(0, 0, W, H); } scoreboard(o.sets ?? 0, p); if (o.stamp) stamp(o.stamp, (p - (o.stampAt ?? 0.5)) * 3, o.stampCol || RED, 900); };
SC.tStat = (o, p, lt, t) => { court(t); net(); const pl = players(t, p, { rally: false, nearPose: o.nearPose }); pl.near(); if (o.dark) { g.fillStyle = `rgba(10,15,40,${o.dark})`; g.fillRect(0, 0, W, H); g.fillStyle = '#f4f1d0'; circle(820, 620, 70); g.fill(); g.fillStyle = 'rgba(10,15,40,1)'; circle(850, 600, 62); g.fill(); }
  if (o.sets) scoreboard(o.sets, p); card(o.label, o.value, p - 0.08, o.sets ? 960 : 820, o.col || GOLD); if (o.stamp) stamp(o.stamp, (p - 0.5) * 3, RED, 1240); };
SC.tWin = (o, p, lt, t) => { court(t); net(); const w = o.w ?? 0, l = 1 - w;
  golfer(760, 1300, 0.5, tPose(l, Object.assign({ racket: 2.6 }, POSE.sad(t))), t);
  golfer(360, 1720, 0.7, tPose(w, POSE.cheer(t)), t); trophy2d(360, 1720 - 560 - Math.abs(Math.sin(t * 7)) * 60 * 0.7, 0.55);
  confetti2d(t, p); scoreboard(o.sets ?? (CFG.sets ? CFG.sets.length : 0), 1); if (o.value) card(o.label, o.value, p - 0.25, 960); };
SC.tTired = (o, p, lt, t) => { court(t); net();
  const lie = i => golfer(i ? 760 : 330, 1650, 0.55, tPose(i, { rA1: 2.6, lA1: -2.6, face: 'sad', legL: 0.6, legR: -0.6 }), t);
  if (o.chairs) { for (const x of [330, 760]) { rr(x - 110, 1430, 220, 40, 10); inked('#8a5a2e', 6); rr(x - 100, 1220, 30, 330, 10); inked('#8a5a2e', 6); } }
  g.save(); g.globalAlpha = 1; lie(0); lie(1); g.restore(); if (o.value) card(o.label, o.value, p - 0.1, 760); };
SC.tCta = (o, p, lt, t) => { court(t); net(); const pl = players(t, p, { rally: false }); pl.near();
  const opts = o.opts || [tP(0).name, tP(1).name]; opts.forEach((txt, i) => { const k = back(clamp(p * 4 - i * 0.5)); if (k <= 0) return; g.save(); g.translate(540, 680 + i * 170); g.scale(k, k); rr(-360, -65, 720, 130, 40); inked(i ? '#3c8fc4' : RED, 8); g.fillStyle = '#fff'; g.font = 'bold 64px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 4); g.restore(); });
  const k = back(clamp((p - 0.35) * 3)); g.save(); g.translate(540, 1060); g.scale(k, k); rr(-250, -60, 500, 120, 60); inked(GOLD, 8); g.fillStyle = INK; g.font = 'bold 56px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COMENTA ↓', 0, 4); g.restore(); };


// ---------- BASEBALL (2dbuena) ----------
const HOME = [540, 1690], B1 = [850, 1390], B2 = [540, 1180], B3 = [230, 1390], MOUND = [540, 1400];
function bField(t, o = {}) {
  const gr = g.createLinearGradient(0, 0, 0, 1000); gr.addColorStop(0, o.night ? '#1b2340' : '#f3ead2'); gr.addColorStop(1, o.night ? '#2c3560' : '#f6d7a2'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (!o.night) { g.fillStyle = 'rgba(246,199,107,0.35)'; circle(860, 800, 150); g.fill(); g.fillStyle = C.sun; circle(860, 800, 100); g.fill(); }
  else for (let i = 0; i < 6; i++) { const x = 120 + i * 170; g.fillStyle = 'rgba(255,250,220,0.25)'; circle(x, 700, 60); g.fill(); g.fillStyle = '#fffbe8'; rr(x - 30, 690, 60, 20, 6); g.fill(); }
  g.fillStyle = '#7d8a96'; g.fillRect(0, 760, W, 260); stands(t - 0.0);
  g.save(); g.translate(0, -100); stands(t + 1); g.restore();
  g.fillStyle = '#2f5a3a'; g.fillRect(0, 1000, W, 60); g.fillStyle = GOLD; g.fillRect(0, 1000, W, 8);
  g.fillStyle = '#5fa24a'; g.fillRect(0, 1060, W, H - 1060);
  for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; g.beginPath(); g.moveTo(540 + (i - 5) * 60, 1060); g.lineTo(540 + (i - 4) * 60, 1060); g.lineTo(540 + (i - 4) * 400, H); g.lineTo(540 + (i - 5) * 400, H); g.fill(); }
  // infield dirt
  g.fillStyle = '#c99a62'; g.beginPath(); g.moveTo(HOME[0], HOME[1] + 60); g.lineTo(B1[0] + 70, B1[1]); g.quadraticCurveTo(540, 1000, B3[0] - 70, B3[1]); g.closePath(); g.fill();
  g.fillStyle = '#5fa24a'; g.beginPath(); g.moveTo(HOME[0], HOME[1] - 70); g.lineTo(B1[0] - 70, B1[1]); g.lineTo(B2[0], B2[1] + 50); g.lineTo(B3[0] + 70, B3[1]); g.closePath(); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.moveTo(HOME[0], HOME[1]); g.lineTo(1080 + 200, 1060 - 50); g.moveTo(HOME[0], HOME[1]); g.lineTo(-200, 1010); g.stroke();
  g.fillStyle = '#c99a62'; g.beginPath(); g.ellipse(MOUND[0], MOUND[1], 70, 30, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#fff'; g.fillRect(MOUND[0] - 18, MOUND[1] - 4, 36, 8);
  for (const [x, y] of [B1, B2, B3]) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillStyle = '#fff'; g.fillRect(-14, -14, 28, 28); g.restore(); }
  g.fillStyle = '#fff'; g.beginPath(); g.moveTo(HOME[0] - 26, HOME[1] - 10); g.lineTo(HOME[0] + 26, HOME[1] - 10); g.lineTo(HOME[0] + 26, HOME[1] + 6); g.lineTo(HOME[0], HOME[1] + 22); g.lineTo(HOME[0] - 26, HOME[1] + 6); g.closePath(); g.fill();
  if (o.night) { g.fillStyle = 'rgba(10,15,40,0.25)'; g.fillRect(0, 0, W, H); }
}
function bTeam(i) { return CFG.teams[i]; }
function bPose(i, base) { const T = bTeam(i); return Object.assign({ shirt: T.shirt, pants: T.pants || '#f2f2f2', cap: T.cap, capLogo: T.logo || '#fff', skin: T.skin }, base); }
function bScore(p, sh) {
  const sc = valAt(sh.score, p) || [0, 0]; const inn = valAt(sh.inning, p) || ''; const outs = valAt(sh.outs, p); const cnt = valAt(sh.count, p);
  g.save(); g.translate(540, 640); rr(-440, -95, 880, 190, 30); inked(CREAM, 8);
  [0, 1].forEach(i => { const y = -45 + i * 90; const T = bTeam(i); rr(-420, y - 32, 22, 64, 8); g.fillStyle = T.shirt === '#ffffff' ? T.cap : T.shirt; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    g.fillStyle = INK; g.font = 'bold 46px DejaVu Sans'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(T.name, -380, y + 2);
    const ch = changeAt2(sh.score, p); const bump = ch && ch.k === i && p - ch.p < 0.15 ? 1.3 : 1;
    g.save(); g.translate(60, y + 2); g.scale(bump, bump); rr(-45, -38, 90, 76, 14); g.fillStyle = GOLD; g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.textAlign = 'center'; g.font = 'bold 52px DejaVu Sans'; g.fillText(String(sc[i]), 0, 3); g.restore(); });
  g.fillStyle = INK; g.textAlign = 'center'; g.font = 'bold 40px DejaVu Sans'; g.fillText(inn, 290, -45);
  if (outs != null) { for (let k = 0; k < 3; k++) { circle(230 + k * 60, 20, 16); g.fillStyle = k < outs ? RED : '#fff'; g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); } }
  if (cnt) { g.font = 'bold 34px DejaVu Sans'; g.fillStyle = INK; g.fillText(cnt, 290, 70); }
  g.restore();
}
function changeAt2(v, p) { if (!isSeq2(v)) return null; let r = null; for (let i = 1; i < v.length; i++) if (p >= v[i][0]) { const a = v[i - 1][1], b = v[i][1]; r = { p: v[i][0], k: a[0] !== b[0] ? 0 : 1 }; } return r; }
function isSeq2(v) { return Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && v[0].length === 2 && Array.isArray(v[0][1]); }
function valAt(v, p) { if (v == null) return null; if (Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && v[0].length === 2 && typeof v[0][1] !== 'number') { let r = v[0][1]; for (const [pp, val] of v) if (p >= pp) r = val; return r; } return v; }
function fireworks2d(t) { for (let b = 0; b < 5; b++) { const per = 1.4, age = (t + b * 0.31) % per; const cx = 160 + b * 190, cy = 300 + (b % 2) * 160; const col = [RED, GOLD, '#3c8fc4', '#fff', '#2c8f45'][b]; for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, r = age * 160; g.fillStyle = col; g.globalAlpha = Math.max(0, 1 - age / per); circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r + age * age * 40, 7); g.fill(); } } g.globalAlpha = 1; }
function pitchScene(o, p, lt, t) {
  bField(t, o);
  const tP = o.tPitch ?? 0.35, tH = tP + 0.12; const off = o.off ?? 0, def = 1 - off;
  const wind = seg(p, tP - 0.2, tP); golfer(MOUND[0], MOUND[1] + 10, 0.36, bPose(def, { rA1: lerp(0.3, -2.8, wind) * (p < tP + 0.05 ? 1 : 0.3), rA2: -0.4, lA1: -0.6 + wind * 0.4, legL: wind * 0.5, head: 0 }), t);
  // ball
  const outcome = o.out || 'hr';
  if (p > tP && p < tH) { const q = seg(p, tP, tH); const bx = lerp(MOUND[0] + 20, HOME[0] - 10, q), by = lerp(MOUND[1] - 110, HOME[1] - 170, q), r = lerp(8, 18, q); circle(bx, by, r); inked('#fff', 4); }
  if (outcome === 'hr' && p >= tH) { const q = seg(p, tH, Math.min(1, tH + 0.35)); const bx = lerp(HOME[0], o.dir === 'left' ? 120 : o.dir === 'right' ? 960 : 540, q), by = lerp(HOME[1] - 170, 520, q) - Math.sin(q * Math.PI) * 300, r = lerp(18, 6, q);
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 8; g.setLineDash([4, 14]); g.beginPath(); for (let k = 0; k <= q; k += 0.04) { const x = lerp(HOME[0], o.dir === 'left' ? 120 : o.dir === 'right' ? 960 : 540, k), y = lerp(HOME[1] - 170, 520, k) - Math.sin(k * Math.PI) * 300; k === 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.setLineDash([]);
    if (q < 1) { circle(bx, by, r); inked('#fff', 4); } else fireworks2d(lt); }
  if (outcome === 'k' && p > tH && p < tH + 0.2) { circle(HOME[0] - 10, HOME[1] - 150, 18); inked('#fff', 4); }
  // batter
  const sw = seg(p, tH - 0.05, tH + 0.08);
  const batPose = p < tH - 0.05 ? { rA1: 0.9, rA2: -0.4, lA1: 0.4, lA2: -0.6, club: -2.4, bat: true } : Object.assign(swingPose(lerp(0.6, 1, sw)), { bat: true });
  if (o.limp && p > tH + 0.3) batPose.head = 0.2;
  golfer(HOME[0] - 140, HOME[1] + 40, 0.7, bPose(off, Object.assign(batPose, { cap: bTeam(off).cap })), t);
  bScore(p, o);
  if (o.stamp) stamp(o.stamp, (p - (o.stampAt ?? tH + 0.1)) * 3, o.stampCol || RED, 880);
}
SC.bPitch = (o, p, lt, t) => pitchScene(o, p, lt, t);
SC.bIntro = (o, p, lt, t) => { bField(t, o); golfer(MOUND[0], MOUND[1] + 10, 0.36, bPose(1, {}), t); golfer(HOME[0] - 140, HOME[1] + 40, 0.7, bPose(0, { rA1: 0.9, rA2: -0.4, lA1: 0.4, lA2: -0.6, club: -2.4, bat: true }), t);
  const k = back(clamp(p * 3)); g.save(); g.translate(540, 760); g.scale(k, k); rr(-430, -170, 860, 340, 40); inked(CREAM, 10); g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
  let fs = 70; g.font = `bold ${fs}px DejaVu Sans`; while (g.measureText(CFG.event).width > 790) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; } g.fillText(CFG.event, 0, -95);
  g.font = 'bold 120px DejaVu Sans'; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText(CFG.year, 0, 15); g.fillStyle = GOLD; g.fillText(CFG.year, 0, 15);
  g.fillStyle = INK; let f2 = 46; g.font = `bold ${f2}px DejaVu Sans`; const vs = CFG.sub || `${bTeam(0).name}  vs  ${bTeam(1).name}`; while (g.measureText(vs).width > 800) { f2 -= 2; g.font = `bold ${f2}px DejaVu Sans`; } g.fillText(vs, 0, 120); g.restore(); };
SC.bStat = (o, p, lt, t) => { bField(t, o); golfer(HOME[0] - 140, HOME[1] + 40, 0.7, bPose(o.who ?? 0, Object.assign({ rA1: 0.9, rA2: -0.4, lA1: 0.4, lA2: -0.6, club: -2.4, bat: true }, o.pose ? POSE[o.pose](t) : {}, o.pose ? { club: undefined, bat: false } : {})), t); if (o.score) bScore(p, o); card(o.label, o.value, p - 0.08, o.score ? 960 : 820, o.col || GOLD); if (o.stamp) stamp(o.stamp, (p - 0.5) * 3, RED, 1240); };
SC.bRun = (o, p, lt, t) => { bField(t, o); const path = [HOME, B1, B2, B3, HOME]; const q = clamp(p * 1.1) * 4; const i = Math.min(3, Math.floor(q)), f = q - i; const a = path[i], b = path[i + 1];
  const x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f); const sc = lerp(0.42, 0.62, (y - 1180) / 510);
  golfer(x, y + 20, sc, bPose(o.off ?? 0, { rA1: 2.6 + Math.sin(t * 9) * 0.3, lA1: -0.4 - Math.sin(t * 9) * 0.6, legL: Math.sin(t * (o.limp ? 7 : 12)) * (o.limp ? 0.25 : 0.5), legR: -Math.sin(t * (o.limp ? 7 : 12)) * (o.limp ? 0.25 : 0.5) }), t);
  if (o.fireworks) fireworks2d(lt); bScore(p, o); if (o.stamp) stamp(o.stamp, (p - 0.3) * 3, RED, 880); };
SC.bWin = (o, p, lt, t) => { bField(t, o); const w = o.w ?? 0; for (let k = 0; k < 5; k++) golfer(200 + k * 170, 1600 + (k % 2) * 60, 0.55, bPose(w, POSE.cheer(t + k * 0.3)), t + k);
  if (o.trophy !== false) trophy2d(540, 1180 - Math.abs(Math.sin(t * 6)) * 30, 0.6); confetti2d(t, p); if (o.score) bScore(1, o); if (o.value) card(o.label, o.value, p - 0.25, 960); };
SC.bCta = (o, p, lt, t) => { bField(t, o); golfer(HOME[0] - 140, HOME[1] + 40, 0.7, bPose(0, POSE.thumbs(t)), t);
  (o.opts || ['SÍ', 'NO']).forEach((txt, i) => { const k = back(clamp(p * 4 - i * 0.5)); if (k <= 0) return; g.save(); g.translate(540, 680 + i * 170); g.scale(k, k); rr(-360, -65, 720, 130, 40); inked(i ? '#3c8fc4' : RED, 8); g.fillStyle = '#fff'; g.font = 'bold 60px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 4); g.restore(); });
  const k = back(clamp((p - 0.35) * 3)); g.save(); g.translate(540, 1060); g.scale(k, k); rr(-250, -60, 500, 120, 60); inked(GOLD, 8); g.fillStyle = INK; g.font = 'bold 56px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COMENTA ↓', 0, 4); g.restore(); };

window.renderAt = function (t) {
  const shots = CFG.shots; let si = 0; for (let k = 0; k < shots.length; k++) if (t >= shots[k]._t0) si = k;
  const sh = shots[si]; const D = sh._t1 - sh._t0, lt = t - sh._t0, p = clamp(lt / D);
  const cov = CFG.cover && t < 0.7 && si === 0; g.save(); SC[sh.type](sh, cov ? 0.6 : p, cov ? 3 : lt, t); g.restore();
  if (CFG.cover && t < 0.7) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 160, W, 520); bigText(CFG.cover.split('\n').map(l => `|${l}|`), 330, 130, 1, { hl: GOLD }); } else caption(t);
  // grain + vignette
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(60,40,10,0.25)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const fl = clamp(1 - lt / 0.15); if (si > 0 && fl > 0) { g.fillStyle = `rgba(255,250,235,${fl * 0.8})`; g.fillRect(0, 0, W, H); }
  
  g.save(); g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = 'rgba(34,48,31,0.6)'; g.fillText(CFG.tag || 'GOLF EXPLICADO', W / 2, 140); g.restore();
  return cv.toDataURL('image/jpeg', 0.92);
};
window.initEngine = async function (cfg) {
  CFG = cfg; cv = document.createElement('canvas'); cv.width = W; cv.height = H; g = cv.getContext('2d'); document.body.appendChild(cv);
  CFG.shots.forEach((s, k) => { s._t0 = k === 0 ? 0 : CFG.segs[k].start - 0.15; });
  CFG.shots.forEach((s, k) => { s._t1 = k < CFG.shots.length - 1 ? CFG.shots[k + 1]._t0 : CFG.total; });
  await document.fonts.ready; return true;
};
window.CONFIGS = {
  dad: { tag: '¿EL DEPORTE MÁS DIFÍCIL?', dad: true, shots: [
    { type: 'dadIntro' }, { type: 'dadGolf' }, { type: 'dadRate', bg: 'golf', fail: 'golf', label: 'GOLF', val: 8, col: '#3c8fc4', mAt: 0.5 },
    { type: 'dadSoccer' }, { type: 'dadRate', bg: 'soccer', fail: 'soccer', label: 'FÚTBOL', val: 6, col: '#2c8f45' },
    { type: 'dadF1' }, { type: 'dadRate', bg: 'track', fail: 'f1', label: 'FÓRMULA 1', val: 9, col: '#d8322b' },
    { type: 'dadBaseball' }, { type: 'dadRate', bg: 'baseball', fail: 'baseball', label: 'BÉISBOL', val: 10, col: '#c94f4f', mAt: 0.25 },
    { type: 'dadCta' }] },
  g2d: { tag: 'GOLF EXPLICADO', shots: [
    { type: 'hook' }, { type: 'par' }, { type: 'map' },
    { type: 'row', row: 0, pose: 'sad' }, { type: 'row', row: 1, pose: 'thumbs' }, { type: 'row', row: 2, pose: 'point', bird: 'birdie', bs: 0.6 },
    { type: 'row', row: 3, pose: 'point', bird: 'eagle', bs: 0.75 }, { type: 'row', row: 4, pose: 'wow', bird: 'albatross', bs: 0.7 },
    { type: 'condor' }, { type: 'rare' }, { type: 'cta' }] },
};
window.ready = true;
