// 20 explicadores "¿Por qué…?" — escena genérica 2dbuena con props
const REF = { shirt: '#1c1c1c', pants: '#1c1c1c', cap: '#1c1c1c', capLogo: GOLD, skin: '#e2a87c' };
const FUT = { shirt: '#2c8f45', pants: '#ffffff', skin: '#c98d62', hair: '#2a1a10' };
const TEN = { shirt: '#ffffff', pants: '#ffffff', skin: '#e2a87c', hair: '#3a2618', band: RED, racket: -0.4 };
const PIT = { shirt: '#ff8000', pants: '#ff8000', cap: '#1c1c1c', capLogo: '#ff8000', skin: '#c98d62' };
const NFL = { shirt: '#1e4fa0', pants: '#f2f2f2', skin: '#9a6744', hair: '#1a1a1a' };
const FIG = { beto: BETO, ref: REF, fut: FUT, ten: TEN, pit: PIT, nfl: NFL, chema: CHEMA };

function soccerBall(x, y, r, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); circle(0, 0, r); inked('#fff', Math.max(3, r * 0.07)); g.fillStyle = INK; for (let j = 0; j < 5; j++) { const a = j / 5 * Math.PI * 2; circle(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.2); g.fill(); } circle(0, 0, r * 0.26); g.fill(); g.restore(); }
function tennisBall(x, y, r, col = '#e6f04a') { circle(x, y, r); inked(col, Math.max(3, r * 0.07)); g.strokeStyle = '#fff'; g.lineWidth = r * 0.08; g.beginPath(); g.arc(x - r * 0.9, y, r * 0.85, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(x + r * 0.9, y, r * 0.85, Math.PI - 0.9, Math.PI + 0.9); g.stroke(); }
function football(x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.beginPath(); g.ellipse(0, 0, 150, 88, 0, 0, Math.PI * 2); inked('#8a4b2a', 8); g.strokeStyle = '#fff'; g.lineWidth = 8; g.beginPath(); g.moveTo(-50, -30); g.lineTo(50, -30); g.stroke(); for (let i = -40; i <= 40; i += 20) { g.beginPath(); g.moveTo(i, -44); g.lineTo(i, -16); g.stroke(); } for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 120, 0, 60, Math.PI / 2 - 0.9, Math.PI / 2 + 0.9); g.stroke(); } g.restore(); }
function bigNum(txt, x, y, size, col = GOLD) { g.save(); g.font = `bold ${size}px DejaVu Sans`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = size * 0.14; g.lineJoin = 'round'; g.strokeStyle = INK; g.strokeText(txt, x, y); g.fillStyle = col; g.fillText(txt, x, y); g.restore(); }
function label(txt, x, y, size = 46, col = '#fff') { g.save(); g.font = `bold ${size}px DejaVu Sans`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = size * 0.22; g.lineJoin = 'round'; g.strokeStyle = INK; g.strokeText(txt, x, y); g.fillStyle = col; g.fillText(txt, x, y); g.restore(); }

