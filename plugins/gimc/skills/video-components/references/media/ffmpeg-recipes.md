# Tested ffmpeg recipes (GIMC)

GIMC's own recipes for preparing reel files before the build, tested with the starter. They fill gaps the adopted
media files leave. Raw material in `assets-src/`, finished files in `assets/`; check each result with
`ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate:format=duration <file>`.

## B-roll: H.264, yuv420p, 1080 × 1920, 30 fps, no sound

```sh
ffmpeg -ss 12.0 -i assets-src/clip.mov -t 3.2 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p,setsar=1" \
  -c:v libx264 -preset slow -crf 18 -an -movflags +faststart assets/broll-1.mp4
```

- `-t` = the beat's `seconds` + 0.2 s: a video that ends early goes blank.
- **HDR** (most phones: `color_transfer` is `smpte2084` or `arib-std-b67`): one HDR clip turns the whole render HDR.
  With zscale (`ffmpeg -filters | grep zscale`) prepend
  `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,`;
  without it, add `--sdr` to the render.

## 16:9 to 9:16 with a chosen framing

```sh
ffmpeg -i assets-src/wide.mp4 -vf "crop=ih*9/16:ih:(iw-ow)*0.30:0,scale=1080:1920,fps=30,format=yuv420p,setsar=1" \
  -c:v libx264 -preset slow -crf 18 -an -movflags +faststart assets/broll-2.mp4
```

The factor runs from `0` (left) to `1` (right). A 1920 × 1080 source gives a 608 px crop scaled 1.78×: soft; check
a still at 100 %.

## Green screen to VP9 alpha

Sample the key colour from a real frame; raise the similarity 0.10 in steps of 0.02 until the edge is clean:

```sh
ffmpeg -i assets-src/green.mp4 -vf "chromakey=0x00b140:0.10:0.05,despill=type=green,format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -crf 24 -b:v 0 -auto-alt-ref 0 -an assets-src/cutout.webm
```

## Alpha video to PNG frames (presenter beat)

Force the libvpx decoder: FFmpeg's own VP9 decoder drops the alpha and writes opaque `rgb24` frames.

```sh
mkdir -p assets/frames/av01
ffmpeg -c:v libvpx-vp9 -i assets-src/cutout.webm -vf "fps=24,crop=ih*9/16:ih" assets/frames/av01/%04d.png
ffprobe -v error -show_entries stream=pix_fmt -of csv=p=0 assets/frames/av01/0001.png   # must print rgba
```

The take's own sound as voiceover: `ffmpeg -i assets-src/take.mp4 -vn -ac 1 -ar 48000 assets-src/vo.wav`.

## Transcript to `props.captions`

Transcribe the clean voice, never the mix; then convert seconds to milliseconds and drop non-words:

```sh
ffmpeg -i assets-src/take.m4a -ac 1 -ar 48000 -af "highpass=f=80" assets/voiceover.wav
npx hyperframes@0.9.61 transcribe assets/voiceover.wav --model small --language nl
node -e 'const r=require("./assets/transcript.json"),w=Array.isArray(r)?r:r.words;console.log(JSON.stringify(w.filter(x=>x.text.trim()&&!/^[♪�]+$/.test(x.text.trim())).map(x=>({text:x.text.trim(),startMs:Math.round(x.start*1000),endMs:Math.round(x.end*1000)}))))'
```

## One mix file: voice, ducked bed, one effect

The starter has one sound track (`voiceover`), so bake music and effects into one file and keep `voiceover.wav`
for transcription:

```sh
D=7.5   # the reel's length: the root data-duration
ffmpeg -i assets/voiceover.wav -i assets-src/music.mp3 -i assets-src/whoosh.wav -filter_complex "\
[0:a]aformat=sample_rates=48000:channel_layouts=stereo,apad=whole_dur=$D,asplit=2[vo][key];\
[1:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:$D,volume=-18dB,afade=t=in:d=0.5,afade=t=out:st=$(echo "$D-1.5"|bc):d=1.5[bed];\
[bed][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];\
[2:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=2000:all=1,volume=-9dB[sfx];\
[vo][duck][sfx]amix=inputs=3:duration=first:normalize=0[mix]" -map "[mix]" -c:a pcm_s16le assets-src/premix.wav
```

`apad` makes the mix as long as the reel, so the end card has sound; `adelay` (ms) puts the effect on its cut.
Then normalise in two passes to −14 LUFS ([operations.md](operations.md), Publish loudness), writing `assets/mix.wav`.

## Subtle grade in the B-roll chain

- `eq=brightness=0.02:contrast=1.04:saturation=1.03`: brightness within ±0.05, contrast and saturation 0.95–1.08.
- A LUT at 20–40 %: `split[a][b];[b]lut3d=file=look.cube:interp=tetrahedral[g];[a][g]blend=all_mode=normal:all_opacity=0.3`.
