const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + __dirname + '/notif.html');
  const mode = process.argv[2];
  for (const k of process.argv.slice(3)) {
    await pg.evaluate(k => setSport(k), k);
    if (mode === 'still') { for (const t of [0.5, 4.0]) { await pg.evaluate(t => renderAt(t), t); await pg.screenshot({ path: `st_${k}_${t}.png` }); } continue; }
    const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','-','-ss',String((process.argv.indexOf(k)%5)*1.0),'-i',__dirname+'/../aura/aura.wav','-af','afade=t=in:d=0.05,afade=t=out:st=6.6:d=0.4','-t','7','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',`/home/user/Coins4us/videos/notif/notif_${k}.mp4`]);
    for (let i = 0; i < 210; i++) { await pg.evaluate(t => renderAt(t), i / 30); ff.stdin.write(await pg.screenshot({ type: 'jpeg', quality: 92 })); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('ok', k);
  }
  await b.close();
})();
