// "De 14 a Augusta" — serie de ficción en estilo 2dbuena (usa golf2d.js)
const BETO = { shirt: RED, pants: '#c9b48a' };
const CHEMA = { shirt: '#fbfbfb', pants: '#fbfbfb', cap: '#1f6b3a', capLogo: '#f2b632', skin: '#9a6744' };
const COMP = [{ shirt: '#3c8fc4', pants: '#4a4f57', cap: '#22301f', capLogo: '#fff', skin: '#c98d62', must: '#3a2618' }, { shirt: GOLD, pants: '#6b5a44', cap: '#d8322b', capLogo: '#fff', skin: '#e2a87c' }];
const AG = '#1f6b3a', AZ = ['#e5479a', '#f27fb8', '#d63384'];
const PARS = [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4];
const STROKES = [6, 7, 5, 4, 4, 4, 5, 6, 4, 5, 5, 4, 6, 5, 6, 4, 4, 3];
const sum = (a, n0, n1) => a.slice(n0, n1).reduce((x, y) => x + y, 0);

function mustache(x, y, s, col, jump = 0) { g.fillStyle = col; const hy = y + jump - 620 * s; g.beginPath(); g.ellipse(x - 16 * s, hy, 24 * s, 10 * s, 0.15, 0, Math.PI * 2); g.ellipse(x + 16 * s, hy, 24 * s, 10 * s, -0.15, 0, Math.PI * 2); g.fill(); }
function person(who, x, y, s, base, t) { const P = Object.assign({}, who, base); golfer(x, y, s, P, t); if (who.must) mustache(x, y, s, who.must, P.jump || 0); }
function chema(x, y, s, base, t) { const P = Object.assign({}, CHEMA, base); golfer(x, y, s, P, t);
  const j = P.jump || 0; g.save(); g.translate(x, y + j); g.scale(s, s); rr(-60, -520, 120, 130, 14); inked('#fff', 5); g.fillStyle = AG; g.font = 'bold 30px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CHEMA', 0, -485); g.font = 'bold 44px DejaVu Sans'; g.fillText('14', 0, -430); g.restore();
  mustache(x, y, s, '#d9d9d9', j); }
function pine(x, y, s) { g.fillStyle = '#5b4632'; g.fillRect(x - 7 * s, y - 40 * s, 14 * s, 50 * s); for (let i = 0; i < 4; i++) { const w = (70 - i * 13) * s, yy = y - 30 * s - i * 45 * s; g.beginPath(); g.moveTo(x - w, yy); g.lineTo(x, yy - 80 * s); g.lineTo(x + w, yy); g.closePath(); g.fillStyle = i % 2 ? '#24553a' : '#2d6544'; g.fill(); } }
function yflag(x, y, t, h = 110) { g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h); g.stroke(); g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + 62, y - h + 18 + Math.sin(t * 5) * 4); g.lineTo(x, y - h + 38); g.closePath(); inked('#f5d020', 4); }
function augBg(t, o = {}) {
  background(t, { noFlag: true });
  for (let i = 0; i < 10; i++) pine(30 + i * 115 + (i % 2) * 25, 1105 - (i % 3) * 12, 0.75 + hash(i) * 0.5);
  if (o.water) { // arroyo Rae's Creek
    g.fillStyle = '#9fd487'; g.beginPath(); g.ellipse(760, 1140, 190, 30, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
    g.fillStyle = '#e8d9a8'; g.beginPath(); g.ellipse(590, 1158, 70, 16, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(0, 1190); for (let x = 0; x <= W; x += 30) g.lineTo(x, 1190 + Math.sin(x / 90 + t) * 8); for (let x = W; x >= 0; x -= 30) g.lineTo(x, 1285 + Math.sin(x / 70 + t * 1.3) * 10); g.closePath(); inked('#4aa3d8', 6);
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 4; for (let i = 0; i < 9; i++) { const x = ((i * 140 + t * 40) % 1200) - 60, y = 1215 + (i % 3) * 22; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 50, y); g.stroke(); }
    yflag(780, 1140, t);
  } else yflag(o.fx || 820, o.fy || 1125, t);
  for (let i = 0; i < 16; i++) { const x = hash(i + 7) * W, y = 1112 + hash(i + 3) * 26; g.fillStyle = AZ[i % 3]; circle(x, y, 22 + hash(i) * 20); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); }
}
function homeBg(t) {
  g.fillStyle = '#ecdcb9'; g.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 90) { g.fillStyle = 'rgba(160,120,60,0.08)'; g.fillRect(x, 0, 45, 1550); }
  rr(110, 640, 340, 420, 20); inked('#bfe3f5', 10); g.strokeStyle = INK; g.lineWidth = 10; g.beginPath(); g.moveTo(280, 640); g.lineTo(280, 1060); g.moveTo(110, 850); g.lineTo(450, 850); g.stroke();
  rr(640, 700, 300, 220, 12); inked('#f7efd8', 8); g.fillStyle = AG; g.fillRect(660, 720, 260, 180); g.fillStyle = '#fff'; g.font = 'bold 40px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('⛳ 14', 790, 810);
  g.fillStyle = '#b98a5a'; g.fillRect(0, 1550, W, H - 1550); g.strokeStyle = 'rgba(80,50,20,0.35)'; g.lineWidth = 4; for (let y = 1600; y < H; y += 70) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
}
function bg(o, t) { if (o.bg === 'home') homeBg(t); else if (o.bg === 'club') background(t, { flagNum: o.flag || '7' }); else augBg(t, o); }
function gallery(t) { const cols = ['#d8322b', '#3c8fc4', '#f2b632', '#ffffff', '#2c8f45', '#e5479a'];
  for (const side of [0, 1]) for (let i = 0; i < 9; i++) { const x = side ? 800 + i * 34 : 30 + i * 34, y = 1330 + (i % 3) * 40, c = cols[(i * 5 + side) % 6]; rr(x - 18, y, 36, 70, 12); inked(c, 4); circle(x, y - 10 + Math.sin(t * 3 + i) * 2, 17); inked('#e2a87c', 4); }
  g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 1440); g.lineTo(330, 1440); g.moveTo(760, 1440); g.lineTo(W, 1440); g.stroke(); }
