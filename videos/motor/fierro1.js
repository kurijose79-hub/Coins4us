// "¿Por qué desapareció el fierro 1?" — 2dbuena (usa golf2d.js + augusta2d.js)
function clubHead(x, y, s, loft, kind, o = {}) {
  const L = loft * Math.PI / 180; g.save(); g.translate(x, y); g.scale(s, s);
  const h = kind === 'iron' ? 150 : kind === 'hybrid' ? 120 : 110; const fx = -Math.sin(L) * h, fy = -Math.cos(L) * h;
  g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 26; g.beginPath(); g.moveTo(fx - 30, fy + 10); g.lineTo(fx - 50, -(o.shaft || 700)); g.stroke(); g.strokeStyle = '#bfc5cc'; g.lineWidth = 12; g.stroke();
  g.beginPath(); g.moveTo(0, 0);
  if (kind === 'iron') { g.lineTo(fx, fy); g.lineTo(fx - 38, fy + 8); g.lineTo(-60, -40); g.lineTo(-58, 0); }
  else { const bw = kind === 'hybrid' ? 170 : 270; g.lineTo(fx, fy); g.bezierCurveTo(fx - bw * 0.5, fy - 30, -bw - 20, -30, -bw, 0); }
  g.closePath(); inked(o.col || (kind === 'iron' ? '#cfd5db' : kind === 'hybrid' ? '#3a3f46' : '#2b2b2b'), 8);
  if (o.cg) { const cx = kind === 'iron' ? -20 : kind === 'hybrid' ? -80 : -120, cy = kind === 'iron' ? -80 : -30; circle(cx, cy, 20); inked(RED, 5); }
  if (o.angle) { g.setLineDash([12, 12]); g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -240); g.stroke(); g.setLineDash([]); g.strokeStyle = RED; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 200, -Math.PI / 2 - L, -Math.PI / 2); g.stroke();
    g.fillStyle = RED; g.font = 'bold 64px DejaVu Sans'; g.textAlign = 'center'; g.fillText(`${loft}°`, 70, -230); }
  g.restore();
  if (o.label) { g.save(); g.font = 'bold 50px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = INK; g.strokeText(o.label, x - 60 * s, y + 90); g.fillStyle = '#fff'; g.fillText(o.label, x - 60 * s, y + 90); g.restore(); }
}
function storm(t, flashOn) {
  const gr = g.createLinearGradient(0, 0, 0, 1200); gr.addColorStop(0, '#2c3440'); gr.addColorStop(1, '#56606d'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(30,34,40,0.8)'; for (const [dx, dy, r] of [[0, 0, 90], [90, -30, 110], [190, 0, 80]]) { circle(i * 250 - 80 + dx + Math.sin(t * 0.5 + i) * 20, 520 + (i % 2) * 70 + dy, r); g.fill(); } }
  g.fillStyle = '#4f7a45'; g.fillRect(0, 1110, W, H - 1110); for (let i = 0; i < 10; i++) pine(30 + i * 115, 1105, 0.8);
  g.strokeStyle = 'rgba(200,220,255,0.55)'; g.lineWidth = 3; for (let i = 0; i < 90; i++) { const x = (hash(i) * 1200 + t * 300) % 1200 - 60, y = (hash(i * 7) * 2000 + t * 1700) % 2000; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y + 50); g.stroke(); }
  if (flashOn) { g.fillStyle = 'rgba(255,255,240,0.55)'; g.fillRect(0, 0, W, H); g.strokeStyle = '#fffbe0'; g.lineWidth = 16; g.lineJoin = 'miter'; g.beginPath(); g.moveTo(640, 560); g.lineTo(580, 760); g.lineTo(650, 780); g.lineTo(560, 1000); g.lineTo(610, 1010); g.lineTo(560, 1130); g.stroke(); }
}
SC.hStorm = (o, p, lt, t) => {
  const fl = ((t * 0.9) % 1.6) < 0.12 || (o.strike && p > 0.4 && p < 0.5);
  storm(t, fl);
  person(BETO, 540, 1720, 0.8, { rA1: 2.95, rA2: 0, lA1: -2.95, lA2: 0, club: Math.PI, face: o.strike && p > 0.4 ? 'wow' : undefined, jump: o.strike && p > 0.4 && p < 0.55 ? -40 : 0 }, t);
  if (o.value) card(o.label, o.value, seg(p, 0.1, 1), 640, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.45, 1), o.scol || RED, 1500);
};
SC.hHook = (o, p, lt, t) => {
  background(t, { flagNum: '1' });
  const k = back(clamp(p * 3)); clubHead(760, 1560, 1.5 * k, 17, 'iron', { shaft: 420, label: k > 0.9 ? 'FIERRO 1' : '' });
  person(BETO, 280, 1760, 0.62, POSE.wow(t), t);
  if (o.value) card(o.label, o.value, seg(p, 0.15, 1), 720, o.col || RED);
};
SC.hLoft = (o, p, lt, t) => {
  background(t, { noFlag: true }); g.fillStyle = 'rgba(247,239,216,0.6)'; g.fillRect(0, 560, W, 1360);
  const a = back(clamp(p * 3)), b = back(clamp((p - 0.25) * 3));
  if (a > 0) clubHead(360, 1640, 1.6 * a, o.l1 ?? 17, o.k1 || 'iron', { angle: o.angle, cg: o.cg, label: o.n1, shaft: 380, col: o.c1 });
  if (b > 0) clubHead(860, 1640, 1.6 * b, o.l2 ?? 15, o.k2 || 'wood', { angle: o.angle, cg: o.cg, label: o.n2, shaft: 380, col: o.c2 });
  if (o.value) card(o.label, o.value, seg(p, 0.45, 1), 700, o.col || GOLD);
  if (o.cg && p > 0.5) { g.save(); g.font = 'bold 44px DejaVu Sans'; g.fillStyle = RED; g.textAlign = 'center'; g.fillText('● = DONDE ESTÁ EL PESO', 540, 1820); g.restore(); }
};
SC.hFace = (o, p, lt, t) => {
  background(t, { noFlag: true });
  g.save(); g.translate(540, 1150); g.rotate(-0.08); g.beginPath(); g.moveTo(-330, 120); g.lineTo(-300, -110); g.quadraticCurveTo(-120, -170, 330, -150); g.lineTo(350, 110); g.quadraticCurveTo(0, 160, -330, 120); g.closePath(); inked('#d5dbe1', 10);
  g.strokeStyle = 'rgba(80,90,100,0.45)'; g.lineWidth = 6; for (let i = 0; i < 7; i++) { const y = -95 + i * 30; g.beginPath(); g.moveTo(-250, y + 8); g.lineTo(260, y - 6); g.stroke(); }
  g.strokeStyle = INK; g.lineWidth = 26; g.beginPath(); g.moveTo(-300, -100); g.lineTo(-420, -700); g.stroke(); g.strokeStyle = '#bfc5cc'; g.lineWidth = 12; g.stroke();
  const pu = 1 + Math.sin(t * 8) * 0.1; circle(20, 0, 26 * pu); inked(GOLD, 6);
  [[-160, 40], [170, -60], [-60, -80], [210, 60]].forEach(([x, y], i) => { const a = clamp((p - 0.2 - i * 0.1) * 6); if (a <= 0) return; g.globalAlpha = a; g.strokeStyle = RED; g.lineWidth = 12; g.beginPath(); g.moveTo(x - 24, y - 24); g.lineTo(x + 24, y + 24); g.moveTo(x + 24, y - 24); g.lineTo(x - 24, y + 24); g.stroke(); g.globalAlpha = 1; });
  g.restore();
  g.save(); g.font = 'bold 46px DejaVu Sans'; g.textAlign = 'center'; g.fillStyle = INK; g.fillText('PUNTO DULCE', 560, 1330); g.restore();
  const q = seg(p, 0.5, 1); if (q > 0) { const x = lerp(120, 980, q), y = 1700 - Math.abs(Math.sin(q * 9)) * 40 * (1 - q); lightBall(x, y, 16); }
  if (o.stamp) stampB(o.stamp, seg(p, 0.55, 1), RED, 760);
};
SC.hHogan = (o, p, lt, t) => {
  background(t, { flagNum: '18' }); gallery(t);
  person({ shirt: '#e8e2d2', pants: '#6a6a6a', cap: '#9a9a9a', capLogo: '#9a9a9a' }, 460, 1720, 0.78, swingPose(clamp(0.75 + p * 0.5)), t);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(190,150,100,0.55)'; g.fillRect(0, 0, W, H); g.restore();
  g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = 'rgba(128,128,128,0.9)'; g.fillRect(0, 0, W, H); g.restore();
  card(o.label, o.value, seg(p, 0.15, 1), 760, '#e8d9a8');
};
SC.hFlight = (o, p, lt, t) => {
  background(t, { noFlag: true });
  const paths = [['FIERRO 1', '#ffffff', 240, 0.05], ['HÍBRIDO', RED, 560, 0.25]];
  paths.forEach(([lb, col, hgt, d0], i) => { const q = easeOut(seg(p, d0, d0 + 0.5)); g.save(); g.setLineDash([14, 12]); g.strokeStyle = col; g.lineWidth = 8; g.beginPath(); for (let k = 0; k <= 40; k++) { const e = q * k / 40; const x = lerp(120, 960, e), y = 1700 - Math.sin(e * Math.PI) * hgt; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
    if (q > 0) { const x = lerp(120, 960, q), y = 1700 - Math.sin(q * Math.PI) * hgt; lightBall(x, y, 16); g.save(); g.font = 'bold 48px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = INK; g.strokeText(lb, 540, 1700 - hgt - 40); g.fillStyle = col; g.fillText(lb, 540, 1700 - hgt - 40); g.restore(); } });
  clubHead(860, 1150, 0.9, 19, 'hybrid', { cg: true, shaft: 300 });
  if (o.value) card(o.label, o.value, seg(p, 0.4, 1), 700, o.col || GOLD);
};
SC.hMuseum = (o, p, lt, t) => {
  g.fillStyle = '#e9dfcf'; g.fillRect(0, 0, W, H); g.fillStyle = '#c9b48a'; g.fillRect(0, 1500, W, H - 1500);
  for (const x of [100, 980]) { rr(x - 40, 500, 80, 1000, 10); inked('#f4ede0', 6); }
  rr(330, 1300, 420, 220, 10); inked('#8a5a3a', 8);
  g.save(); g.globalAlpha = 0.9; rr(300, 620, 480, 690, 16); g.fillStyle = 'rgba(200,230,245,0.35)'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.restore();
  g.save(); g.translate(540, 980); g.rotate(-0.35); g.translate(-540, -980); clubHead(600, 1230, 0.85, 17, 'iron', {}); g.restore();
  g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 10; g.beginPath(); g.moveTo(340, 700); g.lineTo(420, 640); g.moveTo(340, 780); g.lineTo(480, 660); g.stroke();
  rr(370, 1350, 340, 110, 10); inked(GOLD, 6); g.fillStyle = INK; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FIERRO 1', 540, 1385); g.font = 'bold 28px DejaVu Sans'; g.fillText('DESCANSE EN PAZ', 540, 1428);
  person(BETO, 880, 1800, 0.6, POSE.point(t), t);
  if (o.stamp) stampB(o.stamp, seg(p, 0.4, 1), o.scol || AG, 560);
};
SC.hCta = (o, p, lt, t) => {
  background(t, { flagNum: '1' }); person(BETO, 540, 1780, 0.6, POSE.thumbs(t), t);
  card(null, o.q, p, 640, GOLD);
  (o.opts).forEach((txt, i) => { const k = back(clamp(p * 4 - 0.6 - i * 0.5)); if (k <= 0) return; g.save(); g.translate(540, 900 + i * 170); g.scale(k, k); rr(-360, -65, 720, 130, 40); inked(i ? '#3c8fc4' : RED, 8); g.fillStyle = '#fff'; g.font = 'bold 56px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 4); g.restore(); });
};
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  h01: { tag: 'GOLF EXPLICADO', shots: [
    { type: 'hHook', label: '¿DÓNDE QUEDÓ EL…', value: 'FIERRO 1?' },
    { type: 'hStorm', label: 'LEE TREVINO', value: '"NI DIOS LE PEGA"' },
    { type: 'hStorm', strike: true, label: 'TORNEO DE 1975', value: '¡UN RAYO!', col: '#f5d020', stamp: '¡ZAS!' },
    { type: 'hLoft', angle: true, n1: 'FIERRO 1', n2: 'MADERA 3', l1: 17, l2: 15, label: 'CASI NO TIENE', value: 'INCLINACIÓN' },
    { type: 'hFace', stamp: 'SI FALLAS… ROLA' },
    { type: 'hHogan', label: 'BEN HOGAN · US OPEN', value: '1950' },
    { type: 'hFlight', label: 'LLEGÓ EL', value: 'HÍBRIDO' },
    { type: 'hMuseum', stamp: 'MÁS FÁCIL · AL MUSEO' },
    { type: 'aBeto', bg: 'club', pose: 'point', title: 'INCLINACIÓN', items: ['FIERRO 7 DE HOY: ~29°', 'FIERRO 5 DE ANTES: ~28°'], cols: [RED, INK] },
    { type: 'hCta', q: '¿TIENES UN FIERRO 1?', opts: ['SÍ, Y LE PEGO', 'NI LOCO'] }] },
});
