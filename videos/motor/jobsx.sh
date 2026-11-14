#!/bin/bash
cd "$(dirname "$0")"
V=/home/user/Coins4us/videos/porque; mkdir -p $V
run() { k=$1; out=$V/$k.mp4; [ -s $out ] && { echo "skip $k"; return; }
  node render.js $k full > log_$k.txt 2>&1 && ffmpeg -y -loglevel error -i out/${k}_video.mp4 -i audio/$k.mp3 -i audio/${k}_bed.wav -filter_complex "[1:a]volume=1.0,apad,asplit=2[v][vs];[2:a]volume=0.6[b];[b][vs]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[bd];[bd][v]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v libx264 -crf 22 -maxrate 9M -bufsize 18M -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart $out.tmp.mp4 && mv $out.tmp.mp4 $out && echo "muxed $k $(date +%T)"; }
Q=($(seq -f "x%02g" 1 20))
for ((i=0;i<${#Q[@]};i+=3)); do for k in ${Q[@]:i:3}; do run $k & done; wait; done
echo X_DONE
