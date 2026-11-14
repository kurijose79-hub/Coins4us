// Lugares y récords del golf (y01–y10) — 2dbuena
function sea(t, y0, col = '#3c8fc4') { g.fillStyle = col; g.fillRect(0, y0, W, H - y0); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 5; for (let i = 0; i < 14; i++) { const x = ((i * 180 + t * 40 * (i % 2 ? 1 : -1)) % 1300 + 1300) % 1300 - 100, y = y0 + 40 + (i % 5) * 140; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30, y - 12, x + 60, y); g.stroke(); } }
function isle(x, y, rx, ry, col = '#86c96c', sand = true) { if (sand) { g.fillStyle = '#e8d9a8'; g.beginPath(); g.ellipse(x, y + 8, rx + 26, ry + 12, 0, 0, Math.PI * 2); g.fill(); } g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); inked(col, 6); }
function flagC(x, y, cols, cross) { g.save(); g.translate(x, y); rr(-70, -46, 140, 92, 8); g.fillStyle = cols[0]; g.fill(); if (cross) { g.fillStyle = cols[1]; g.fillRect(-36, -46, 22, 92); g.fillRect(-70, -11, 140, 22); } else if (cols.length === 3) { g.fillStyle = cols[1]; g.fillRect(-23, -46, 46, 92); g.fillStyle = cols[2]; g.fillRect(23, -46, 47, 92); } g.lineWidth = 5; g.strokeStyle = INK; rr(-70, -46, 140, 92, 8); g.stroke(); g.restore(); }
function mountains(t, snow = true) { const pk = [[0, 1150, 330, 700], [260, 1150, 640, 560], [640, 1150, 980, 640], [860, 1150, 1160, 760]]; pk.forEach(([x0, yb, x1, ytop], i) => { const xm = (x0 + x1) / 2; g.beginPath(); g.moveTo(x0, yb); g.lineTo(xm, ytop); g.lineTo(x1, yb); g.closePath(); inked(i % 2 ? '#7d8a96' : '#6b7783', 6); if (snow) { g.beginPath(); g.moveTo(xm - 60, ytop + 110); g.lineTo(xm, ytop); g.lineTo(xm + 60, ytop + 110); g.lineTo(xm + 20, ytop + 90); g.lineTo(xm, ytop + 120); g.lineTo(xm - 25, ytop + 92); g.closePath(); inked('#ffffff', 4); } }); }
const LAND = {
  island: (o, p, t) => { sky(t); sea(t, 1050); isle(560, 1250, 230, 80); g.fillStyle = '#e8d9a8'; g.beginPath(); g.ellipse(380, 1240, 40, 18, 0, 0, Math.PI * 2); g.fill(); yflag(600, 1240, t, 220); if (o.splash) { const q = (t * 0.6) % 1; const x = lerp(100, 330, q), y = 1700 - Math.sin(q * Math.PI) * 500 + (q > 0.85 ? 0 : 0); lightBall(x, y, lerp(16, 8, q)); if (q > 0.85) { g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.ellipse(330, 1500, (q - 0.85) * 400, (q - 0.85) * 120, 0, 0, Math.PI * 2); g.stroke(); } } if (o.balls) for (let i = 0; i < 60; i++) { const x = 100 + hash(i) * 880, y = 1400 + hash(i * 3) * 450; circle(x, y, 10); g.fillStyle = 'rgba(255,255,255,0.85)'; g.fill(); } },
  gate: (o, p, t) => { augBg(t, {}); g.fillStyle = '#2c4a2e'; g.fillRect(0, 1250, W, 40); for (let i = 0; i < 20; i++) { g.fillStyle = INK; g.fillRect(40 + i * 52, 1100, 10, 220); } g.fillStyle = INK; g.fillRect(30, 1120, 1020, 10); g.fillRect(30, 1280, 1020, 10); rr(380, 1030, 320, 90, 14); inked('#1f6b3a', 6); g.fillStyle = '#f5d020'; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PRIVADO', 540, 1076); },
  mountain: (o, p, t) => { const gr = g.createLinearGradient(0, 0, 0, 1200); gr.addColorStop(0, '#9fd2f0'); gr.addColorStop(1, '#e8f4fb'); g.fillStyle = gr; g.fillRect(0, 0, W, H); mountains(t); g.fillStyle = '#86b874'; g.fillRect(0, 1150, W, H - 1150); yflag(820, 1180, t, 120); if (o.alt) { g.save(); g.strokeStyle = RED; g.lineWidth = 8; g.beginPath(); g.moveTo(80, 1700); g.lineTo(80, 600); g.stroke(); arrow(80, 700, 80, 600, RED, 10); g.restore(); label('3,970 m', 230, 640, 56, GOLD); } },
  longhole: (o, p, t) => { background(t, { noFlag: true }); g.fillStyle = '#9fd487'; g.beginPath(); g.moveTo(470, 1900); g.lineTo(610, 1900); g.lineTo(552, 1115); g.lineTo(528, 1115); g.closePath(); g.fill(); yflag(540, 1118, t, 60); const q = clamp(p * 1.2); g.save(); g.strokeStyle = RED; g.lineWidth = 8; g.setLineDash([18, 12]); g.beginPath(); g.moveTo(700, 1880); g.lineTo(lerp(700, 560, q), lerp(1880, 1120, q)); g.stroke(); g.restore(); label(o.dist || '~900 m', 820, 1500, 66, GOLD); label('PAR 7', 820, 1600, 52); },
  border: (o, p, t) => { background(t, { noFlag: true }); g.save(); g.setLineDash([26, 18]); g.strokeStyle = RED; g.lineWidth = 10; g.beginPath(); g.moveTo(540, 1110); g.lineTo(540, H); g.stroke(); g.restore(); flagC(270, 1250, ['#ffffff', '#1d5ba4'], true); flagC(810, 1250, ['#1d5ba4', '#f5d020'], true); label('FINLANDIA', 270, 1350, 44); label('SUECIA', 810, 1350, 44); if (o.clocks) { label(o.c1 || '12:00', 270, 1500, 70, GOLD); label(o.c2 || '11:00', 810, 1500, 70, GOLD); } const q = (t * 0.5) % 1; lightBall(lerp(300, 780, q), 1650 - Math.sin(q * Math.PI) * 300, 16); },
  road: (o, p, t) => { const gr = g.createLinearGradient(0, 0, 0, 1100); gr.addColorStop(0, '#f6d7a2'); gr.addColorStop(1, '#f3b36b'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#d9a35c'; g.fillRect(0, 1100, W, H - 1100); g.fillStyle = '#5b5f66'; g.beginPath(); g.moveTo(500, 1100); g.lineTo(580, 1100); g.lineTo(900, H); g.lineTo(180, H); g.closePath(); g.fill(); g.fillStyle = '#fff'; for (let i = 0; i < 8; i++) { const k = ((i / 8 + t * 0.4) % 1); const y = lerp(1110, H, k * k), w = lerp(4, 30, k), h = lerp(10, 90, k); g.fillRect(540 - w / 2, y, w, h); } for (let i = 0; i < 5; i++) { const x = 120 + hash(i) * 200, y = 1150 + i * 30; g.fillStyle = '#7a8a3a'; circle(x, y, 20 + i * 4); g.fill(); circle(1080 - x, y + 20, 18 + i * 4); g.fill(); } if (o.km) label(o.km, 540, 1000, 80, GOLD); },
  moon: (o, p, t) => { g.fillStyle = '#0b0e1a'; g.fillRect(0, 0, W, H); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + hash(i) * 0.7})`; circle(hash(i * 3) * W, hash(i * 7) * 1150, 1.5 + hash(i * 5) * 2.5); g.fill(); } circle(820, 900, 90); inked('#3c8fc4', 6); g.fillStyle = '#2c8f45'; g.beginPath(); g.ellipse(800, 880, 40, 26, 0.4, 0, Math.PI * 2); g.fill(); g.fillStyle = '#b8b8b8'; g.beginPath(); g.moveTo(0, 1250); for (let x = 0; x <= W; x += 40) g.lineTo(x, 1250 + Math.sin(x / 120) * 20); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill(); for (let i = 0; i < 9; i++) { g.fillStyle = '#9a9a9a'; g.beginPath(); g.ellipse(hash(i) * W, 1350 + hash(i * 3) * 500, 40 + hash(i * 5) * 50, 14 + hash(i * 5) * 16, 0, 0, Math.PI * 2); g.fill(); }
    g.save(); g.translate(330, 1700); const s = 0.7; g.scale(s, s); rr(-90, -560, 180, 230, 50); inked('#f2f2f2', 8); rr(-80, -340, 160, 220, 40); inked('#f2f2f2', 8); circle(0, -650, 95); inked('#f2f2f2', 8); circle(0, -650, 65); inked('#d9a35c', 6); for (const sx of [-1, 1]) { rr(sx * 60 - 30, -140, 60, 150, 26); inked('#f2f2f2', 7); } rr(80, -540, 50, 180, 24); inked('#f2f2f2', 7); g.strokeStyle = '#bfc5cc'; g.lineWidth = 10; g.beginPath(); g.moveTo(110, -380); g.lineTo(200, -40); g.stroke(); g.restore();
    const q = (t * 0.25) % 1; lightBall(lerp(440, 1100, q), 1680 - Math.sin(q * Math.PI) * 900, 12); },
  lake: (o, p, t) => { const gr = g.createLinearGradient(0, 0, 0, 1100); gr.addColorStop(0, '#bfe3f5'); gr.addColorStop(1, '#e8f4fb'); g.fillStyle = gr; g.fillRect(0, 0, W, H); mountains(t, false); for (let i = 0; i < 10; i++) pine(30 + i * 115, 1150, 0.8); sea(t, 1150, '#4aa3d8'); const bx = 560 + Math.sin(t * 0.6) * 20; isle(bx, 1330, 200, 70); yflag(bx + 30, 1320, t, 200); if (o.boat) { const q = (t * 0.3) % 1; const x = lerp(150, 400, q); g.save(); g.translate(x, 1600); g.beginPath(); g.moveTo(-90, 0); g.lineTo(90, 0); g.lineTo(60, 40); g.lineTo(-60, 40); g.closePath(); inked('#fff', 6); g.restore(); } },
  ocean: (o, p, t) => { sky(t); sea(t, 1020, '#1f7fb8'); g.fillStyle = '#86b874'; g.beginPath(); g.moveTo(0, 1500); g.quadraticCurveTo(200, 1420, 380, 1560); g.lineTo(380, H); g.lineTo(0, H); g.closePath(); inked('#86b874', 6); g.fillStyle = '#8a7a6a'; g.beginPath(); g.moveTo(560, 1260); g.quadraticCurveTo(700, 1160, 880, 1250); g.lineTo(860, 1330); g.quadraticCurveTo(720, 1360, 580, 1320); g.closePath(); inked('#8a7a6a', 6); isle(720, 1235, 110, 34, '#86c96c', false); yflag(740, 1235, t, 150); for (let i = 0; i < 6; i++) { const a = (t * 0.8 + i / 6) % 1; g.fillStyle = `rgba(255,255,255,${1 - a})`; circle(600 + i * 50, 1330 + a * 20, 10 + a * 20); g.fill(); } pine(120, 1520, 1); },
  condor: (o, p, t) => { background(t, { flagNum: '8' }); bird('condor', lerp(-250, 1300, (t * 0.15) % 1), 1050 + Math.sin(t * 2) * 40, 0.9, t * 3.5); const q = seg(p, 0.1, 0.8); lightBall(lerp(100, 900, q), 1700 - Math.sin(q * Math.PI) * 450, lerp(16, 8, q)); g.fillStyle = '#1a1a1a'; g.beginPath(); g.ellipse(900, 1700, 30, 10, 0, 0, Math.PI * 2); g.fill(); yflag(904, 1696, t, 180); },
};
SC.pl = (o, p, lt, t) => {
  LAND[o.land](o, p, t);
  if (o.fig) person(o.fig === 'chema' ? CHEMA : BETO, o.fx ?? 220, o.fy ?? 1800, o.fs ?? 0.5, POSE[o.pose || 'wow'](t), t);
  if (o.flags) o.flags.forEach((f, i) => flagC(150 + i * 170, 1820, f[0], f[1]));
  if (o.items) board(o.title, o.items, p, o.cy || 700, o); else if (o.value) card(o.label, o.value, seg(p, 0.05, 1), o.cy || 680, o.col || GOLD);
  if (o.stamp) stampB(o.stamp, seg(p, 0.5, 1), o.scol || RED, o.sy || 960);
};
const LG = 'LUGARES INCREÍBLES DEL GOLF';
const MX = [['#006847', '#ffffff', '#c8102e'], false];
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  y01: { tag: LG, shots: [
    { type: 'pl', land: 'island', label: 'EL HOYO MÁS', value: 'TEMIDO' },
    { type: 'pl', land: 'island', label: 'TPC SAWGRASS · FLORIDA', value: 'HOYO 17' },
    { type: 'pl', land: 'island', splash: true, label: 'SI FALLAS…', value: '¡AL AGUA!', col: '#5fb4e6' },
    { type: 'pl', land: 'island', balls: true, label: 'PELOTAS AL AÑO', value: '+100,000', col: RED },
    cta('¿LE PEGAS AL GREEN?', '¡A LA PRIMERA!', 'AL AGUA SEGURO')] },
  y02: { tag: LG, shots: [
    { type: 'pl', land: 'gate', label: 'NI CON TODO EL DINERO', value: 'NO PUEDES JUGAR' },
    { type: 'pl', land: 'gate', label: 'LA CASA DEL MASTERS', value: 'AUGUSTA', col: '#f5d020' },
    { type: 'pl', land: 'gate', fig: 'beto', pose: 'sad', label: 'SOLO CON INVITACIÓN', value: 'DE UN SOCIO', col: '#2c8f45' },
    { type: 'pl', land: 'gate', label: 'SOCIOS · SE DICE', value: '~300', stamp: 'SECRETO', scol: '#1f6b3a' },
    cta('¿TE GUSTARÍA IR?', '¡OBVIO!', 'PREFIERO MI CLUB')] },
  y03: { tag: LG, shots: [
    { type: 'pl', land: 'mountain', label: 'EL CAMPO MÁS', value: 'ALTO DEL MUNDO' },
    { type: 'pl', land: 'mountain', alt: true, label: 'HIMALAYA · INDIA', value: '3,970 m' },
    { type: 'pl', land: 'mountain', label: 'SE LLAMA', value: 'YAK GOLF COURSE', col: '#fff' },
    { type: 'pl', land: 'mountain', fig: 'beto', pose: 'sad', label: 'LA BOLA VUELA MÁS…', value: 'TÚ TE CANSAS', col: RED },
    cta('¿JUGARÍAS AHÍ?', 'SÍ, CON OXÍGENO', 'NI LOCO')] },
  y04: { tag: LG, shots: [
    { type: 'pl', land: 'longhole', label: 'UN HOYO DE', value: '~900 m' },
    { type: 'pl', land: 'longhole', label: 'SATSUKI · JAPÓN', value: 'PAR 7', col: RED },
    { type: 'pl', land: 'longhole', label: 'DEL TEE AL GREEN', value: '~900 m' },
    { type: 'pl', land: 'longhole', fig: 'beto', pose: 'wow', label: 'NECESITAS', value: '3+ GOLPES' },
    cta('¿CUÁNTOS HARÍAS?', 'MENOS DE 8', 'MEJOR NI LE CUENTO')] },
  y05: { tag: LG, shots: [
    { type: 'pl', land: 'border', clocks: true, label: 'LE PEGAS HOY…', value: '¡Y CAE AYER!' },
    { type: 'pl', land: 'border', label: 'FRONTERA', value: 'FINLANDIA-SUECIA', col: '#5fb4e6' },
    { type: 'pl', land: 'border', label: 'CADA PAÍS', value: 'OTRA HORA' },
    { type: 'pl', land: 'border', clocks: true, label: 'SALE A UNA HORA…', value: '¡CAE ANTES!', col: RED },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  y06: { tag: LG, shots: [
    { type: 'pl', land: 'road', km: '1,365 km', label: 'EL CAMPO MÁS', value: 'LARGO DEL MUNDO' },
    { type: 'pl', land: 'road', label: 'AUSTRALIA', value: 'NULLARBOR LINKS', col: '#f3b36b' },
    { type: 'pl', land: 'road', label: '18 HOYOS EN', value: 'EL DESIERTO' },
    { type: 'pl', land: 'road', km: 'HOYO → AUTO → HOYO', label: 'JUEGAS, MANEJAS…', value: 'Y JUEGAS' },
    cta('¿HARÍAS EL VIAJE?', '¡ROAD TRIP!', 'MUY LEJOS')] },
  y07: { tag: LG, shots: [
    { type: 'pl', land: 'moon', label: 'ALGUIEN JUGÓ GOLF EN', value: 'LA LUNA' },
    { type: 'pl', land: 'moon', label: 'APOLO 14 · 1971', value: 'ALAN SHEPARD', col: '#fff' },
    { type: 'pl', land: 'moon', label: 'LLEVÓ ESCONDIDA LA', value: 'CABEZA DE UN PALO' },
    { type: 'pl', land: 'moon', label: 'POCA GRAVEDAD', value: '¡MILLAS!', col: RED },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  y08: { tag: LG, shots: [
    { type: 'pl', land: 'lake', label: 'UN GREEN QUE', value: 'FLOTA' },
    { type: 'pl', land: 'lake', label: 'IDAHO · EE. UU.', value: "COEUR D'ALENE", col: '#5fb4e6' },
    { type: 'pl', land: 'lake', label: 'CADA DÍA', value: 'SE MUEVE' },
    { type: 'pl', land: 'lake', boat: true, label: 'PARA PATEAR', value: 'EN LANCHA' },
    cta('¿TE SUBIRÍAS?', '¡CLARO!', 'ME MAREO')] },
  y09: { tag: LG, shots: [
    { type: 'pl', land: 'condor', label: 'EL HOYO EN UNO MÁS LARGO', value: '+470 m' },
    { type: 'pl', land: 'condor', label: 'DENVER · 2002', value: 'MIKE CREAN', col: '#fff' },
    { type: 'pl', land: 'condor', label: 'EN UN PAR 5 =', value: '¡CÓNDOR!' },
    { type: 'pl', land: 'condor', fig: 'beto', pose: 'wow', label: 'LA ALTURA', value: 'AYUDÓ', col: '#5fb4e6' },
    cta('¿LO SABÍAS?', 'SÍ', 'NI IDEA')] },
  y10: { tag: LG, shots: [
    { type: 'pl', land: 'ocean', flags: [MX], label: 'EN MÉXICO HAY UN GREEN', value: 'EN EL MAR' },
    { type: 'pl', land: 'ocean', label: 'PUNTA MITA · NAYARIT', value: 'COLA DE BALLENA', col: '#2c8f45' },
    { type: 'pl', land: 'ocean', label: 'EN UNA ROCA DEL', value: 'PACÍFICO', col: '#5fb4e6' },
    { type: 'pl', land: 'ocean', label: 'CON MAREA ALTA', value: 'TE LLEVAN', col: '#fff' },
    cta('¿YA LO CONOCÍAS?', '¡SÍ!', 'QUIERO IR')] },
});
