// "Cómo funciona": hoyuelos de golf, curva de béisbol, frenos de F1 — 2dbuena
function golfBall(x, y, r, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); circle(0, 0, r); inked('#fff', Math.max(3, r * 0.06)); g.save(); circle(0, 0, r); g.clip();
  for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const dx = (i + (j % 2) * 0.5) * r * 0.2, dy = j * r * 0.18; if (dx * dx + dy * dy > r * r * 0.95) continue; const sh = 1 - Math.hypot(dx, dy) / r; g.fillStyle = `rgba(150,160,170,${0.25 + 0.35 * sh})`; g.beginPath(); g.ellipse(dx, dy, r * 0.075 * (0.4 + sh), r * 0.07 * (0.4 + sh), 0, 0, Math.PI * 2); g.fill(); }
  g.restore(); g.restore(); }
function baseBall(x, y, r, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); circle(0, 0, r); inked('#fbf8f0', Math.max(3, r * 0.06)); g.strokeStyle = RED; g.lineWidth = Math.max(2, r * 0.05);
  for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * r * 1.25, 0, r * 0.95, sx > 0 ? Math.PI - 0.75 : -0.75, sx > 0 ? Math.PI + 0.75 : 0.75); g.stroke(); for (let k = -4; k <= 4; k++) { const a = (sx > 0 ? Math.PI : 0) + k * 0.16, cx = sx * r * 1.25 + Math.cos(a) * r * 0.95, cy = Math.sin(a) * r * 0.95; g.beginPath(); g.moveTo(cx - r * 0.07, cy - r * 0.05); g.lineTo(cx + r * 0.07, cy + r * 0.05); g.stroke(); } }
  g.restore(); }
