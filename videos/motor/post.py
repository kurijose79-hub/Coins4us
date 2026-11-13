import subprocess, os, json
D = '/home/user/Coins4us/videos'
order = [('soc1_mundial2022','FINAL MUNDIAL 2022'),('nfl1_superbowl51','SUPER BOWL 28-3'),('soc3_estambul2005','MILAGRO DE ESTAMBUL'),
 ('nfl2_la_atrapada','LA ATRAPADA 1982'),('soc2_champions1999','CHAMPIONS 1999'),('nfl3_helmet_catch','EL BALON EN EL CASCO'),
 ('f1_choque_grosjean_bahrein2020','28 SEG EN EL FUEGO'),('f1_abu_dabi_2021_final','ABU DABI 2021'),('f1_como_nacio_la_formula1','COMO NACIO LA F1')]
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
os.makedirs(D + '/final', exist_ok=True)
for i, (name, _) in enumerate(order):
    src = f'{D}/{name}.mp4'
    if not os.path.exists(src): print('missing', name); continue
    dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',src]))
    n = i + 1
    open(f'txt/b{n}.txt','w').write(f'PARTIDOS LEGENDARIOS  #{n}/9')
    nxt = f'MAÑANA  #{n+1}: {order[i+1][1]}' if n < 9 else 'SERIE COMPLETA - SIGUEME PARA MAS'
    open(f'txt/n{n}.txt','w').write(nxt)
    open(f'txt/s.txt','w').write('SIGUEME PARA NO PERDERTELO')
    t0 = dur - 2.9
    vf = (f"drawbox=x=(iw-640)/2:y=1388:w=640:h=64:color=black@0.65:t=fill,"
          f"drawtext=fontfile={F}:textfile=txt/b{n}.txt:fontsize=36:fontcolor=0xFFD400:x=(w-tw)/2:y=1404,"
          f"drawbox=x=60:y=1480:w=960:h=170:color=0xE10600@0.92:t=fill:enable='gte(t,{t0:.2f})',"
          f"drawtext=fontfile={F}:textfile=txt/n{n}.txt:fontsize=48:fontcolor=white:x=(w-tw)/2:y=1510:enable='gte(t,{t0:.2f})',"
          f"drawtext=fontfile={F}:textfile=txt/s.txt:fontsize=36:fontcolor=0xFFD400:x=(w-tw)/2:y=1590:enable='gte(t,{t0:.2f})'")
    out = f'{D}/final/{n:02d}_{name}.mp4'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-vf',vf,'-c:v','libx264','-crf','22','-maxrate','9M','-bufsize','18M','-preset','medium','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',out], check=True)
    print('ok', out)
