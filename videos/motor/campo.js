// Serie "Compré un campo de golf por $1" (2D buena). Escenas propias + contador abajo (CFG.hud2).
function woodSign(lines, x, y, s, p, col = '#b5793f') { const k = back(clamp(p * 3)); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(s * k, s * k);
  g.fillStyle = INK; g.fillRect(-14, 0, 28, 260); rr(-330, -200, 660, 230, 22); inked(col, 9);
  lines.forEach((ln, i) => { g.fillStyle = i === lines.length - 1 ? '#fff6d8' : '#2b1a0c'; g.font = `bold ${i === lines.length - 1 ? 84 : 56}px DejaVu Sans`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ln, 0, -150 + i * 78); }); g.restore(); }
function plaque(x, y, w, h, txt, hl) { rr(x - w / 2, y - h / 2, w, h, 10); inked(hl ? GOLD : '#d9b25a', 5); rr(x - w / 2 + 10, y - h / 2 + 10, w - 20, h - 20, 6); g.strokeStyle = 'rgba(80,50,10,0.5)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#3b2a10'; let fs = hl ? 34 : 26; g.font = `bold ${fs}px DejaVu Sans`; while (fs > 14 && g.measureText(txt).width > w - 34) { fs--; g.font = `bold ${fs}px DejaVu Sans`; } if (fs < 22) { let k = Math.max(txt.lastIndexOf('_', Math.ceil(txt.length / 2) + 3), txt.indexOf('_', 3)); if (k < 3) k = Math.ceil(txt.length / 2); const a = txt.slice(0, k), b = txt.slice(k); fs = hl ? 30 : 26; g.font = `bold ${fs}px DejaVu Sans`; while (fs > 14 && Math.max(g.measureText(a).width, g.measureText(b).width) > w - 34) { fs--; g.font = `bold ${fs}px DejaVu Sans`; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a, x, y - fs * 0.6); g.fillText(b, x, y + fs * 0.6); return; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, x, y); }
const GCP = {
  sign: (o, p, t) => { background(t, { flagNum: '1' }); woodSign(o.lines || ['CAMPO DE GOLF', 'VENDIDO:', '$1'], 540, 1130, 1, p); },
  contract: (o, p, t) => { background(t, { noFlag: true }); const k = back(clamp(p * 3)); g.save(); g.translate(540, 1150); g.rotate(-0.04); g.scale(k, k); rr(-330, -380, 660, 760, 16); inked('#fbf7ea', 8);
    g.fillStyle = INK; g.textAlign = 'center'; g.font = 'bold 50px DejaVu Sans'; g.fillText('CONTRATO', 0, -300); g.font = 'bold 40px DejaVu Sans';
    ['SI EN 30 DÍAS', 'NO HAY', '1,000 MIEMBROS…'].forEach((l, i) => g.fillText(l, 0, -180 + i * 70)); g.fillStyle = RED; g.font = 'bold 54px DejaVu Sans'; g.fillText('SE VUELVE', 0, 90); g.fillText('ESTACIONAMIENTO', 0, 160);
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-220, 300); g.quadraticCurveTo(-120, 250, 0, 300); g.quadraticCurveTo(100, 340, 220, 290); g.stroke(); g.restore(); },
  parking: (o, p, t) => { g.fillStyle = '#5b6066'; g.fillRect(0, 0, W, H); g.fillStyle = '#8fb8e0'; g.fillRect(0, 0, W, 760);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = 110 + c * 172, y = 900 + r * 220; g.strokeStyle = '#f2f2f2'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 80, y - 90); g.lineTo(x - 80, y + 90); g.stroke();
      if ((r * 6 + c) % 3 !== 1) { const col = ['#d8322b', '#3c6fd4', '#f2b632', '#2c8f45', '#eeeeee'][(r * 7 + c * 3) % 5]; rr(x - 55, y - 75, 110, 150, 22); inked(col, 6); rr(x - 40, y - 45, 80, 50, 10); inked('#bcd8ef', 4); } }
    woodSign(['PRÓXIMAMENTE', 'ESTACIONAMIENTO'], 540, 640, 0.95, p, '#9aa3ad'); },
  placas: (o, p, t) => { g.fillStyle = '#6b4a2b'; g.fillRect(0, 0, W, H); for (let i = 0; i < 18; i++) { g.fillStyle = i % 2 ? '#74512f' : '#664527'; g.fillRect(0, i * 110, W, 110); }
    const n = Math.floor(clamp(p * 1.4) * 12); for (let i = 0; i < 12; i++) { const c = i % 3, r = Math.floor(i / 3); const x = 220 + c * 320, y = 620 + r * 210; const show = i < n;
      g.save(); g.globalAlpha = show ? 1 : 0.25; const nm = o.names ? (o.names[i] || (i === o.names.length ? '@TÚ' : 'MIEMBRO #' + (i + 1))) : (i === 4 ? '@TÚ' : 'MIEMBRO #' + (i + 1)); plaque(x, y, 280, 150, nm, o.names ? (o.vip || []).includes(i) || nm === '@TÚ' : i === 4); g.restore(); }
    if (p > 0.6) stampB(o.stamp || '¡TU PLACA AQUÍ!', seg(p, 0.6, 1), RED, 1500); },
  meter: (o, p, t) => { background(t, { flagNum: '18' }); const v = o.val || 0, max = o.max || 1000, q = clamp(v / max) * easeOut(clamp(p * 2));
    g.save(); rr(100, 1050, 880, 110, 55); inked('#fbf7ea', 8); if (q > 0) { rr(110, 1060, Math.max(90, 860 * q), 90, 45); inked('#2c8f45', 0); } g.fillStyle = INK; g.font = 'bold 60px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${v} / ${max}`, 540, 1106); g.restore();
    label(o.txt || 'MIEMBROS', 540, 960, 64, GOLD); },
};
SC.gc = (o, p, lt, t) => { GCP[o.prop](o, p, t); if (o.fig) person(BETO, o.fx ?? 840, o.fy ?? 1600, o.fs ?? 0.42, POSE[o.pose || 'thumbs'](t), t);
  if (o.value) card(o.label, o.value, seg(p, 0.05, 1), o.cy || 620, o.col || GOLD); if (o.stamp) stampB(o.stamp, seg(p, 0.45, 1), o.scol || RED, o.sy || 1500); };