function spinArrows(x, y, r, t, dir = 1) { g.save(); g.translate(x, y); g.rotate(t * 3 * dir); g.strokeStyle = GOLD; g.lineWidth = 12; g.lineCap = 'round'; for (let k = 0; k < 2; k++) { g.beginPath(); g.arc(0, 0, r, k * Math.PI, k * Math.PI + 1.9); g.stroke(); const a = k * Math.PI + 1.9; const ax = Math.cos(a) * r, ay = Math.sin(a) * r; g.save(); g.translate(ax, ay); g.rotate(a + Math.PI / 2); g.beginPath(); g.moveTo(-18, -14); g.lineTo(0, 10); g.lineTo(18, -14); g.stroke(); g.restore(); } g.restore(); }
function arrow(x0, y0, x1, y1, col, w = 16) { const a = Math.atan2(y1 - y0, x1 - x0); g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 - Math.cos(a) * w * 1.6, y1 - Math.sin(a) * w * 1.6); g.stroke(); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - Math.cos(a - 0.5) * w * 3, y1 - Math.sin(a - 0.5) * w * 3); g.lineTo(x1 - Math.cos(a + 0.5) * w * 3, y1 - Math.sin(a + 0.5) * w * 3); g.closePath(); g.fill(); g.restore(); }
function sky(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#bfe3f5'); gr.addColorStop(1, '#e8f4fb'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }

SC.cHook = (o, p, lt, t) => {
  if (o.bg === 'track') bgFor('track', t); else if (o.bg === 'baseball') bgFor('baseball', t); else background(t, { flagNum: '9' });
  const k = back(clamp(p * 2.5)); const r = 230 * k;
  if (o.ball === 'golf') golfBall(540, 1300, r, t * 0.6); else if (o.ball === 'base') baseBall(540, 1300, r, t * 0.8); else f1car(540, 1380 + Math.sin(t * 40) * 3, 1.0 * k, 0, t);
  if (o.ball !== 'f1' && k > 0.5) { g.save(); g.font = 'bold 160px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 16; g.strokeStyle = INK; g.fillStyle = GOLD; for (const [x, y] of [[180, 1050], [900, 1100], [860, 1600]]) { const yy = y + Math.sin(t * 3 + x) * 14; g.strokeText('?', x, yy); g.fillText('?', x, yy); } g.restore(); }
  card(o.label, o.value, seg(p, 0.1, 1), 720, o.col || GOLD);
};
SC.cFlow = (o, p, lt, t) => { // aire alrededor de una bola (vista lateral, la bola va a la izquierda)
  sky(t); const rows = o.compare ? [[o.compare[0], 1080], [o.compare[1], 1580]] : [[o.mode, 1200]];
  rows.forEach(([mode, cy], ri) => { const R = o.compare ? 120 : 170, cx = 430;
    const wake = mode === 'smooth' ? 1.0 : mode === 'dimple' ? 0.45 : 0.7;
    for (let i = 0; i < 9; i++) { const off = (i - 4) * R * 0.42; const ph = (t * 1.2 + i * 0.13) % 1; g.strokeStyle = 'rgba(60,143,196,0.75)'; g.lineWidth = 6; g.setLineDash([40, 26]); g.lineDashOffset = -t * 260; g.beginPath();
      for (let x = -40; x <= W + 40; x += 20) { const dx = x - cx; let y = cy + off; if (Math.abs(off) < R * 1.8) { const bump = Math.exp(-(dx * dx) / (R * R * 1.6)) * (R * 1.1 - Math.abs(off) * 0.4) * Math.sign(off || 1); y += dx < 0 ? bump : bump * (1 - wake) ; if (mode === 'magnus') y -= Math.exp(-(dx * dx) / (R * R * 3)) * 60 + (dx > 0 ? dx * 0.18 : 0); }
        x === -40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.setLineDash([]); }
    // estela turbulenta detrás de la bola
    const ww = R * (0.6 + wake * 1.4); for (let k = 0; k < 14; k++) { const a = (t * 2 + k * 0.37) % 1; const x = cx + R * 0.8 + a * 380 * (0.5 + wake), y = cy + (hash(k) - 0.5) * ww * (0.5 + a) + (mode === 'magnus' ? a * 120 : 0); g.save(); g.globalAlpha = 0.7 * (1 - a); g.strokeStyle = '#8a9aa8'; g.lineWidth = 5; g.beginPath(); g.arc(x, y, 14 + a * 26, t * 6 + k, t * 6 + k + 4.2); g.stroke(); g.restore(); }
    if (mode === 'magnus') { baseBall(cx, cy, R, -t * 9); spinArrows(cx, cy, R + 40, t, -1); arrow(cx, cy + R + 40, cx, cy + R + 230, RED, 18); arrow(cx + R + 120, cy - 40, cx + R + 260, cy - 170, '#3c8fc4', 14); }
    else if (mode === 'dimple') golfBall(cx, cy, R, t); else { circle(cx, cy, R); inked('#fff', 8); }
    if (o.compare) { g.save(); g.font = 'bold 54px DejaVu Sans'; g.textAlign = 'left'; g.lineWidth = 12; g.strokeStyle = INK; const lb = mode === 'smooth' ? 'LISA: MUCHA ESTELA' : 'HOYUELOS: POCA ESTELA'; g.strokeText(lb, 80, cy - R - 50); g.fillStyle = mode === 'smooth' ? '#fff' : GOLD; g.fillText(lb, 80, cy - R - 50); g.restore(); }
  });
  if (o.value) card(o.label, o.value, seg(p, 0.35, 1), o.cy || 640, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.5, 1), o.scol || RED, o.sy || 1700);
};
SC.cGolfFlight = (o, p, lt, t) => {
  background(t, { noFlag: true });
  const P = [['CON HOYUELOS', GOLD, 920, 520, 0.0], ['LISA', '#fff', 520, 300, 0.12]];
  P.forEach(([lb, col, dist, hgt, d0]) => { const q = easeOut(seg(p, d0, d0 + 0.55)); g.save(); g.setLineDash([16, 12]); g.strokeStyle = col; g.lineWidth = 8; g.beginPath(); for (let k = 0; k <= 40; k++) { const e = q * k / 40; const x = 90 + e * dist, y = 1720 - Math.sin(e * Math.PI) * hgt; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
    const x = 90 + q * dist, y = 1720 - Math.sin(q * Math.PI) * hgt; golfBall(x, y, 18, t * 8); if (q > 0.98) { g.save(); g.font = 'bold 46px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = INK; const ly = dist > 600 ? 1810 : 1650; g.strokeText(lb, Math.min(x, 820), ly); g.fillStyle = col; g.fillText(lb, Math.min(x, 820), ly); g.restore(); } });
  person(BETO, 120, 1760, 0.4, POSE.wow(t), t);
  card(o.label, o.value, seg(p, 0.5, 1), 720, o.col || GOLD);
};
SC.cSpin = (o, p, lt, t) => {
  if (o.bg === 'baseball') bgFor('baseball', t); else sky(t);
  const sp = o.fast ? 22 : 7; baseBall(540, 1250, 200, -t * sp); spinArrows(540, 1250, 260, t * (o.fast ? 3 : 1), -1);
  if (o.fast) { g.save(); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 6; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(540, 1250, 205 + k * 4, -t * sp + k, -t * sp + k + 1.2); g.stroke(); } g.restore(); }
  card(o.label, o.value, seg(p, 0.15, 1), 700, o.col || GOLD);
  if (o.hand) { g.save(); g.translate(540 + Math.sin(t * 2) * 10, 1560); circle(0, 0, 90); inked('#e2a87c', 8); for (let i = 0; i < 3; i++) { rr(-80 + i * 55, -170, 46, 120, 23); inked('#e2a87c', 6); } g.restore(); }
};
SC.cAtBat = (o, p, lt, t) => {
  bgFor('baseball', t);
  const q = seg(p, 0.08, 0.6); const x = lerp(120, 900, q), drop = Math.pow(q, 3) * 380, y = 1250 + Math.sin(q * Math.PI) * -60 + drop;
  g.save(); g.setLineDash([14, 12]); g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 7; g.beginPath(); for (let k = 0; k <= 30; k++) { const e = q * k / 30; const xx = lerp(120, 900, e), yy = 1250 + Math.sin(e * Math.PI) * -60 + Math.pow(e, 3) * 380; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore();
  g.save(); g.setLineDash([10, 16]); g.strokeStyle = 'rgba(216,50,43,0.6)'; g.lineWidth = 5; g.beginPath(); g.moveTo(120, 1250); g.lineTo(900, 1250); g.stroke(); g.restore();
  golfer(860, 1720, 0.62, p < 0.55 ? { rA1: 0.9, rA2: -0.4, lA1: 0.4, lA2: -0.6, club: -2.4, bat: true, cap: '#0c2340' } : Object.assign(swingPose(0.95), { bat: true, face: 'wow', cap: '#0c2340' }), t);
  if (q < 1) baseBall(x, y, 22, -t * 20);
  g.save(); g.font = 'bold 44px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 10; g.strokeStyle = INK; g.fillStyle = '#ffb3ae'; g.strokeText('LO QUE ESPERA', 520, 1215); g.fillText('LO QUE ESPERA', 520, 1215); g.restore();
  if (o.value) card(o.label, o.value, seg(p, 0.1, 1), 700, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.6, 1), RED, 1000);
};
SC.cDisc = (o, p, lt, t) => {
  g.fillStyle = '#1d2026'; g.fillRect(0, 0, W, H);
  const heat = clamp(seg(p, 0.05, 0.7)); const col = `rgb(${Math.round(lerp(90, 255, heat))},${Math.round(lerp(90, 120, heat) * (1 - heat * 0.4))},${Math.round(lerp(100, 30, heat))})`;
  g.save(); g.translate(540, 1250); g.rotate(t * 2 * (1 - heat * 0.8)); g.shadowColor = `rgba(255,120,30,${heat})`; g.shadowBlur = 90 * heat; circle(0, 0, 330); inked(col, 10); g.shadowBlur = 0;
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; for (const rr2 of [200, 270]) { circle(Math.cos(a + rr2) * rr2, Math.sin(a + rr2) * rr2, 12); g.fillStyle = '#1d2026'; g.fill(); } }
  circle(0, 0, 120); inked('#59616b', 8); g.restore();
  g.save(); g.translate(540, 1250); rr(150, -200, 190, 180, 30); inked('#d8322b', 8); g.restore();
  card(o.label, o.value, seg(p, 0.15, 1), 680, '#ff8a3d');
};
SC.cDown = (o, p, lt, t) => {
  bgFor('track', t); f1car(540, 1360 + Math.sin(t * 40) * 3, 1.0, 0, t);
  const a = clamp(seg(p, 0.1, 0.4)); for (const [x, y] of [[-230, 1250], [250, 1210], [0, 1240]]) for (let k = 0; k < 2; k++) { const yy = y - 320 + ((t * 300 + k * 160) % 320); g.save(); g.globalAlpha = a * 0.9; arrow(540 + x, yy - 120, 540 + x, yy, '#3c8fc4', 14); g.restore(); }
  card(o.label, o.value, seg(p, 0.2, 1), 720, o.col || '#5fb4e6');
};
SC.cG = (o, p, lt, t) => {
  bgFor('track', t);
  const decel = seg(p, 0.1, 0.5); const lean = Math.sin(Math.min(1, decel) * Math.PI / 2) * 0.35 * (1 + Math.sin(t * 30) * 0.05);
  person({ shirt: '#d8322b', pants: '#d8322b', cap: '#f2b632', capLogo: '#d8322b', skin: '#e2a87c' }, 540, 1720, 0.8, { rA1: 1.4, rA2: -1.2, lA1: -1.4, lA2: 1.2, lean: lean, head: lean * 0.6, face: decel > 0.3 ? 'wow' : undefined }, t);
  for (let k = 0; k < 5; k++) { g.save(); g.globalAlpha = decel * 0.8; arrow(220 + k * 10, 1050 + k * 70, 420 + k * 10 + decel * 120, 1050 + k * 70, RED, 12); g.restore(); }
  card(o.label, o.value, seg(p, 0.15, 1), 700, o.col || GOLD);
};
SC.cStop = (o, p, lt, t) => {
  background(t, { noFlag: true }); g.fillStyle = '#5b5f66'; g.fillRect(0, 1000, W, 900);
  const R = [['FÓRMULA 1', RED, 0.32], ['DEPORTIVO', '#3c8fc4', 0.62], ['AUTO NORMAL', '#9aa2ab', 0.95]];
  R.forEach(([lb, col, frac], i) => { const y = 1150 + i * 260; const q = easeOut(seg(p, 0.05 + i * 0.08, 0.55 + i * 0.08)); const len = 720 * frac * q;
    g.fillStyle = '#fff'; g.fillRect(90, y - 70, 8, 140); rr(100, y - 30, Math.max(10, len), 60, 20); inked(col, 6); g.save(); g.font = 'bold 46px DejaVu Sans'; g.textAlign = 'left'; g.lineWidth = 10; g.strokeStyle = INK; g.fillStyle = '#fff'; g.strokeText(lb, 110, y - 60); g.fillText(lb, 110, y - 60); g.restore();
    if (i === 0) f1car(100 + len + 90, y - 10, 0.32, 0, t * (1 - q)); else { rr(100 + len + 10, y - 50, 150, 70, 22); inked(col, 6); } });
  card(o.label, o.value, seg(p, 0.45, 1), 720, o.col || GOLD);
};
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  c01: { tag: 'CÓMO FUNCIONA', shots: [
    { type: 'cHook', ball: 'golf', label: '¿POR QUÉ TIENE…', value: 'HOYUELOS?' },
    { type: 'cHook', ball: 'golf', label: 'NO ES DECORACIÓN', value: 'ES FÍSICA', col: '#5fb4e6' },
    { type: 'cFlow', mode: 'dimple', label: 'AIRE PEGADITO A LA BOLA', value: 'TURBULENCIA' },
    { type: 'cFlow', compare: ['smooth', 'dimple'], label: 'MENOS ARRASTRE', value: 'MÁS LEJOS', cy: 700 },
    { type: 'cGolfFlight', label: 'UNA BOLA LISA LLEGA A', value: 'LA MITAD', col: RED },
    { type: 'hCta', q: '¿LO SABÍAS?', opts: ['SÍ, YA LO SABÍA', 'NO TENÍA IDEA'] }] },
  c02: { tag: 'CÓMO FUNCIONA', shots: [
    { type: 'cHook', ball: 'base', bg: 'baseball', label: '¿CÓMO SE LANZA UNA…', value: 'CURVA?' },
    { type: 'cSpin', hand: true, label: 'GIRO HACIA', value: 'ADELANTE' },
    { type: 'cSpin', fast: true, label: 'VUELTAS POR MINUTO', value: '+2,000', col: RED },
    { type: 'cFlow', mode: 'magnus', label: 'EL AIRE SUBE…', value: 'LA BOLA BAJA', col: RED },
    { type: 'cAtBat', stamp: '¡DESAPARECIÓ!' },
    { type: 'hCta', q: '¿PODRÍAS BATEARLA?', opts: ['SÍ, FÁCIL', 'NI DE CHISTE'] }] },
  c03: { tag: 'CÓMO FUNCIONA', shots: [
    { type: 'cHook', ball: 'f1', bg: 'track', label: '¿CÓMO FRENA UN…', value: 'FÓRMULA 1?', col: RED },
    { type: 'cDisc', label: 'FRENOS DE CARBONO', value: '+1,000 °C' },
    { type: 'cDown', label: 'LOS ALERONES', value: 'LO APLASTAN' },
    { type: 'cG', label: 'AL FRENAR SIENTE', value: '5 VECES SU PESO', col: RED },
    { type: 'cStop', label: 'FRENA EN', value: 'MENOS DISTANCIA' },
    { type: 'hCta', q: '¿TE ATREVERÍAS?', opts: ['¡SÍ!', 'NI LOCO'] }] },
});
