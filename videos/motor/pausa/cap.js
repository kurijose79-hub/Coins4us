const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + __dirname + '/page.html');
  const mode = process.argv[2];
  for (const k of process.argv.slice(3)) {
    await pg.evaluate(k => setSport(k), k);
    if (mode === 'still') { for (const t of [0.5, 0.3]) { await pg.evaluate(t => renderAt(t), t); await pg.screenshot({ path: `st_${k}_${t}.png` }); } continue; }
    const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','-','-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-shortest','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart',`/home/user/Coins4us/videos/pausa/v2_pausa_${k}.mp4`]);
    for (let i = 0; i < 60; i++) { await pg.evaluate(t => renderAt(t), i / 30); ff.stdin.write(await pg.screenshot({ type: 'jpeg', quality: 92 })); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('ok', k);
  }
  await b.close();
})();