window.CONFIGS = Object.assign(window.CONFIGS || {}, { x27: { tag: 'SERIE ⛳ CAMPO DE $1 · PARTE 1', hud2: {miembros:'0/1000', dinero:'$0', dia:'1/30'}, shots: [{"type": "gc", "prop": "sign", "lines": ["CAMPO DE GOLF", "VENDIDO:", "$1"], "fig": 1, "pose": "cheer"}, {"type": "gc", "prop": "contract"}, {"type": "gc", "prop": "contract", "stamp": "30 DÍAS", "sy": 1560}, {"type": "gc", "prop": "parking"}, {"type": "gc", "prop": "meter", "val": 0, "max": 1000, "txt": "MIEMBROS", "fig": 1, "pose": "point"}, {"type": "gc", "prop": "placas"}, {"type": "gc", "prop": "sign", "lines": ["DÍA 1 DE 30", "¡AYÚDANOS!"], "fig": 1, "pose": "thumbs", "stamp": "PARTE 1", "sy": 500}] },
  x28: { tag: 'SERIE ⛳ CAMPO DE $1 · PARTE 2', hud2: {miembros:'6/1000', dinero:'$69', dia:'2/30'}, shots: [
    {"type": "gc", "prop": "sign", "lines": ["DÍA 2 DE 30", "FALTAN 994"], "fig": 1, "pose": "point", "stamp": "PARTE 2", "sy": 500},
    {"type": "gc", "prop": "meter", "val": 6, "max": 1000, "txt": "MIEMBROS", "fig": 1, "pose": "cheer"},
    {"type": "gc", "prop": "placas", "names": ["@ab_dululu707", "@r0d_ssj", "@jorge_espinoza_moncada_", "@viki2313.49", "@herreriafernandomota", "@giselaarguello370"], "stamp": "¡BIENVENIDOS!"},
    {"type": "gc", "prop": "placas", "names": ["@teodoro_cid", "@fabrizio_2804", "@ab_dululu707", "@r0d_ssj", "@jorge_espinoza_moncada_", "@viki2313.49", "@herreriafernandomota", "@giselaarguello370"], "vip": [0, 1, 2], "stamp": "PLACAS VIP DE ORO"},
    {"type": "gc", "prop": "sign", "lines": ["CON $69:", "GREEN NUEVO"], "fig": 1, "pose": "thumbs"},
    {"type": "gc", "prop": "parking"},
    {"type": "gc", "prop": "sign", "lines": ["SÍGUENOS = MIEMBRO", "COMENTA = TU PLACA"], "fig": 1, "pose": "thumbs", "stamp": "PARTE 3 MAÑANA", "sy": 500}] } });