function teeBox() { g.fillStyle = '#6aa85a'; g.beginPath(); g.ellipse(470, 1725, 330, 70, 0, 0, Math.PI * 2); g.fill(); }
function pill(txt, y, col = AG, fg = '#fff', fs = 46) { g.save(); g.font = `bold ${fs}px DejaVu Sans`; const w = g.measureText(txt).width + 70; rr(540 - w / 2, y - fs * 0.9, w, fs * 1.8, fs * 0.9); inked(col, 6); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 540, y + 2); g.restore(); }
function hud(o) { if (o.hole) pill(`HOYO ${o.hole} · PAR ${PARS[o.hole - 1]}`, 545); if (o.sc != null) pill(`GOLPES: ${o.sc}   ·   META: MENOS DE 90`, 1845, CREAM, INK, 38); }
function board(title, items, p, y = 800, o = {}) { const k = back(clamp(p * 3)); if (k <= 0) return; g.save(); g.translate(540, y); g.scale(k, k);
  const h = 170 + items.length * 105; rr(-450, -h / 2, 900, h, 40); inked(CREAM, 10); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = o.tcol || AG; g.font = 'bold 60px DejaVu Sans'; g.fillText(title, 0, -h / 2 + 75);
  items.forEach((it, i) => { const a = clamp((p - 0.15 - i * (o.gap || 0.15)) * 5); if (a <= 0) return; g.globalAlpha = a; const yy = -h / 2 + 175 + i * 105; let fs = 52; g.font = `bold ${fs}px DejaVu Sans`; while (g.measureText(it).width > 800 && fs > 30) { fs -= 2; g.font = `bold ${fs}px DejaVu Sans`; } g.fillStyle = (o.cols && o.cols[i]) || INK; g.fillText(it, 0, yy); g.globalAlpha = 1; });
  g.restore(); }
function bubble(txt, p, cx, cy, tx, ty) { const k = back(clamp(p * 3.5)); if (k <= 0) return; const n = Math.ceil(txt.length * clamp(p * 2.2)); const shown = txt.slice(0, n);
  g.save(); g.font = 'bold 62px DejaVu Sans'; const lines = []; let cur = ''; for (const w of txt.split(' ')) { if ((cur + ' ' + w).trim().length > 20) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; } lines.push(cur.trim());
  const bw = Math.max(...lines.map(l => g.measureText(l).width)) + 100, bh = lines.length * 76 + 70;
  g.translate(cx, cy); g.scale(k, k); g.beginPath(); g.moveTo(-40, bh / 2 - 10); g.lineTo((tx - cx) / k, (ty - cy) / k); g.lineTo(40, bh / 2 - 10); g.closePath(); inked('#fff', 8);
  rr(-bw / 2, -bh / 2, bw, bh, 50); inked('#fff', 8); g.fillStyle = '#fff'; g.fillRect(-36, bh / 2 - 20, 72, 16);
  let left = shown.length; g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; lines.forEach((l, i) => { const s = l.slice(0, Math.max(0, left)); left -= l.length + 1; g.fillText(s, 0, -bh / 2 + 70 + i * 76); }); g.restore(); }
function cart(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
  for (const wx of [-170, 150]) { circle(wx, -10, 52); inked('#2b2b2b', 6); circle(wx, -10, 20); inked('#bfc5cc', 4); }
  rr(-250, -160, 500, 120, 30); inked('#f7f7f2', 8); rr(-120, -280, 170, 130, 20); inked('#3b6e9e', 7); g.lineWidth = 10; g.strokeStyle = INK; g.beginPath(); g.moveTo(-200, -160); g.lineTo(-190, -430); g.moveTo(190, -160); g.lineTo(180, -430); g.stroke(); rr(-240, -470, 470, 50, 18); inked('#2c8f45', 7); g.restore(); }