const PROP = {
  cup: (o, p, t) => { // corte del hoyo con medida
    g.fillStyle = '#6b4a2e'; g.fillRect(0, 1350, W, 570); g.fillStyle = C.grass; g.fillRect(0, 1320, W, 40);
    g.fillStyle = '#3a2a1c'; g.fillRect(400, 1340, 280, 360); rr(400, 1340, 280, 360, 8); g.lineWidth = 10; g.strokeStyle = '#d5dbe1'; g.stroke();
    golfBall(540 + Math.sin(t) * 3, 1290, 60, t * 0.3); const k = clamp(p * 3); g.strokeStyle = RED; g.lineWidth = 8; g.beginPath(); g.moveTo(400, 1270 - 140 * 0 + 0); g.moveTo(400, 1740); g.lineTo(400 + 280 * k, 1740); g.stroke(); if (k > 0.9) label('108 mm', 540, 1800, 64, GOLD);
    yflag(540, 1340, t, 520); },
  tube: (o, p, t) => { g.save(); g.translate(540, 1450); g.rotate(-0.25); rr(-300, -110, 600, 220, 30); inked('#9aa2ab', 8); g.beginPath(); g.ellipse(300, 0, 50, 110, 0, 0, Math.PI * 2); inked('#59616b', 8); g.beginPath(); g.ellipse(300, 0, 32, 80, 0, 0, Math.PI * 2); g.fillStyle = '#2a2a2a'; g.fill(); g.restore(); label('4 ¼ PULGADAS', 540, 1720, 56, GOLD); },
  holes: (o, p, t) => { const n = o.n || 18; for (let i = 0; i < n; i++) { const a = back(clamp((p - i * 0.025) * 5)); if (a <= 0) continue; const x = 150 + (i % 6) * 156, y = 1150 + Math.floor(i / 6) * 220; g.save(); g.translate(x, y); g.scale(a, a); circle(0, 0, 62); inked(o.cut && i >= 18 ? '#c94f4f' : '#7fb36a', 6); label(String(i + 1), 0, 4, 44); g.restore(); } },
  bottle: (o, p, t) => { g.save(); g.translate(540, 1500); rr(-90, -260, 180, 340, 30); inked('#b8742a', 8); rr(-34, -380, 68, 140, 12); inked('#b8742a', 6); rr(-70, -150, 140, 110, 12); inked('#f7efd8', 5); g.restore(); if (p > 0.45) { g.save(); g.strokeStyle = RED; g.lineWidth = 26; g.lineCap = 'round'; const k = clamp((p - 0.45) * 4); g.beginPath(); g.moveTo(360, 1180); g.lineTo(360 + 360 * k, 1180 + 520 * k); g.moveTo(720, 1180); g.lineTo(720 - 360 * k, 1180 + 520 * k); g.stroke(); g.restore(); } },
  fly: (o, p, t) => { const q = seg(p, 0.1, 0.7); const x = lerp(120, 900, q), y = 1500 - Math.sin(q * Math.PI) * 500; g.save(); g.setLineDash([14, 12]); g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); for (let k = 0; k <= 30; k++) { const e = q * k / 30; const xx = lerp(120, 900, e), yy = 1500 - Math.sin(e * Math.PI) * 500; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore(); golfBall(x, y, 22, t * 9); if (o.speed) label(o.speed, 540, 1800, 60, GOLD); },
  duck: (o, p, t) => { person(BETO, 820, 1720, 0.6, { rA1: 2.4, rA2: 2.0, lA1: -2.4, lA2: -2.0, face: 'wow', lean: 0.15 }, t); const q = seg(p, 0.05, 0.6); golfBall(lerp(100, 760, q), 1350 - Math.sin(q * Math.PI) * 200, 26, t * 10); },
  jacket: (o, p, t) => { const k = back(clamp(p * 3)); g.save(); g.translate(540, 1450); g.scale(k, k); g.beginPath(); g.moveTo(-230, -260); g.lineTo(-90, -300); g.lineTo(0, -120); g.lineTo(90, -300); g.lineTo(230, -260); g.lineTo(300, 160); g.lineTo(180, 200); g.lineTo(150, -60); g.lineTo(150, 260); g.lineTo(-150, 260); g.lineTo(-150, -60); g.lineTo(-180, 200); g.lineTo(-300, 160); g.closePath(); inked('#1f6b3a', 9); g.beginPath(); g.moveTo(-90, -300); g.lineTo(0, -120); g.lineTo(90, -300); g.lineTo(40, -300); g.lineTo(0, -200); g.lineTo(-40, -300); g.closePath(); inked('#fff', 5); for (let i = 0; i < 3; i++) { circle(0, -40 + i * 90, 14); inked(GOLD, 4); } rr(-130, -40, 70, 70, 10); inked(GOLD, 4); g.restore(); },
  scale: (o, p, t) => { golfBall(540, 1330, 150, t * 0.4); g.save(); g.strokeStyle = RED; g.lineWidth = 8; g.beginPath(); g.moveTo(390, 1530); g.lineTo(690, 1530); g.stroke(); g.restore(); label(o.txt || '42.67 mm', 540, 1600, 60, GOLD); },
  layers: (o, p, t) => { const cols = ['#fff', '#3c8fc4', '#f2b632', '#d8322b']; cols.forEach((c, i) => { const r = 220 - i * 50; g.save(); g.beginPath(); g.moveTo(540, 1350); g.arc(540, 1350, r, -Math.PI / 2, Math.PI * 1.5 * clamp(p * 2 + 0.2)); g.closePath(); inked(c, 6); g.restore(); }); },
  odds: (o, p, t) => { const N = o.n || 100; for (let i = 0; i < N; i++) { const x = 120 + (i % 10) * 94, y = 1060 + Math.floor(i / 10) * 72; const hit = i === 57 && p > 0.5; golfBall(x, y, hit ? 30 : 20, 0); if (hit) { g.save(); g.strokeStyle = GOLD; g.lineWidth = 8; circle(x, y, 44); g.stroke(); g.restore(); } } },
  ace: (o, p, t) => { const q = seg(p, 0.05, 0.6); const x = lerp(160, 800, q), y = 1600 - Math.sin(q * Math.PI) * 420 - (q >= 1 ? 0 : 0); g.fillStyle = '#1a1a1a'; g.beginPath(); g.ellipse(800, 1600, 34, 12, 0, 0, Math.PI * 2); g.fill(); yflag(804, 1596, t, 260); if (q < 1) golfBall(x, y, 22, t * 8); },
  drinks: (o, p, t) => { for (let i = 0; i < 5; i++) { const x = 180 + i * 180, y = 1500 + Math.sin(t * 4 + i) * 10; rr(x - 50, y - 120, 100, 160, 14); inked(i % 2 ? '#f2b632' : '#d8322b', 6); rr(x - 50, y - 130, 100, 30, 12); inked('#fff', 5); } },
  redo: (o, p, t) => { const k = clamp(p * 1.4); g.save(); g.translate(540, 1300); g.rotate(-t * 2); g.strokeStyle = GOLD; g.lineWidth = 30; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, 150, 0, Math.PI * 1.6); g.stroke(); g.beginPath(); g.moveTo(150, -40); g.lineTo(150, 40); g.lineTo(80, 0); g.closePath(); g.fillStyle = GOLD; g.fill(); g.restore(); },
  rulebook: (o, p, t) => { g.save(); g.translate(540, 1380); g.rotate(-0.06); rr(-220, -280, 440, 520, 20); inked('#1f4f8a', 10); g.fillStyle = '#fff'; g.font = 'bold 60px DejaVu Sans'; g.textAlign = 'center'; g.fillText('REGLAS', 0, -150); g.fillText('DE GOLF', 0, -80); g.restore(); if (p > 0.4) stampB('NO EXISTE', seg(p, 0.4, 1), RED, 1450); },
  diamond: (o, p, t) => { bField(t, o); const k = clamp(p * 2); g.save(); g.strokeStyle = GOLD; g.lineWidth = 10; g.setLineDash([20, 14]); g.beginPath(); g.moveTo(HOME[0], HOME[1]); g.lineTo(lerp(HOME[0], B1[0], k), lerp(HOME[1], B1[1], k)); g.stroke(); g.restore(); if (k > 0.9) label(o.txt || '90 PIES', 820, 1600, 56, GOLD); if (o.race) { const q = seg(p, 0.15, 0.85); const rx = lerp(HOME[0], B1[0], q), ry = lerp(HOME[1], B1[1], q); golfer(rx, ry + 20, 0.35, { shirt: '#1e4fa0', pants: '#f2f2f2', cap: '#1e4fa0', rA1: Math.sin(t * 12) * 0.8, lA1: -Math.sin(t * 12) * 0.8, legL: Math.sin(t * 12) * 0.5, legR: -Math.sin(t * 12) * 0.5 }, t); const bx = lerp(MOUND[0] - 120, B1[0], q), by = lerp(MOUND[1] + 40, B1[1], q); baseBall(bx, by - 30, 16, t * 10); } },
  innings: (o, p, t) => { for (let i = 0; i < 9; i++) { const a = back(clamp((p - i * 0.06) * 5)); if (a <= 0) continue; const x = 150 + (i % 5) * 195, y = 1250 + Math.floor(i / 5) * 230; g.save(); g.translate(x, y); g.scale(a, a); rr(-80, -80, 160, 160, 18); inked(i === 8 ? GOLD : '#fff', 6); label(String(i + 1), 0, 4, 80, INK); g.restore(); } },
  run21: (o, p, t) => { const n = Math.min(21, Math.floor(p * 26)); bigNum(String(n), 540, 1400, 300, n >= 21 ? GOLD : '#fff'); label('CARRERAS', 540, 1620, 56); },
  stretch: (o, p, t) => { g.fillStyle = '#7d8a96'; g.fillRect(0, 1100, W, 820); for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) { const x = 70 + c * 118, y = 1240 + r * 150, up = Math.max(0, Math.sin(t * 3 + c * 0.3 + r)); g.save(); g.translate(x, y); rr(-30, -10 - up * 40, 60, 90, 14); inked(['#d8322b', '#3c8fc4', '#f2b632', '#fff', '#2c8f45'][(c + r) % 5], 4); circle(0, -40 - up * 40, 24); inked('#e2a87c', 4); g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(-26, -10 - up * 40); g.lineTo(-40, -50 - up * 90); g.moveTo(26, -10 - up * 40); g.lineTo(40, -50 - up * 90); g.stroke(); g.restore(); } if (o.notes) for (let i = 0; i < 6; i++) { const a = (t * 0.5 + i / 6) % 1; label('♪', 120 + i * 170, 1150 - a * 300, 70, GOLD); } },
  clock90: (o, p, t) => { const q = clamp(p * 1.3); g.save(); g.translate(540, 1380); circle(0, 0, 250); inked('#fff', 12); rr(-30, -300, 60, 50, 10); inked('#59616b', 6); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(Math.sin(a) * 200, -Math.cos(a) * 200); g.lineTo(Math.sin(a) * 230, -Math.cos(a) * 230); g.stroke(); } g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 190, -Math.PI / 2, -Math.PI / 2 + q * Math.PI * 1.5); g.closePath(); g.fillStyle = 'rgba(44,143,69,0.5)'; g.fill(); g.strokeStyle = RED; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(q * Math.PI * 1.5) * 180, -Math.cos(q * Math.PI * 1.5) * 180); g.stroke(); g.restore(); bigNum(`${Math.round(q * 90)}'`, 540, 1720, 110); },
  versus: (o, p, t) => { label(o.a || 'LONDRES', 300, 1250, 66); label('VS', 540, 1250, 70, RED); label(o.b || 'SHEFFIELD', 780, 1250, 66); soccerBall(540, 1500, 90, t * 2); },
  light: (o, p, t) => { g.save(); g.translate(540, 1400); rr(-110, -330, 220, 660, 40); inked('#2a2a2a', 10); const on = p < 0.35 ? 2 : p < 0.7 ? 1 : 0; ['#d8322b', '#f5d020', '#2c8f45'].forEach((c, i) => { circle(0, -210 + i * 210, 80); inked(i === on ? c : '#444', 6); }); g.restore(); },
  cards: (o, p, t) => { const a = back(clamp(p * 3)), b = back(clamp((p - 0.25) * 3)); person(REF, 540, 1760, 0.62, { rA1: 0.3, lA1: -2.9, lA2: 0, head: -0.1 }, t); if (a > 0) { g.save(); g.translate(330, 1150); g.rotate(-0.2); g.scale(a, a); rr(-90, -130, 180, 260, 16); inked('#f5d020', 8); g.restore(); } if (b > 0) { g.save(); g.translate(750, 1150); g.rotate(0.2); g.scale(b, b); rr(-90, -130, 180, 260, 16); inked('#d8322b', 8); g.restore(); } },
  offside: (o, p, t) => { g.fillStyle = '#4f9a4a'; g.fillRect(60, 1000, 960, 860); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#58a653' : '#4f9a4a'; g.fillRect(60, 1000 + i * 143, 960, 143); } g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(60, 1000, 960, 860); rr(340, 1000, 400, 150, 4); g.stroke(); const lineY = o.lineY ?? 1300;
    const pl = (x, y, c, lb) => { circle(x, y, 36); inked(c, 6); if (lb) label(lb, x, y + 62, 30); };
    pl(540, 1060, '#f5d020', 'PORTERO'); pl(380, lineY, '#d8322b', 'DEFENSA'); const ax = o.off ? 700 : 700, ay = o.off ? lineY - 110 : lineY + 60; pl(ax, ay, '#3c8fc4', 'TÚ'); pl(560, 1720, '#3c8fc4', 'PASE');
    g.save(); g.setLineDash([18, 12]); g.strokeStyle = '#f5d020'; g.lineWidth = 6; g.beginPath(); g.moveTo(60, lineY); g.lineTo(1020, lineY); g.stroke(); g.restore();
    const q = seg(p, 0.2, 0.7); soccerBall(lerp(560, ax, q), lerp(1720, ay + 40, q), 20, t * 8); if (o.off && p > 0.7) stampB('¡FUERA DE LUGAR!', seg(p, 0.7, 1), RED, 1500); },
  tclock: (o, p, t) => { const steps = [0, 15, 30, 45]; const k = Math.min(3, Math.floor(p * 4.5)); g.save(); g.translate(540, 1380); circle(0, 0, 260); inked('#fff', 12); steps.forEach((v, i) => { const a = i / 4 * Math.PI * 2; label(i === 3 && o.forty ? '40' : String(v === 0 ? 0 : v), Math.sin(a) * 190, -Math.cos(a) * 190, 62, i <= k ? GOLD : '#9aa2ab'); }); const a = (k / 4) * Math.PI * 2; g.strokeStyle = RED; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a) * 140, -Math.cos(a) * 140); g.stroke(); circle(0, 0, 18); inked(RED, 4); g.restore(); },
  egg: (o, p, t) => { g.save(); g.translate(330, 1400); g.beginPath(); g.ellipse(0, 0, 140, 180, 0, 0, Math.PI * 2); inked('#fbf3e0', 10); g.restore(); bigNum('=', 540, 1400, 160, '#fff'); bigNum('0', 760, 1400, 340, GOLD); },
  heart: (o, p, t) => { const s = 1 + Math.sin(t * 6) * 0.06; g.save(); g.translate(540, 1380); g.scale(s, s); g.beginPath(); g.moveTo(0, 120); g.bezierCurveTo(-260, -60, -140, -260, 0, -120); g.bezierCurveTo(140, -260, 260, -60, 0, 120); inked(RED, 10); g.restore(); tennisBall(540, 1640, 50); },
  tv: (o, p, t) => { g.save(); g.translate(540, 1380); rr(-360, -260, 720, 480, 30); inked('#2a2a2a', 10); rr(-320, -220, 640, 400, 16); g.fillStyle = '#3e7fc4'; g.fill(); g.fillStyle = '#5fa24a'; g.fillRect(-320, -20, 640, 200); g.restore(); const yel = o.yellow; const q = (t * 0.7) % 1; const x = lerp(260, 820, q), y = 1300 + Math.sin(q * Math.PI) * -120; if (yel) tennisBall(x, y, 22); else { circle(x, y, 22); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fill(); } },
  balls3: (o, p, t) => { tennisBall(300, 1400, 90, '#ffffff'); tennisBall(540, 1400, 90, '#2a2a2a'); tennisBall(780, 1400, 90); label('ANTES', 420, 1560, 46); label('AHORA', 780, 1560, 46, GOLD); },
  pit: (o, p, t) => { bgFor('track', t); f1car(540, 1420, 1.0, 0, t * 0.05); const crew = [[260, 1560], [380, 1580], [700, 1580], [820, 1560], [170, 1400], [910, 1400], [540, 1560]]; crew.forEach(([x, y], i) => golfer(x, y + 40, 0.32, Object.assign({}, PIT, { rA1: 1.2 + Math.sin(t * 14 + i) * 0.4, lA1: -1.2 - Math.sin(t * 14 + i) * 0.4 }), t)); },
  stopwatch: (o, p, t) => { const v = Math.min(o.val || 1.8, p * (o.val || 1.8) * 1.6); g.save(); g.translate(540, 1400); circle(0, 0, 240); inked('#fff', 12); rr(-30, -290, 60, 50, 10); inked(RED, 6); g.restore(); bigNum(v.toFixed(2) + ' s', 540, 1420, 120, v >= (o.val || 1.8) ? GOLD : INK); },
  tires: (o, p, t) => { const tire = (x, grooves, lb) => { g.save(); g.translate(x, 1380); rr(-150, -260, 300, 520, 60); inked('#2a2a2a', 10); if (grooves) { g.strokeStyle = '#5a5a5a'; g.lineWidth = 12; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 70, -240); g.lineTo(i * 70, 240); g.stroke(); } for (let j = -4; j <= 4; j++) { g.beginPath(); g.moveTo(-140, j * 55 + ((t * 60) % 55)); g.lineTo(140, j * 55 + 20 + ((t * 60) % 55)); g.stroke(); } } g.restore(); label(lb, x, 1700, 48); };
    tire(o.both ? 300 : 540, false, 'LISA'); if (o.both) tire(780, true, 'LLUVIA'); if (o.rain) for (let i = 0; i < 40; i++) { const y = (hash(i) * 1000 + t * 900) % 1000 + 900, x = hash(i * 3) * W; g.strokeStyle = 'rgba(95,180,230,0.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 40); g.stroke(); } },
  ball: (o, p, t) => { const r = 200 * back(clamp(p * 2.5)); if (o.kind === 'golf') golfBall(540, 1380, r, t * 0.5); else if (o.kind === 'base') baseBall(540, 1380, r, t * 0.5); else if (o.kind === 'soccer') soccerBall(540, 1380, r, t * 0.5); else if (o.kind === 'tennis') tennisBall(540, 1380, r); else if (o.kind === 'football') football(540, 1380, r / 150, Math.sin(t) * 0.2); else if (o.kind === 'f1') f1car(540, 1420, r / 200, 0, t); if (o.q && r > 100) for (const [x, y] of [[170, 1150], [910, 1150], [880, 1650]]) bigNum('?', x, y + Math.sin(t * 3 + x) * 14, 140); },
  spiral: (o, p, t) => { const q = seg(p, 0.1, 0.8); const x = lerp(150, 930, q), y = 1500 - Math.sin(q * Math.PI) * 420; football(x, y, 0.45, Math.atan2(-Math.cos(q * Math.PI) * 420 * Math.PI, 780) * 0.5 + Math.sin(t * 30) * 0.04); g.save(); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 5; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x - 80 - k * 40, y + 10, 20, 40, 0, 0, Math.PI * 2); g.stroke(); } g.restore(); },
  rugby: (o, p, t) => { g.save(); g.translate(540, 1380); g.beginPath(); g.ellipse(0, 0, 200, 150, 0, 0, Math.PI * 2); inked('#c9a06a', 8); g.restore(); label('RUGBY', 540, 1600, 56); },
  morph: (o, p, t) => { const k = ease(clamp(p * 1.4)); g.save(); g.translate(540, 1380); g.beginPath(); g.ellipse(0, 0, lerp(190, 160, k), lerp(150, 90, k), 0, 0, Math.PI * 2); inked(k > 0.5 ? '#8a4b2a' : '#c9a06a', 8); g.restore(); label(k > 0.5 ? 'HOY' : 'ANTES', 540, 1600, 56, GOLD); },
};
SC.gx = (o, p, lt, t) => {
  const b = o.bg || 'club';
  if (b === 'club') background(t, { flagNum: o.flag || '18' }); else if (b === 'aug') augBg(t, o); else if (b === 'sky') sky(t); else if (b === 'court') court(t); else if (b === 'home') homeBg(t); else if (b === 'dark') { g.fillStyle = '#1d2026'; g.fillRect(0, 0, W, H); } else bgFor(b, t);
  if (o.crowd) gallery(t);
  if (o.prop) PROP[o.prop](o, p, t);
  if (o.fig) { const F = FIG[o.fig]; const pose = Object.assign({}, POSE[o.pose || 'idle'](t), o.fig === 'ten' ? { racket: -0.4 + Math.sin(t * 3) * 0.3 } : {}); person(F, o.fx ?? 540, o.fy ?? 1740, o.fs ?? 0.7, pose, t); }
  if (o.items) board(o.title, o.items, p, o.cy || 760, o); else if (o.value) card(o.label, o.value, seg(p, 0.05, 1), o.cy || 700, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.5, 1), o.scol || RED, o.sy || 1000);
};
const G = 'GOLF EXPLICADO', B = '¿POR QUÉ…?';
const cta = (q, a, b) => ({ type: 'hCta', q, opts: [a, b] });
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  x01: { tag: G, shots: [
    { type: 'gx', prop: 'cup', label: '¿POR QUÉ EL HOYO MIDE…', value: '108 mm?' },
    { type: 'gx', bg: 'aug', fig: 'beto', pose: 'point', label: 'ESCOCIA · MUSSELBURGH', value: '1829' },
    { type: 'gx', prop: 'tube', label: 'LA HERRAMIENTA MEDÍA', value: '4 ¼ PULGADAS' },
    { type: 'gx', prop: 'tube', label: 'DICEN QUE ERA UN', value: 'TUBO DE DRENAJE', col: '#9aa2ab' },
    { type: 'gx', prop: 'cup', label: 'REGLA MUNDIAL DESDE', value: '1891' },
    cta('¿CHICO O GRANDE?', 'MUY CHICO', 'ESTÁ BIEN')] },
  x02: { tag: G, shots: [
    { type: 'gx', prop: 'holes', n: 18, label: '¿POR QUÉ TIENE…', value: '18 HOYOS?' },
    { type: 'gx', prop: 'bottle', label: 'EL MITO DEL WHISKY', value: 'FALSO', col: RED },
    { type: 'gx', prop: 'holes', n: 22, label: 'SAINT ANDREWS · 1764', value: '22 HOYOS' },
    { type: 'gx', prop: 'holes', n: 22, cut: true, label: 'JUNTARON LOS CORTOS', value: '22 → 18' },
    { type: 'gx', bg: 'aug', fig: 'beto', pose: 'thumbs', label: 'TODOS LO COPIARON', value: '18 HOYOS' },
    cta('¿CUÁNTOS JUEGAS?', '9 HOYOS', '18 HOYOS')] },
  x03: { tag: G, shots: [
    { type: 'gx', prop: 'duck', label: '¿POR QUÉ SE GRITA…', value: '¡FORE!' },
    { type: 'gx', prop: 'duck', stamp: '¡CÚBRETE!', sy: 1050 },
    { type: 'gx', fig: 'chema', fx: 760, pose: 'point', label: 'VIENE DE', value: 'FORECADDIE', col: AG },
    { type: 'gx', prop: 'fly', label: 'LE GRITABAN', value: '¡FORE!' },
    { type: 'gx', prop: 'fly', speed: '+200 km/h', label: 'UNA BOLA PUEDE SALIR A', value: '+200 km/h', col: RED },
    cta('¿TE HAN GRITADO FORE?', 'SÍ, MUCHAS', 'NUNCA')] },
  x04: { tag: G, shots: [
    { type: 'gx', bg: 'aug', water: true, label: '¿QUÉ ES EL…', value: 'AMEN CORNER?' },
    { type: 'gx', bg: 'aug', water: true, title: 'AMEN CORNER', items: ['HOYO 11 · PAR 4', 'HOYO 12 · PAR 3', 'HOYO 13 · PAR 5'] },
    { type: 'gx', bg: 'aug', water: true, fig: 'beto', pose: 'wow', label: 'AGUA + VIENTO', value: 'PELIGRO', col: RED },
    { type: 'gx', bg: 'aug', label: 'NOMBRE DE UNA CANCIÓN DE JAZZ', value: '1958', col: '#f5d020' },
    { type: 'gx', bg: 'aug', water: true, label: 'AHÍ SE GANAN Y PIERDEN', value: 'MASTERS' },
    cta('¿LO JUGARÍAS?', 'SÍ, DE UNA', 'NI LOCO')] },
  x05: { tag: G, shots: [
    { type: 'gx', bg: 'aug', prop: 'jacket', label: '¿POR QUÉ LA…', value: 'CHAQUETA VERDE?', col: '#2c8f45' },
    { type: 'gx', bg: 'aug', prop: 'jacket', label: 'LOS SOCIOS LA USABAN DESDE', value: '1937' },
    { type: 'gx', bg: 'aug', prop: 'jacket', label: 'PRIMER CAMPEÓN CON CHAQUETA', value: 'SAM SNEAD 1949', col: '#2c8f45' },
    { type: 'gx', bg: 'aug', prop: 'jacket', label: 'EN CASA SOLO', value: '1 AÑO', col: RED },
    { type: 'gx', bg: 'aug', fig: 'beto', pose: 'cheer', label: 'EL PREMIO MÁS FAMOSO', value: 'CHAQUETA VERDE', col: '#2c8f45' },
    cta('¿QUÉ PREFIERES?', 'LA CHAQUETA', 'UN TROFEO')] },
  x06: { tag: G, shots: [
    { type: 'gx', prop: 'ball', kind: 'golf', q: true, label: '¿CUÁNTO PESA UNA…', value: 'PELOTA DE GOLF?' },
    { type: 'gx', prop: 'ball', kind: 'golf', label: 'MÁXIMO', value: '45.93 g', stamp: 'MÁS = ILEGAL', sy: 1700 },
    { type: 'gx', prop: 'scale', label: 'DIÁMETRO MÍNIMO', value: '42.67 mm' },
    { type: 'gx', prop: 'ball', kind: 'golf', label: 'HOYUELOS', value: '300 A 500' },
    { type: 'gx', prop: 'layers', label: 'POR DENTRO', value: 'VARIAS CAPAS' },
    cta('¿TU MARCA FAVORITA?', 'TITLEIST', 'OTRA')] },
  x07: { tag: G, shots: [
    { type: 'gx', prop: 'ace', label: '¿QUÉ TAN DIFÍCIL ES UN…', value: 'HOYO EN UNO?' },
    { type: 'gx', prop: 'odds', label: 'AFICIONADO', value: '1 EN 12,500', col: RED },
    { type: 'gx', prop: 'odds', label: 'PROFESIONAL', value: '1 EN 2,500' },
    { type: 'gx', fig: 'beto', pose: 'sad', label: 'HAY QUIEN NUNCA LO LOGRA', value: 'TODA LA VIDA', col: '#9aa2ab' },
    { type: 'gx', prop: 'drinks', label: 'SI LO HACES…', value: '¡TÚ INVITAS!' },
    cta('¿YA HICISTE UNO?', '¡SÍ!', 'TODAVÍA NO')] },
  x08: { tag: G, shots: [
    { type: 'gx', prop: 'redo', label: '¿QUÉ ES UN…', value: 'MULLIGAN?' },
    { type: 'gx', prop: 'redo', fig: 'beto', fx: 820, fs: 0.55, pose: 'thumbs', label: 'FALLAS Y', value: 'LO REPITES' },
    { type: 'gx', prop: 'rulebook', label: 'EN LAS REGLAS', value: 'NO EXISTE', col: RED },
    { type: 'gx', fig: 'chema', pose: 'thumbs', label: 'DICEN QUE VIENE DE', value: 'DAVID MULLIGAN' },
    { type: 'gx', fig: 'beto', pose: 'cheer', label: 'LOS SÁBADOS', value: '¡MULLIGAN!' },
    cta('¿TÚ PIDES MULLIGAN?', 'SIEMPRE', 'NUNCA')] },
  x09: { tag: B, shots: [
    { type: 'gx', bg: 'baseball', prop: 'innings', label: '¿POR QUÉ HAY…', value: '9 ENTRADAS?' },
    { type: 'gx', bg: 'baseball', prop: 'run21', label: 'GANABA EL PRIMERO EN', value: '21 CARRERAS' },
    { type: 'gx', bg: 'baseball', fig: 'beto', pose: 'sad', label: 'JUEGOS', value: 'ETERNOS', col: '#9aa2ab' },
    { type: 'gx', bg: 'baseball', prop: 'innings', label: 'NUEVA YORK · 1857', value: '9 ENTRADAS' },
    { type: 'gx', bg: 'baseball', title: 'EL NÚMERO MÁGICO', items: ['9 JUGADORES', '9 ENTRADAS'] },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x10: { tag: B, shots: [
    { type: 'gx', bg: 'baseball', prop: 'stretch', label: '¿POR QUÉ TODOS SE PARAN EN LA…', value: '7ª ENTRADA?' },
    { type: 'gx', bg: 'baseball', prop: 'stretch', label: 'SE LLAMA', value: 'EL ESTIRÓN' },
    { type: 'gx', bg: 'baseball', prop: 'stretch', notes: true, label: 'CANCIÓN DE 1908', value: '♪ TAKE ME OUT ♪' },
    { type: 'gx', bg: 'baseball', fig: 'beto', pose: 'point', label: '¿EL PRESIDENTE TAFT?', value: 'LEYENDA', col: '#3c8fc4' },
    { type: 'gx', bg: 'baseball', prop: 'stretch', notes: true, label: 'LA TRADICIÓN MÁS', value: 'BONITA' },
    cta('¿TE LA SABES?', 'SÍ, COMPLETA', 'SOLO EL CORO')] },
  x11: { tag: B, shots: [
    { type: 'gx', bg: 'dark', prop: 'diamond', label: '¿POR QUÉ LAS BASES ESTÁN A…', value: '90 PIES?' },
    { type: 'gx', bg: 'dark', prop: 'diamond', txt: '27.4 m', label: 'DESDE MEDIADOS DEL SIGLO XIX', value: '27.4 METROS' },
    { type: 'gx', bg: 'dark', prop: 'diamond', race: true, label: 'LA BOLA Y EL CORREDOR', value: '¡EMPATADOS!' },
    { type: 'gx', bg: 'dark', prop: 'diamond', race: true, stamp: '¡POR MILÍMETROS!', sy: 1050 },
    { type: 'gx', bg: 'baseball', title: 'LA MEDIDA PERFECTA', items: ['MÁS CERCA: TODOS LLEGAN', 'MÁS LEJOS: NADIE LLEGA'], cols: [INK, RED] },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x12: { tag: B, shots: [
    { type: 'gx', bg: 'soccer', prop: 'clock90', label: '¿POR QUÉ DURA…', value: '90 MINUTOS?' },
    { type: 'gx', bg: 'soccer', prop: 'versus', label: 'EL PARTIDO DE', value: '1866' },
    { type: 'gx', bg: 'soccer', fig: 'fut', pose: 'thumbs', label: 'SE VOLVIÓ', value: 'COSTUMBRE' },
    { type: 'gx', bg: 'soccer', prop: 'clock90', label: 'REGLA OFICIAL DESDE', value: '1897' },
    { type: 'gx', bg: 'soccer', title: 'UN PARTIDO', items: ["45' + 45'", '+ TIEMPO AGREGADO'], cols: [INK, RED] },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x13: { tag: B, shots: [
    { type: 'gx', bg: 'soccer', prop: 'cards', label: '¿QUIÉN INVENTÓ LAS…', value: 'TARJETAS?' },
    { type: 'gx', bg: 'club', fig: 'ref', pose: 'idle', label: 'UN ÁRBITRO INGLÉS', value: 'KEN ASTON' },
    { type: 'gx', bg: 'sky', prop: 'light', label: 'AMARILLO = CUIDADO · ROJO = FUERA', value: 'EL SEMÁFORO', col: RED },
    { type: 'gx', bg: 'soccer', fig: 'ref', pose: 'point', label: 'NO ENTENDÍAN', value: 'EL IDIOMA', col: '#9aa2ab' },
    { type: 'gx', bg: 'soccer', prop: 'cards', label: 'PRIMERA VEZ', value: 'MÉXICO 70', col: '#2c8f45' },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x14: { tag: B, shots: [
    { type: 'gx', bg: 'sky', prop: 'offside', label: 'TE LO EXPLICO RÁPIDO', value: 'FUERA DE LUGAR' },
    { type: 'gx', bg: 'sky', prop: 'offside', label: 'NECESITAS DELANTE', value: '2 RIVALES' },
    { type: 'gx', bg: 'sky', prop: 'offside', label: 'NORMALMENTE', value: 'PORTERO + DEFENSA', col: '#f5d020' },
    { type: 'gx', bg: 'sky', prop: 'offside', off: true, label: 'SOLO HAY UNO', value: '¡FUERA!', col: RED },
    { type: 'gx', bg: 'soccer', title: 'NO CUENTA SI…', items: ['ESTÁS EN TU MITAD', 'ES SAQUE DE BANDA'], cols: [AG, AG] },
    cta('¿YA LO ENTENDISTE?', 'SÍ, CLARÍSIMO', 'SIGO IGUAL')] },
  x15: { tag: B, shots: [
    { type: 'gx', bg: 'court', prop: 'tclock', label: '¿POR QUÉ SE CUENTA…', value: '15 · 30 · 40?' },
    { type: 'gx', bg: 'court', prop: 'tclock', label: 'LA TEORÍA DEL', value: 'RELOJ' },
    { type: 'gx', bg: 'court', prop: 'tclock', label: 'CADA PUNTO', value: 'UN CUARTO' },
    { type: 'gx', bg: 'court', prop: 'tclock', forty: true, label: '45 SE VOLVIÓ', value: '40', col: RED },
    { type: 'gx', bg: 'court', fig: 'ten', pose: 'idle', label: 'NADIE LO SABE', value: 'SEGURO', col: '#9aa2ab' },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x16: { tag: B, shots: [
    { type: 'gx', bg: 'court', prop: 'ball', kind: 'tennis', q: true, label: '¿POR QUÉ EL CERO SE DICE…', value: '"LOVE"?' },
    { type: 'gx', bg: 'court', prop: 'egg', label: 'DEL FRANCÉS "L\'OEUF"', value: 'HUEVO' },
    { type: 'gx', bg: 'court', prop: 'heart', label: 'O JUGAR POR', value: 'AMOR', col: RED },
    { type: 'gx', bg: 'court', fig: 'ten', pose: 'thumbs', label: 'EN WIMBLEDON', value: '"LOVE"' },
    { type: 'gx', bg: 'court', fig: 'ten', pose: 'idle', label: 'LA VERDADERA', value: '¿?', col: '#9aa2ab' },
    cta('¿CUÁL TE CONVENCE?', 'EL HUEVO', 'EL AMOR')] },
  x17: { tag: B, shots: [
    { type: 'gx', bg: 'court', prop: 'ball', kind: 'tennis', q: true, label: '¿POR QUÉ SON…', value: 'AMARILLAS?' },
    { type: 'gx', bg: 'court', prop: 'balls3', label: 'ANTES ERAN', value: 'BLANCAS', col: '#fff' },
    { type: 'gx', bg: 'home', prop: 'tv', label: 'EN LA TELE', value: 'NO SE VEÍA', col: '#9aa2ab' },
    { type: 'gx', bg: 'home', prop: 'tv', yellow: true, label: 'APROBADA EN', value: '1972' },
    { type: 'gx', bg: 'court', fig: 'ten', pose: 'thumbs', label: 'WIMBLEDON CAMBIÓ HASTA', value: '1986', col: '#2c8f45' },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x18: { tag: B, shots: [
    { type: 'gx', bg: 'track', prop: 'pit', label: '4 LLANTAS EN', value: '2 SEGUNDOS' },
    { type: 'gx', bg: 'track', prop: 'pit', label: 'MECÁNICOS', value: '~20' },
    { type: 'gx', bg: 'track', prop: 'pit', title: 'POR CADA LLANTA', items: ['1 QUITA LA TUERCA', '1 SACA LA LLANTA', '1 PONE LA NUEVA'] },
    { type: 'gx', bg: 'track', prop: 'pit', label: 'DOS GATOS', value: '¡ARRIBA!' },
    { type: 'gx', bg: 'dark', prop: 'stopwatch', val: 1.8, label: 'RÉCORD · McLAREN 2023', value: '1.80 s', cy: 760 },
    cta('¿Y TÚ CUÁNTO TARDAS?', 'MENOS DE 10 MIN', 'MEJOR LLAMO')] },
  x19: { tag: B, shots: [
    { type: 'gx', bg: 'track', prop: 'tires', label: '¿POR QUÉ SON…', value: 'LISAS?' },
    { type: 'gx', bg: 'track', prop: 'tires', label: 'MÁS HULE EN EL PISO', value: 'MÁS AGARRE' },
    { type: 'gx', bg: 'track', prop: 'tires', label: 'SIN DIBUJO', value: 'TODA PEGA' },
    { type: 'gx', bg: 'track', prop: 'tires', rain: true, label: 'CON LLUVIA', value: '¡PATINA!', col: RED },
    { type: 'gx', bg: 'track', prop: 'tires', both: true, rain: true, label: 'LLANTAS DE LLUVIA', value: 'CANALES', col: '#5fb4e6' },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  x20: { tag: B, shots: [
    { type: 'gx', bg: 'club', prop: 'ball', kind: 'football', q: true, label: '¿POR QUÉ TIENE…', value: 'ESA FORMA?' },
    { type: 'gx', bg: 'club', prop: 'rugby', label: 'APODO', value: '"PIGSKIN"', col: '#c9a06a' },
    { type: 'gx', bg: 'club', prop: 'rugby', label: 'MÁS REDONDO, PARA', value: 'PATEAR' },
    { type: 'gx', bg: 'club', fig: 'nfl', pose: 'point', label: 'PASE HACIA ADELANTE', value: '1906' },
    { type: 'gx', bg: 'club', prop: 'spiral', label: 'MÁS DELGADO PARA', value: 'LA ESPIRAL' },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
});
