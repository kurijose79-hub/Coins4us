// Reel de respuesta: Tiger llevó al golf a otro nivel (2dbuena)
const TG = { shirt: '#c8102e', pants: '#1c1c1c', cap: '#1c1c1c', capLogo: '#ffffff', skin: '#7a4b2e' };
SC.tg = (o, p, lt, t) => {
  if (o.bg === 'club') background(t, { flagNum: '18' }); else augBg(t, o);
  if (o.crowd) gallery(t);
  if (o.trophy) trophy2d(820, 1560 - Math.abs(Math.sin(t * 3)) * 20, 0.9);
  const pose = o.pose === 'flex' ? { rA1: 1.6, rA2: 1.6, lA1: -1.6, lA2: -1.6, head: Math.sin(t * 3) * 0.05 } : POSE[o.pose || 'cheer'](t);
  person(TG, o.trophy ? 400 : o.bars ? 760 : 540, 1720, 0.78, pose, t);
  if (o.gym) { const y = 1200 + Math.sin(t * 4) * 30; g.save(); g.strokeStyle = INK; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(300, y); g.lineTo(780, y); g.stroke(); for (const x of [300, 780]) { rr(x - 30, y - 80, 60, 160, 14); inked('#59616b', 6); } g.restore(); }
  if (o.bars) { [[0.25, '1996'], [1, 'HOY']].forEach(([h, lb], i) => { const q = easeOut(seg(p, 0.15 + i * 0.15, 0.6 + i * 0.15)); const x = 170 + i * 200, H0 = 420 * h * q; rr(x, 1500 - H0, 130, Math.max(10, H0), 16); inked(i ? GOLD : '#9aa2ab', 6); g.save(); g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 9; g.strokeStyle = INK; g.fillStyle = '#fff'; g.strokeText(lb, x + 65, 1550); g.fillText(lb, x + 65, 1550); g.restore(); }); }
  if (o.confetti) confetti2d(t, p);
  if (o.items) board(o.title, o.items, p, o.cy || 820, o); else if (o.value) card(o.label, o.value, seg(p, 0.05, 1), o.cy || 760, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.5, 1), o.scol || RED, o.sy || 1080);
};
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  h04: { tag: 'GOLF EXPLICADO', shots: [
    { type: 'tg', crowd: true, pose: 'cheer', label: 'TIENES TODA LA RAZÓN', value: 'EL MEJOR' },
    { type: 'tg', crowd: true, pose: 'cheer', trophy: true, label: 'MASTERS 1997 · 21 AÑOS', value: '¡POR 12!', stamp: 'EL MÁS JOVEN', sy: 960 },
    { type: 'tg', pose: 'thumbs', title: 'TIGER SLAM', items: ['US OPEN 2000', 'OPEN BRITÁNICO 2000', 'PGA 2000', 'MASTERS 2001'], cols: [INK, INK, INK, AG], gap: 0.12 },
    { type: 'tg', bg: 'club', pose: 'point', bars: true, label: 'MÁS GENTE VIENDO GOLF', value: 'MÁS PREMIOS', cy: 720 },
    { type: 'tg', bg: 'club', pose: 'flex', gym: true, label: 'GOLFISTAS =', value: 'ATLETAS', col: RED, cy: 700 },
    { type: 'tg', pose: 'cheer', trophy: true, confetti: true, title: 'NÚMEROS DE LEYENDA', items: ['82 TORNEOS DEL PGA TOUR', '15 MAJORS', 'REGRESO: MASTERS 2019'], cols: [INK, AG, RED], gap: 0.15 },
    { type: 'hCta', q: '¿EL MEJOR DE LA HISTORIA?', opts: ['SÍ, TIGER', 'HAY OTRO'] }] },
});
