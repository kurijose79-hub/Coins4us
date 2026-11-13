cd "$(dirname "$0")/stills"; k=$1
ls ${k}_*.jpg | sort -t_ -k2 -n > l.txt; n=$(wc -l < l.txt)
lay=""; for i in $(seq 0 $((n-1))); do x=$(( (i%5)*432 )); y=$(( (i/5)*768 )); lay="$lay${lay:+|}${x}_${y}"; done
ffmpeg -y -loglevel error $(for f in $(cat l.txt); do echo -i $f; done) -filter_complex "$(for i in $(seq 0 $((n-1))); do echo -n "[$i]scale=432:768[s$i];"; done)$(for i in $(seq 0 $((n-1))); do echo -n "[s$i]"; done)xstack=inputs=$n:layout=$lay:fill=black" ../sheet_$k.jpg
