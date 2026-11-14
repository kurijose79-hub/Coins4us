#!/bin/bash
cd "$(dirname "$0")"
V=/home/user/Coins4us/videos/lugares; mkdir -p $V
run() { k=$1; out=$V/$k.mp4; [ -s $out ] && { echo "skip $k"; return; }
  node render.js $k full > log_$k.txt 2>&1 && ffmpeg -y -loglevel error -i out/${k}_video.mp4 -i audio/$k.mp3 -filter_complex "[1:a]apad,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v libx264 -crf 22 -maxrate 9M -bufsize 18M -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart $out.tmp.mp4 && mv $out.tmp.mp4 $out && echo "muxed $k $(date +%T)"; }
Q=(y01 y02 y03 y04 y05 y06 y07 y08 y09 y10)
for ((i=0;i<${#Q[@]};i+=3)); do for k in ${Q[@]:i:3}; do run $k & done; wait; done
echo Y_DONE
