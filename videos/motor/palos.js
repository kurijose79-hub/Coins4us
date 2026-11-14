// Palos desaparecidos (h02) y hándicap (h03) — 2dbuena
function oldBag(x, y, s, n, t) { g.save(); g.translate(x, y); g.scale(s, s);
  for (let i = 0; i < n; i++) { const a = -0.5 + i / Math.max(1, n - 1); const len = 420 + hash(i) * 120; const ex = Math.sin(a) * len * 0.55, ey = -Math.cos(a) * len; g.strokeStyle = INK; g.lineWidth = 14; g.beginPath(); g.moveTo(0, -300); g.lineTo(ex, ey - 200); g.stroke(); g.strokeStyle = i % 3 ? '#9a6a3a' : '#bfc5cc'; g.lineWidth = 6; g.stroke(); rr(ex - 22, ey - 222, 44, 26, 8); inked(i % 4 === 0 ? '#8a4b2a' : '#9aa2ab', 4); }
  rr(-90, -360, 180, 360, 34); inked('#7a5a3a', 8); rr(-60, -250, 120, 70, 12); inked('#c9b48a', 5); g.restore(); }
SC.pBag = (o, p, lt, t) => {
  background(t, { flagNum: '14' }); const n = o.n || 8; const k = back(clamp(p * 3));
  oldBag(o.bx || 560, 1700, (o.bs || 0.9) * k, n, t);
  if (o.beto) person(BETO, 260, 1760, 0.6, o.heavy ? { rA1: 0.9, rA2: -0.2, lA1: -0.3, lean: 0.12, face: 'sad', head: 0.15 } : POSE.wow(t), t);
  if (o.value) card(o.label, o.value, seg(p, 0.15, 1), 720, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.5, 1), o.scol || RED, 1020);
  if (o.q) { g.save(); g.font = 'bold 150px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 16; g.strokeStyle = INK; g.fillStyle = GOLD; for (const [x, y] of [[170, 1150], [900, 1120]]) { g.strokeText('?', x, y + Math.sin(t * 3 + x) * 14); g.fillText('?', x, y + Math.sin(t * 3 + x) * 14); } g.restore(); }
};
SC.pHickory = (o, p, lt, t) => {
  background(t, { noFlag: true });
  const bend = o.steel ? 0 : Math.sin(t * 5) * 70 * clamp(p * 2);
  const draw = (x, col, b, lb) => { g.save(); g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 30; g.beginPath(); g.moveTo(x, 760); g.quadraticCurveTo(x + b, 1200, x, 1640); g.stroke(); g.strokeStyle = col; g.lineWidth = 16; g.stroke(); g.translate(x, 1640); rr(-10, -20, 110, 50, 12); inked('#9aa2ab', 6); g.restore();
    g.save(); g.font = 'bold 48px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = INK; g.strokeText(lb, x + 40, 1760); g.fillStyle = '#fff'; g.fillText(lb, x + 40, 1760); g.restore(); };
  if (o.steel) { draw(330, '#9a6a3a', Math.sin(t * 5) * 70, 'NOGAL'); draw(760, '#d5dbe1', 0, 'ACERO'); }
  else { draw(540, '#9a6a3a', bend, 'NOGAL'); for (let i = 0; i < 16; i++) { const a = (t * 0.8 + hash(i)) % 1; const x = hash(i * 3) * W, y = 600 + a * 1300; g.fillStyle = 'rgba(95,180,230,0.8)'; g.beginPath(); g.moveTo(x, y - 18); g.quadraticCurveTo(x + 12, y + 4, x, y + 10); g.quadraticCurveTo(x - 12, y + 4, x, y - 18); g.fill(); } }
  card(o.label, o.value, seg(p, 0.2, 1), 600, o.col || GOLD);
};
SC.pScale = (o, p, lt, t) => {
  background(t, { noFlag: true });
  const x0 = 120, x1 = 960, y = 1250, v2x = v => lerp(x0, x1, (v + 5) / 59);
  rr(x0 - 20, y - 40, x1 - x0 + 40, 80, 40); const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, '#2c8f45'); gr.addColorStop(0.5, GOLD); gr.addColorStop(1, RED); g.fillStyle = gr; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  [[-4, '+4', 'LOS MEJORES'], [14, '14', 'BETO'], [54, '54', 'PRINCIPIANTE']].forEach(([v, lb, who], i) => { const a = back(clamp((p - 0.1 - i * 0.18) * 4)); if (a <= 0) return; const x = v2x(v); g.save(); g.translate(x, y); g.scale(a, a); g.beginPath(); g.moveTo(0, -50); g.lineTo(-30, -110); g.lineTo(30, -110); g.closePath(); inked('#fff', 6); g.font = 'bold 64px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = INK; g.strokeText(lb, 0, -140); g.fillStyle = '#fff'; g.fillText(lb, 0, -140); g.font = 'bold 36px DejaVu Sans'; g.lineWidth = 9; g.strokeText(who, 0, 120); g.fillText(who, 0, 120); g.restore(); });
  g.save(); g.font = 'bold 44px DejaVu Sans'; g.fillStyle = INK; g.textAlign = 'left'; g.fillText('← MEJOR', x0, 1460); g.textAlign = 'right'; g.fillText('PRINCIPIANTE →', x1, 1460); g.restore();
  person(BETO, v2x(14) + 10, 1840, 0.42, POSE.point(t), t);
  card(o.label, o.value, seg(p, 0.05, 1), 700, o.col || GOLD);
};
SC.pVersus = (o, p, lt, t) => {
  background(t, { flagNum: '1' });
  person(BETO, 280, 1720, 0.7, POSE.thumbs(t), t); person({ shirt: '#22301f', pants: '#d9d9d9', cap: '#22301f', capLogo: GOLD, skin: '#c98d62' }, 800, 1720, 0.7, POSE.idle(t), t);
  g.save(); g.font = 'bold 120px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 16; g.strokeStyle = INK; g.fillStyle = RED; g.strokeText('VS', 540, 1250); g.fillText('VS', 540, 1250); g.restore();
  if (o.hcp) { [[280, 'HCP 14'], [800, 'HCP 4']].forEach(([x, lb]) => { g.save(); g.font = 'bold 52px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = INK; g.strokeText(lb, x, 1820); g.fillStyle = '#fff'; g.fillText(lb, x, 1820); g.restore(); }); }
  if (o.items) board(o.title, o.items, p, 760, o); else card(o.label, o.value, seg(p, 0.1, 1), 720, o.col || GOLD);
};
SC.pCards = (o, p, lt, t) => {
  background(t, { noFlag: true }); g.fillStyle = 'rgba(247,239,216,0.6)'; g.fillRect(0, 560, W, 1360);
  const scores = [92, 88, 95, 86, 90, 87, 93, 89, 91, 86, 94, 88, 90, 85, 92, 89, 87, 96, 88, 90];
  const best = scores.map((s, i) => [s, i]).sort((a, b) => a[0] - b[0]).slice(0, 8).map(x => x[1]);
  scores.forEach((s, i) => { const a = back(clamp((p - i * 0.025) * 5)); if (a <= 0) return; const x = 150 + (i % 5) * 195, y = 1000 + Math.floor(i / 5) * 200; const hl = o.best && best.includes(i) && p > 0.35; g.save(); g.translate(x, y); g.scale(a, a); g.rotate((hash(i) - 0.5) * 0.12); rr(-80, -80, 160, 160, 16); inked(hl ? GOLD : '#fff', 6); g.fillStyle = INK; g.font = 'bold 60px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(s), 0, 6); g.restore(); if (o.best && !hl && p > 0.35) { g.save(); g.globalAlpha = 0.5; g.fillStyle = '#ffffff'; rr(x - 82, y - 82, 164, 164, 16); g.fill(); g.restore(); } });
  card(o.label, o.value, seg(p, 0.05, 1), 700, o.col || GOLD);
};
SC.pClub = (o, p, lt, t) => {
  background(t, { flagNum: '1' });
  g.save(); g.translate(540, 1500); rr(-380, -420, 760, 420, 20); inked('#f7efd8', 8); g.beginPath(); g.moveTo(-430, -420); g.lineTo(0, -620); g.lineTo(430, -420); g.closePath(); inked('#2c8f45', 8); rr(-80, -220, 160, 220, 12); inked('#8a5a3a', 6); for (const x of [-260, 180]) { rr(x, -330, 90, 90, 8); inked('#bfe3f5', 6); } g.fillStyle = INK; g.font = 'bold 54px DejaVu Sans'; g.textAlign = 'center'; g.fillText('CLUB DE GOLF', 0, -360); g.restore();
  person(BETO, 820, 1760, 0.55, POSE.point(t), t);
  card(o.label, o.value, seg(p, 0.1, 1), 700, o.col || GOLD);
};
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  h02: { tag: 'GOLF EXPLICADO', shots: [
    { type: 'pBag', q: true, n: 9, label: 'PALOS QUE', value: 'DESAPARECIERON' },
    { type: 'pHickory', label: 'HASTA LOS AÑOS 20', value: 'VARILLAS DE NOGAL', col: '#c9a06a' },
    { type: 'pHickory', steel: true, label: 'LLEGÓ EL', value: 'ACERO', col: '#d5dbe1' },
    { type: 'aBeto', bg: 'club', pose: 'point', title: 'NOMBRES ANTIGUOS', items: ['MASHIE ≈ FIERRO 5', 'NIBLICK ≈ FIERRO 9'], cols: [AG, AG] },
    { type: 'hLoft', k1: 'wood', k2: 'wood', l1: 11, l2: 11, c1: '#8a4b2a', c2: '#8a4b2a', n1: 'CAQUI', n2: '', label: 'DRIVERS DE', value: 'MADERA DE CAQUI', col: '#c9a06a' },
    { type: 'hLoft', k1: 'wood', k2: 'wood', l1: 11, l2: 10, c1: '#8a4b2a', c2: '#9aa2ab', n1: 'MADERA', n2: 'TITANIO', label: 'DESDE LOS 80', value: 'METAL', col: '#d5dbe1' },
    { type: 'hLoft', k1: 'iron', k2: 'hybrid', l1: 17, l2: 19, n1: 'FIERRO 1 Y 2', n2: 'HÍBRIDO', label: 'LOS REEMPLAZÓ EL', value: 'HÍBRIDO' },
    { type: 'pBag', beto: true, heavy: true, n: 24, bs: 0.95, bx: 640, label: 'ALGUNOS CARGABAN', value: '+20 PALOS', col: RED },
    { type: 'pBag', n: 14, label: 'DESDE 1938 · MÁXIMO', value: '14 PALOS', stamp: 'REGLA', scol: AG },
    { type: 'hCta', q: '¿CUÁL PROBARÍAS?', opts: ['EL DE MADERA', 'EL FIERRO 1'] }] },
  h03: { tag: 'GOLF EXPLICADO', shots: [
    { type: 'aBeto', bg: 'club', pose: 'open', label: '¿QUÉ ES EL', value: 'HÁNDICAP?' },
    { type: 'pScale', label: 'MIENTRAS MÁS BAJO', value: 'MEJOR' },
    { type: 'pVersus', label: 'PARA COMPETIR', value: 'PAREJO' },
    { type: 'pVersus', hcp: true, label: '14 − 4 =', value: '10 GOLPES DE VENTAJA', col: '#5fb4e6' },
    { type: 'pCards', label: 'TUS ÚLTIMAS', value: '20 TARJETAS' },
    { type: 'pCards', best: true, label: 'LAS 8 MEJORES + AJUSTE', value: 'PROMEDIO' },
    { type: 'pClub', label: 'PARA TENERLO OFICIAL', value: 'CLUB O FEDERACIÓN', col: '#2c8f45' },
    { type: 'aBeto', bg: 'club', pose: 'point', title: 'TRUCO RÁPIDO', items: ['TU MEJOR RONDA: 86', 'MENOS EL PAR: 72', '≈ HÁNDICAP 14'], cols: [INK, INK, RED], gap: 0.18 },
    { type: 'aNext', label: 'ESCRÍBELO ABAJO', value: '¿TU HÁNDICAP?', btn: 'COMENTA ↓' }] },
});