function stampB(txt, prog, col = RED, y = 760) { const k = back(clamp(prog * 2.5)); if (k <= 0) return; g.save(); g.translate(540, y); g.rotate(-0.1); g.scale(k, k); let fs = 110; g.font = `bold ${fs}px DejaVu Sans`; while (g.measureText(txt).width > 760 && fs > 50) { fs -= 4; g.font = `bold ${fs}px DejaVu Sans`; } const w = g.measureText(txt).width + 90; rr(-w / 2, -fs * 0.85, w, fs * 1.7, 30); g.fillStyle = 'rgba(255,250,235,0.92)'; g.fill(); g.lineWidth = 14; g.strokeStyle = col; g.stroke(); g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 6); g.restore(); }
function lightBall(x, y, r) { circle(x, y, r); inked('#fff', Math.max(2, r * 0.3)); }

// ---------- escenas ----------
SC.aBeto = (o, p, lt, t) => {
  bg(o, t); if (o.crowd) gallery(t); if (o.tee) teeBox();
  if (o.wind) { const dir = Math.sin(t * 1.7) > 0 ? 1 : -1; g.save(); g.globalAlpha = 0.8; for (let i = 0; i < 5; i++) { const y = 640 + i * 70 + 380, x = ((t * 400 * dir + i * 260) % 1300 + 1300) % 1300 - 110; g.strokeStyle = '#fff'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 60 * dir, y - 30, x + 120 * dir, y); g.stroke(); } g.restore(); }
  if (o.bag) { const bx = (o.x ?? 540) + 250; g.save(); g.translate(bx, 1720); g.rotate(0.12); for (let i = 0; i < 4; i++) { g.strokeStyle = INK; g.lineWidth = 12; g.beginPath(); g.moveTo(-30 + i * 20, -330); g.lineTo(-40 + i * 26, -430); g.stroke(); rr(-56 + i * 26, -450, 36, 24, 8); inked('#9aa2ab', 4); } rr(-70, -340, 140, 340, 30); inked('#8a5a3a', 8); rr(-40, -230, 50, 50, 8); inked('#c9b48a', 5); rr(10, -130, 44, 44, 8); inked('#6b8f5a', 5); g.restore(); }
  if (o.comp) { person(COMP[0], 200, 1760, 0.6, Object.assign(POSE.idle(t), { head: Math.sin(t * 11) * 0.08 }), t); person(COMP[1], 880, 1760, 0.6, Object.assign(POSE.idle(t), { head: Math.cos(t * 11) * 0.08 }), t); }
  if (o.chema) chema(820, 1720, 0.68, POSE[o.cpose || 'idle'](t), t);
  const pose = Object.assign({}, POSE[o.pose || 'idle'](t)); if (o.shake) { pose.rA1 = (pose.rA1 ?? 0.25) + Math.sin(t * 40) * 0.08; pose.lA1 = (pose.lA1 ?? -0.25) + Math.cos(t * 43) * 0.08; }
  person(BETO, o.chema ? 320 : (o.x ?? 540), 1720, o.s ?? 0.78, pose, t);
  if (o.confetti) confetti2d(t, p);
  if (o.items) board(o.title, o.items, p, o.cy || 830, o); else if (o.value) card(o.label, o.value, p, o.cy || 800, o.col || GOLD);
  if (o.say) bubble(o.say, p, 540, 840, 560, 1080);
  if (o.stamp) stampB(o.stamp, seg(p, 0.45, 1), o.scol || RED, o.sy || 1080);
  hud(o);
};
SC.aLetter = (o, p, lt, t) => {
  homeBg(t); const drop = o.open ? 1 : back(seg(p, 0, 0.35)); const ey = lerp(-300, 1250, drop);
  const fl = o.open ? clamp(seg(p, 0, 0.25) + (o.wasOpen ? 1 : 0)) : 0; const lq = o.open ? ease(clamp(seg(p, 0.15, 0.5) + (o.wasOpen ? 1 : 0))) : 0; const ey2 = ey + lq * 470;
  if (fl > 0.5) { g.save(); g.translate(540, ey2); g.beginPath(); g.moveTo(-380, -230); g.lineTo(0, lerp(220, -480, fl) - 230); g.lineTo(380, -230); g.closePath(); inked('#e8d4a6', 7); g.restore(); }
  // carta
  if (lq > 0) { const ly = lerp(1250, 880, lq), ls = lerp(0.6, 0.9, lq); g.save(); g.translate(540, ly); g.scale(ls, ls); rr(-360, -420, 720, 840, 30); inked('#fffaf0', 8); g.lineWidth = 6; g.strokeStyle = AG; rr(-330, -390, 660, 780, 20); g.stroke();
    const L = o.lines || []; g.textAlign = 'center'; g.textBaseline = 'middle'; L.forEach(([txt, sz, col], i) => { const a = clamp((p - 0.35 - i * 0.07) * 6) + (o.wasOpen ? 1 : 0); if (a <= 0) return; g.globalAlpha = clamp(a); g.fillStyle = col || INK; g.font = `bold ${sz}px DejaVu Sans`; g.fillText(txt, 0, -300 + i * 120); });
    g.globalAlpha = 1; g.restore(); }
  // sobre
  g.save(); g.translate(540, ey2); rr(-380, -230, 760, 460, 24); inked('#f2e2bb', 8);
  g.beginPath(); g.moveTo(-380, 230); g.lineTo(0, 10); g.lineTo(380, 230); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  if (fl <= 0.5) { g.beginPath(); g.moveTo(-380, -230); g.lineTo(0, lerp(220, -480, fl) - 230); g.lineTo(380, -230); g.closePath(); inked('#f2e2bb', 7); }
  if (fl < 0.5) { circle(0, lerp(-10, -230, fl * 2), 50); inked('#b8322b', 6); g.fillStyle = '#fff'; g.font = 'bold 50px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('A', 0, lerp(-8, -228, fl * 2)); }
  g.restore();
  if (!o.open) { g.save(); g.fillStyle = INK; g.font = 'bold 54px DejaVu Sans'; g.textAlign = 'center'; g.globalAlpha = clamp((p - 0.35) * 4); g.fillText('PARA: BETO', 540, ey + 140); g.restore(); }
  person(BETO, 900, 1880, 0.48, POSE[o.open ? 'wow' : 'point'](t), t);
  if (o.mystery) { g.save(); g.font = 'bold 120px DejaVu Sans'; g.textAlign = 'center'; for (let i = 0; i < 5; i++) { g.globalAlpha = 0.85 * clamp((p - 0.1 * i) * 4); g.fillStyle = [GOLD, RED, '#3c8fc4', AG, '#e5479a'][i]; g.lineWidth = 10; g.strokeStyle = INK; const x = [140, 930, 120, 960, 520][i], y = [560, 600, 1480, 1450, 1750][i] + Math.sin(t * 3 + i) * 15; g.strokeText('?', x, y); g.fillText('?', x, y); } g.restore(); }
  if (o.stamp) stampB(o.stamp, seg(p, 0.55, 1), o.scol || RED, o.sy || 1330);
};
SC.aWash = (o, p, lt, t) => {
  background(t, { flagNum: '7' }); cart(640, 1700, 1.0, t);
  const sx = 600 + Math.cos(t * 6) * 70, sy = 1580 + Math.sin(t * 6) * 40;
  person(BETO, 280, 1760, 0.7, { rA1: 0.25, rA2: 0.1, lA1: -1.3 - Math.cos(t * 6) * 0.25, lA2: 0.2, face: 'sad', head: 0.1 }, t);
  rr(sx - 45, sy - 30, 90, 60, 14); inked('#f5d020', 6);
  for (let i = 0; i < 18; i++) { const age = (t * 0.7 + hash(i)) % 1; const bx = 520 + hash(i * 3) * 300 + Math.sin(t * 2 + i) * 20, by = 1620 - age * 500; g.globalAlpha = 1 - age; circle(bx, by, 14 + hash(i * 7) * 18); g.fillStyle = 'rgba(220,240,255,0.7)'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#7fb3d8'; g.stroke(); g.globalAlpha = 1; }
  card(o.label, o.value, p, 800, o.col || '#5fb4e6');
};
SC.aTee = (o, p, lt, t) => {
  bg(o, t); if (o.crowd) gallery(t); teeBox();
  const gx = 430, gy = 1720, s = 0.72, P0 = 0.03, P1 = 0.36, imp = P0 + 0.62 * (P1 - P0);
  const bx = gx + 66, by = gy - 6;
  person(BETO, gx, gy, s, swingPose(seg(p, P0, P1)), t);
  let pos = null, r = 14; const out = o.out;
  if (p < imp) pos = [bx, by];
  else if (out === 'top') { const q = easeOut(seg(p, imp, imp + 0.4)); pos = [bx + q * 430, by - Math.abs(Math.sin(q * 14)) * 22 * (1 - q)]; }
  else { const tgt = { good: [560, 1150], green: o.water ? [780, 1140] : [800, 1125], water: [600, 1240] }[out]; const q = seg(p, imp, imp + 0.4); const e = easeOut(q);
    pos = [lerp(bx, tgt[0], e), lerp(by, tgt[1], e) - Math.sin(Math.min(1, e) * Math.PI) * (out === 'water' ? 520 : 620)]; r = lerp(14, 4, e);
    g.save(); g.setLineDash([8, 14]); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5; g.beginPath(); for (let k = 0; k <= 20; k++) { const ee = e * k / 20; const xx = lerp(bx, tgt[0], ee), yy = lerp(by, tgt[1], ee) - Math.sin(ee * Math.PI) * (out === 'water' ? 520 : 620); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore();
    if (out === 'water' && q >= 1) { pos = null; const a = seg(p, imp + 0.4, imp + 0.75); for (let k = 0; k < 3; k++) { g.strokeStyle = `rgba(255,255,255,${1 - a})`; g.lineWidth = 5; g.beginPath(); g.ellipse(600, 1240, 20 + a * (60 + k * 40), 6 + a * (14 + k * 8), 0, 0, Math.PI * 2); g.stroke(); }
      for (let k = 0; k < 14; k++) { const ang = -Math.PI * (0.15 + 0.7 * hash(k)), sp = 120 + hash(k * 5) * 160; const x = 600 + Math.cos(ang) * sp * a, y = 1240 + Math.sin(ang) * sp * a * 1.4 + a * a * 260; if (a > 0 && a < 1) { circle(x, y, 9); g.fillStyle = '#bfe3f5'; g.fill(); } } } }
  if (pos) lightBall(pos[0], pos[1], r);
  if (o.stamp) stampB(o.stamp, seg(p, 0.6, 1), o.scol || RED, o.sy || 820);
  hud(o);
};
SC.aCaddie = (o, p, lt, t) => {
  bg(o, t); if (o.crowd) gallery(t);
  const cx = o.walk ? lerp(1250, 780, easeOut(seg(p, 0, 0.4))) : 780; const walking = o.walk && p < 0.4;
  person(BETO, 300, 1720, 0.72, POSE[o.bpose || 'idle'](t), t);
  chema(cx, 1720, 0.72, walking ? { legL: Math.sin(t * 10) * 0.35, legR: -Math.sin(t * 10) * 0.35, rA1: 0.25, lA1: -0.25 } : POSE[o.cpose || 'point'](t), t);
  if (o.value) card(o.label, o.value, seg(p, 0.35, 1), 820, o.col || '#fff');
  if (o.say) bubble(o.say, seg(p, 0.05, 1), 540, 820, cx - 40, 1170);
  if (o.stamp) stampB(o.stamp, seg(p, 0.5, 1), o.scol || AG, o.sy || 1080);
  hud(o);
};
SC.aCall = (o, p, lt, t) => {
  augBg(t, o); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 0, W, H);
  const k = back(clamp(p * 4)); g.save(); g.translate(540, 1170); g.scale(k, k); g.translate(-540, -1170);
  rr(220, 560, 640, 1160, 80); inked('#1d1d1f', 10); rr(250, 620, 580, 1040, 46); g.fillStyle = '#2b3a4a'; g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 34px DejaVu Sans'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('LOS COMPADRES', 290, 670); g.fillStyle = RED; circle(745, 670, 10); g.fill(); g.fillStyle = '#fff'; g.fillText('VIVO', 762, 670);
  [0, 1].forEach(i => { const ty = 710 + i * 470; g.save(); rr(265, ty, 550, 450, 30); g.clip(); g.fillStyle = i ? '#4a6378' : '#3d5568'; g.fillRect(265, ty, 550, 450);
    if (o.wash && i === 1) { cart(560, ty + 430, 0.75, t); const sx = 520 + Math.cos(t * 6) * 60; rr(sx - 35, ty + 270, 70, 46, 12); inked('#f5d020', 5); }
    else { const laugh = o.mood === 'laugh'; person(COMP[i], 540, ty + 830, 0.92, { rA1: 0.3, lA1: -0.3, head: laugh ? Math.sin(t * 12 + i) * 0.12 : 0, face: o.mood === 'quiet' ? 'wow' : undefined, jump: laugh ? -Math.abs(Math.sin(t * 9 + i)) * 14 : 0 }, t); }
    g.restore(); rr(265, ty, 550, 450, 30); g.lineWidth = 6; g.strokeStyle = '#111'; g.stroke(); });
  g.restore();
  (o.msgs || []).forEach((m, i) => { const a = back(clamp((p - 0.2 - i * 0.18) * 4)); if (a <= 0) return; g.save(); g.translate(i % 2 ? 700 : 380, 1520 - i * 150); g.scale(a, a); g.font = 'bold 50px DejaVu Sans'; const w = g.measureText(m).width + 70; rr(-w / 2, -50, w, 100, 40); inked(i % 2 ? '#2c8f45' : '#ffffff', 6); g.fillStyle = i % 2 ? '#fff' : INK; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(m, 0, 2); g.restore(); });
  hud(o);
};
SC.aPutt = (o, p, lt, t) => {
  augBg(t, {}); g.save(); g.beginPath(); g.ellipse(540, 1560, 760, 560, 0, 0, Math.PI * 2); g.fillStyle = '#86c96c'; g.fill(); g.clip(); for (let i = -6; i < 8; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'; g.beginPath(); g.moveTo(540 + i * 90, 1000); g.lineTo(540 + (i + 1) * 90, 1000); g.lineTo(540 + (i + 1) * 260, H); g.lineTo(540 + i * 260, H); g.fill(); } g.restore();
  g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.ellipse(540, 1560, 760, 560, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  if (o.glass) { for (let i = 0; i < 6; i++) { const a = (t * 0.8 + i / 6) % 1; g.save(); g.globalAlpha = Math.sin(a * Math.PI) * 0.9; g.translate(200 + hash(i) * 680, 1150 + hash(i * 3) * 600); g.rotate(0.785); g.fillStyle = '#fff'; g.fillRect(-4, -26, 8, 52); g.fillRect(-26, -4, 52, 8); g.restore(); } }
  const hx = o.hx ?? 560, hy = o.hy ?? 1200; g.fillStyle = '#1a1a1a'; g.beginPath(); g.ellipse(hx, hy, 30, 11, 0, 0, Math.PI * 2); g.fill(); yflag(hx + 4, hy - 4, t, 300);
  if (o.slope) { for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) { const a = ((t * 0.5 + j / 7) % 1); const x = 260 + i * 190 + a * 120, y = 1020 + a * 760 + i * 20; const al = Math.sin(a * Math.PI); g.save(); g.globalAlpha = al * 0.9; g.fillStyle = '#4aa3d8'; g.beginPath(); g.moveTo(x, y - 14); g.quadraticCurveTo(x + 11, y + 4, x, y + 10); g.quadraticCurveTo(x - 11, y + 4, x, y - 14); g.fill(); g.restore(); } }
  const sx = o.bx ?? 500, sy = o.by ?? 1700; const brk = o.brk ?? 140; let ex = hx, ey = hy; if (o.out === 'miss') { ex = hx + 70; ey = 1050; }
  const rq = o.after ? 1 : easeOut(seg(p, 0.1, o.out === 'make' ? 0.62 : 0.7)); const cxp = (sx + ex) / 2 + brk, cyp = (sy + ey) / 2;
  const bAt = q => [(1 - q) ** 2 * sx + 2 * (1 - q) * q * cxp + q * q * ex, (1 - q) ** 2 * sy + 2 * (1 - q) * q * cyp + q * q * ey];
  if (o.dist) { g.save(); g.setLineDash([16, 16]); g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); for (let k = 0; k <= 30; k++) { const [x, y] = bAt(k / 30); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore(); const [mx, my] = bAt(0.5); g.save(); g.font = 'bold 64px DejaVu Sans'; g.textAlign = 'center'; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText(o.dist, mx + 130, my); g.fillStyle = '#fff'; g.fillText(o.dist, mx + 130, my); g.restore(); }
  const [x, y] = bAt(rq); const r = lerp(8, 20, clamp((y - 1050) / 700)); if (!(o.out === 'make' && rq >= 0.999)) lightBall(x, y, r);
  if (o.out === 'make' && rq >= 0.999) { const a = seg(p, 0.62, 0.9); for (let k = 0; k < 2; k++) { g.strokeStyle = `rgba(255,255,255,${1 - a})`; g.lineWidth = 6; g.beginPath(); g.ellipse(hx, hy, 30 + a * (80 + k * 50), 11 + a * (26 + k * 16), 0, 0, Math.PI * 2); g.stroke(); } }
  if (o.stamp) stampB(o.stamp, seg(p, o.sAt ?? 0.6, 1), o.scol || RED, o.sy || 820);
  hud(o);
};
SC.aScore = (o, p, lt, t) => {
  augBg(t, {}); if (o.confetti) confetti2d(t, p);
  const k = back(clamp(p * 3)); g.save(); g.translate(540, 1020); g.scale(k, k);
  rr(-470, -360, 940, 720, 40); inked(CREAM, 10); g.fillStyle = AG; rr(-470, -360, 940, 100, 40); g.fill(); g.fillRect(-470, -300, 940, 40);
  g.fillStyle = '#fff'; g.font = 'bold 50px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TARJETA · AUGUSTA', 0, -305);
  const shown = n => n < (o.from ?? 0) || n < (o.from ?? 0) + Math.ceil(((o.upto) - (o.from ?? 0)) * clamp(seg(p, 0.15, 0.6)));
  for (let row = 0; row < 2; row++) for (let c = 0; c < 9; c++) { const n = row * 9 + c, x = -420 + c * 93, y = -200 + row * 230;
    g.fillStyle = INK; g.font = 'bold 32px DejaVu Sans'; g.fillText(String(n + 1), x + 42, y); g.fillStyle = '#7a7a7a'; g.font = 'bold 26px DejaVu Sans'; g.fillText('P' + PARS[n], x + 42, y + 36);
    rr(x, y + 60, 84, 84, 14); const vis = n < o.upto && shown(n); const d = STROKES[n] - PARS[n];
    g.fillStyle = !vis ? '#fff' : d < 0 ? GOLD : d === 0 ? '#bfe3a8' : d === 1 ? '#fff' : '#f6c4c4'; g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
    if (vis) { g.fillStyle = INK; g.font = 'bold 50px DejaVu Sans'; g.fillText(String(STROKES[n]), x + 42, y + 104); } }
  const tot = sum(STROKES, 0, o.upto); g.fillStyle = INK; g.font = 'bold 46px DejaVu Sans'; g.textAlign = 'left'; g.fillText(o.upto >= 9 ? `IDA: ${sum(STROKES, 0, 9)}` : ' ', -420, 260); g.textAlign = 'right'; g.fillText(`META: 89`, 420, 260);
  g.restore();
  card(o.label || 'TOTAL', o.value || String(tot), seg(p, 0.55, 1), 1560, o.col || (tot < 90 && o.upto === 18 ? GOLD : '#fff'));
  if (o.stamp) stampB(o.stamp, seg(p, 0.65, 1), o.scol || AG, o.sy || 700);
};
SC.aNote = (o, p, lt, t) => {
  augBg(t, {}); g.save(); g.globalAlpha = 1 - seg(p, 0, 0.3); chema(780, 1720, 0.72, POSE.thumbs(t), t); g.restore();
  g.fillStyle = CHEMA.cap; g.beginPath(); g.ellipse(780, 1700, 70, 22, 0, Math.PI, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(780, 1696, 54, 40, 0, Math.PI, Math.PI * 2); g.closePath(); inked(CHEMA.cap, 6);
  person(BETO, 300, 1720, 0.72, POSE[p < 0.3 ? 'cheer' : 'wow'](t), t);
  const k = back(seg(p, 0.35, 0.6)); if (k > 0) { g.save(); g.translate(540, 900); g.scale(k, k); g.rotate(-0.04); rr(-400, -230, 800, 460, 16); inked('#fffaf0', 8); g.strokeStyle = 'rgba(60,120,200,0.25)'; g.lineWidth = 3; for (let y = -150; y < 220; y += 60) { g.beginPath(); g.moveTo(-360, y); g.lineTo(360, y); g.stroke(); }
    g.fillStyle = '#1b3f8f'; g.font = 'italic bold 76px DejaVu Serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; const txt = 'Te dije que podías.'; g.fillText(txt.slice(0, Math.ceil(txt.length * seg(p, 0.45, 0.85))), 0, -40); g.font = 'italic 54px DejaVu Serif'; if (p > 0.85) g.fillText('— Don Chema', 120, 110); g.restore(); }
};
SC.aNext = (o, p, lt, t) => {
  augBg(t, {}); g.fillStyle = 'rgba(20,40,25,0.35)'; g.fillRect(0, 0, W, H);
  person(BETO, 540, 1800, 0.6, POSE.thumbs(t), t);
  card(o.label, o.value, p, 780, o.col || GOLD);
  const k = back(clamp((p - 0.3) * 3)); if (k > 0) { const pu = 1 + Math.sin(t * 8) * 0.04; g.save(); g.translate(540, 1110); g.scale(k * pu, k * pu); rr(-300, -75, 600, 150, 75); inked(RED, 8); g.fillStyle = '#fff'; g.font = 'bold 66px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.btn || 'SÍGUEME', 0, 4); g.restore(); }
};

// ---------- episodios ----------
const AT = n => `DE 14 A AUGUSTA · EPISODIO ${n}`;
const MAIL = [['INVITACIÓN', 72, AG], ['UNA RONDA EN', 50], ['AUGUSTA', 96, AG], ['GEORGIA', 50], ['15 DE ABRIL', 64, RED], ['REMITENTE: ???', 40, '#7a7a7a']];
window.CONFIGS = Object.assign(window.CONFIGS || {}, {
  a01: { tag: AT(1), shots: [
    { type: 'aBeto', bg: 'club', pose: 'open', label: 'ME LLAMO BETO · HÁNDICAP', value: '14' },
    { type: 'aBeto', bg: 'club', bag: true, x: 420, pose: 'thumbs', label: 'MIS PALOS', value: 'DE SEGUNDA MANO', col: '#c9b48a' },
    { type: 'aLetter', bg: 'home' },
    { type: 'aLetter', open: true, lines: MAIL },
    { type: 'aLetter', open: true, wasOpen: true, lines: MAIL, mystery: true, stamp: '¿QUIÉN?' },
    { type: 'aBeto', bg: 'club', comp: true, pose: 'sad', label: 'MIS COMPADRES', value: '¡NO TE CREO!', col: RED },
    { type: 'aBeto', bg: 'club', comp: true, pose: 'point', title: 'LA APUESTA', items: ['SI ROMPE 90 GOLPES…', 'CENA GRATIS 1 AÑO'], cols: [INK, AG] },
    { type: 'aWash', label: 'SI NO ROMPE 90…', value: '1 AÑO LAVANDO' },
    { type: 'aBeto', crowd: true, tee: true, shake: true, pose: 'idle', hole: 1, value: 'AUGUSTA', label: 'TRES SEMANAS DESPUÉS', col: '#f5d020' },
    { type: 'aBeto', crowd: true, tee: true, pose: 'wow', say: '¡EN EL TEE… BETO!' },
    { type: 'aNext', label: 'EPISODIO 2', value: 'EL PRIMER GOLPE' }] },
  a02: { tag: AT(2), shots: [
    { type: 'aBeto', crowd: true, tee: true, pose: 'idle', hole: 1, label: 'PRIMER TEE', value: 'HOYO 1', sc: 0 },
    { type: 'aBeto', crowd: true, tee: true, shake: true, pose: 'wow', label: 'PÚBLICO MIRANDO', value: 'NERVIOS', col: RED, sc: 0 },
    { type: 'aTee', crowd: true, out: 'top', hole: 1, sc: 1 },
    { type: 'aBeto', crowd: true, tee: true, pose: 'sad', label: 'RODÓ', value: '40 METROS', col: RED, stamp: 'COF, COF', scol: '#7a7a7a', sy: 1020, sc: 1 },
    { type: 'aCaddie', walk: true, bpose: 'sad', cpose: 'idle', label: 'MI CADDIE', value: 'DON CHEMA' },
    { type: 'aCaddie', cpose: 'point', say: 'SUELTA LOS BRAZOS… UNO… DOS' },
    { type: 'aTee', out: 'good', crowd: true, stamp: 'UNO… DOS', scol: AG, hole: 1, sc: 2 },
    { type: 'aScore', upto: 1, from: 0, label: 'HOYO 1', value: 'DOBLE BOGEY', col: '#f6c4c4' },
    { type: 'aCaddie', bpose: 'thumbs', cpose: 'thumbs', stamp: '¡SOBREVIVÍ!' },
    { type: 'aCaddie', bpose: 'idle', cpose: 'point', say: 'AHORA VIENE LO DIFÍCIL', hole: 5 },
    { type: 'aNext', label: 'EPISODIO 3', value: 'LOS GREENS' }] },
  a03: { tag: AT(3), shots: [
    { type: 'aCall', mood: 'laugh', msgs: ['+6 JAJAJA', '¿Y LA CENA?'], hole: 5 },
    { type: 'aTee', out: 'green', stamp: 'EN 2', scol: AG, hole: 5, sc: 24 },
    { type: 'aPutt', out: 'miss', brk: 60, glass: true, hole: 5 },
    { type: 'aPutt', out: 'miss', after: true, glass: true, stamp: '3 METROS', sAt: 0.2, hole: 5 },
    { type: 'aCaddie', cpose: 'point', say: 'SOLO DÉJALA CAER', hole: 5 },
    { type: 'aPutt', slope: true, out: 'none', after: false, bx: 600, by: 1120, hx: 520, hy: 1560, brk: -120, dist: '3 m', hole: 5 },
    { type: 'aPutt', out: 'make', bx: 620, by: 1100, hx: 520, hy: 1560, brk: -120, slope: true, stamp: '¡ADENTRO!', scol: AG, hole: 5 },
    { type: 'aScore', upto: 5, from: 4, label: 'HOYO 5', value: 'PAR', col: '#bfe3a8' },
    { type: 'aScore', upto: 9, from: 5, label: 'PARA ROMPER 90 NECESITA', value: '44 O MENOS', col: GOLD },
    { type: 'aBeto', water: true, pose: 'wow', label: 'LO QUE VENÍA', value: 'AMEN CORNER', col: '#f5d020' },
    { type: 'aNext', label: 'EPISODIO 4', value: 'EL AGUA', col: '#5fb4e6' }] },
  a04: { tag: AT(4), shots: [
    { type: 'aBeto', water: true, pose: 'idle', hole: 12, label: 'EL MÁS FAMOSO', value: 'HOYO 12', col: '#f5d020', sc: 55 },
    { type: 'aBeto', water: true, wind: true, pose: 'wow', label: 'ARROYO + VIENTO', value: '¿?', col: '#5fb4e6', hole: 12, sc: 55 },
    { type: 'aCaddie', water: true, cpose: 'point', say: 'UNO MÁS, MUCHACHO', hole: 12, sc: 55 },
    { type: 'aTee', water: true, out: 'water', stamp: '¡SPLASH!', scol: '#3c8fc4', hole: 12, sc: 56 },
    { type: 'aCall', water: true, wash: true, mood: 'laugh', msgs: ['VE PRACTICANDO', 'JAJAJA'], sc: 56 },
    { type: 'aCaddie', water: true, cpose: 'thumbs', bpose: 'sad', say: 'IMPORTA EL SIGUIENTE', hole: 12, sc: 57 },
    { type: 'aTee', water: true, out: 'green', stamp: 'CON CALMA', scol: AG, hole: 12, sc: 58 },
    { type: 'aPutt', out: 'make', bx: 500, by: 1600, hx: 560, hy: 1300, brk: 40, stamp: '2 METROS · ¡ADENTRO!', scol: AG, hole: 12, sc: 59 },
    { type: 'aScore', upto: 12, from: 9, label: 'HOYO 12', value: 'BOGEY', col: '#fff', stamp: 'SIN PÁNICO' },
    { type: 'aBeto', pose: 'point', label: 'FALTAN', value: '6 HOYOS', col: GOLD, sc: 59 },
    { type: 'aNext', label: 'EPISODIO 5', value: 'EL ÚLTIMO HOYO', col: RED }] },
  a05: { tag: AT(5), shots: [
    { type: 'aBeto', crowd: true, tee: true, pose: 'idle', hole: 18, label: 'EL ÚLTIMO', value: 'HOYO 18', col: '#f5d020', sc: 84 },
    { type: 'aScore', upto: 17, from: 12, label: 'NECESITA', value: '5 O MENOS', col: GOLD },
    { type: 'aCall', mood: 'quiet', msgs: ['…', '…'], sc: 84 },
    { type: 'aTee', crowd: true, out: 'good', stamp: 'UNO… DOS', scol: AG, hole: 18, sc: 85 },
    { type: 'aTee', crowd: true, out: 'green', stamp: '12 METROS', hole: 18, sc: 86 },
    { type: 'aPutt', slope: true, out: 'none', bx: 640, by: 1080, hx: 470, hy: 1640, brk: -200, dist: '12 m', hole: 18, sc: 86 },
    { type: 'aBeto', crowd: true, pose: 'idle', title: 'DON CHEMA', items: ['HOMBROS SUELTOS', 'DEJA CAER LA BOLA', 'IMPORTA EL SIGUIENTE'], gap: 0.18, sc: 86 },
    { type: 'aPutt', out: 'make', bx: 640, by: 1080, hx: 470, hy: 1640, brk: -200, slope: true, stamp: '¡ADENTRO!', scol: AG, sAt: 0.62, hole: 18, sc: 87 },
    { type: 'aScore', upto: 18, from: 17, label: '¡ROMPIÓ 90!', value: '87', confetti: true },
    { type: 'aNote' },
    { type: 'aNext', label: '¿QUIÉN MANDÓ LA CARTA?', value: 'TEMPORADA 2', btn: 'COMENTA ↓' }] },
});
