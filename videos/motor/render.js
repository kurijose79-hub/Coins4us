const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');
const ROOT = __dirname;
const [, , id, mode = 'full', arg] = process.argv;
const timing = JSON.parse(fs.readFileSync(path.join(ROOT, 'timing.json')))[id];
const srv = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  const ext = path.extname(f); res.writeHead(200, { 'Content-Type': ext === '.js' ? 'text/javascript' : ext === '.html' ? 'text/html' : 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
(async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 400, height: 800 } });
  page.on('console', m => { if (m.type() === 'error') console.error('PAGE:', m.text()); });
  page.on('pageerror', e => console.error('PAGEERR:', e.message));
  await page.goto(`http://127.0.0.1:${port}/${/^c0[1-9]$/.test(id) ? 'c2dpage.html' : /^h0[1-9]$/.test(id) ? 'h2dpage.html' : /^a0[1-9]$/.test(id) ? 'a2dpage.html' : /^b(0\d|10)$/.test(id) ? 'b2dpage.html' : /^t(0\d|10)$/.test(id) ? 't2dpage.html' : /^t1[1-5]$/.test(id) ? 'page.html' : id.startsWith('f1') ? 'f1page.html' : (id === 'g2d' || id === 'dad') ? 'g2dpage.html' : (id === 'g3d' || id === 'g3x') ? 'g3dpage.html' : 'page.html'}`);
  await page.waitForFunction(() => window.ready && window.initEngine);
  const total = timing.dur + 0.8;
  await page.evaluate(async ({ id, timing, total }) => { const c = window.CONFIGS[id]; if (window.COVERS && window.COVERS[id]) c.cover = window.COVERS[id]; c.segs = timing.segs; c.total = total; await window.initEngine(c); }, { id, timing, total });
  const FPS = 30;
  if (mode === 'stills') {
    const times = arg ? arg.split(',').map(Number) : timing.segs.map(s => s.start + (s.end - s.start) * 0.7);
    fs.mkdirSync(path.join(ROOT, 'stills'), { recursive: true });
    for (const t of times) {
      const d = await page.evaluate(t => window.renderAt(t), t);
      fs.writeFileSync(path.join(ROOT, 'stills', `${id}_${t.toFixed(2)}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
    }
  } else {
    const N = Math.ceil(total * FPS);
    fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', path.join(ROOT, 'out', `${id}_video.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = 0; f < N; f++) {
      const d = await page.evaluate(t => window.renderAt(t), f / FPS);
      const buf = Buffer.from(d.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log(id, f, '/', N, ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close(); srv.close();
  console.log('done', id);
})().catch(e => { console.error(e); process.exit(1); });
