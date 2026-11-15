#!/bin/bash
# uso: mk.sh N archivo_entrada salida
cd "$(dirname "$0")"; N=$1; IN=$2; OUT=$3; V=../v/audio/r$N.mp3; F=/usr/share/fonts/truetype/dejavu
VF="drawbox=x=70:y=1470:w=940:h=210:color=white@0.95:t=fill,drawbox=x=70:y=1470:w=14:h=210:color=0xffd400@1:t=fill,drawtext=fontfile=$F/DejaVuSans.ttf:textfile=h$N.txt:x=110:y=1500:fontsize=40:fontcolor=0x555555,drawtext=fontfile=$F/DejaVuSans-Bold.ttf:textfile=c$N.txt:x=110:y=1570:fontsize=40:fontcolor=0x111111"
if [ -s $V ]; then
  VD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $V); ID=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $IN)
  PAD=$(python3 -c "print(max(0,$VD+0.6-$ID))")
  ffmpeg -y -loglevel error -i $IN -i $V -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=$PAD,$VF[v];[0:a]apad,volume=0.30[b];[1:a]adelay=300|300,apad[n];[b][n]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[v]" -map "[a]" -t $(python3 -c "print(max($ID,$VD+0.6))") -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $OUT
else
  ffmpeg -y -loglevel error -i $IN -vf "$VF" -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart $OUT
fi
echo done $OUT
