# Hero background video

Remotion source for `public/atmosphere/hero.{webm,mp4}` — the looping
background on the homepage hero.

## Why this exists

The first version of this video was an `ffmpeg zoompan` slow zoom on a single
still. The client's verdict was accurate: *"just a shaking image, not a real
video."* A move applied to one photograph is not footage — nothing enters,
nothing leaves, and with no cut to reset the eye the drift reads as a wobble.

This is a three-shot sequence with cross-dissolves, a different camera move per
shot, and a light sweep that travels independently of the images. Measured
frame-to-frame change across the loop is **49–60** mean per channel; the old
zoom was in the low teens.

## Reproducing

```bash
cd video
npm i
cp ../public/atmosphere/hero-luxury.jpg    public/shot-1.jpg
cp ../public/atmosphere/windows-hero.jpg   public/shot-2.jpg
cp ../public/atmosphere/free-estimate.jpg  public/shot-3.jpg

npx remotion studio            # preview
npx remotion render HeroLoop out/master.mp4 --codec=h264 --crf=16
```

Then the two web encodes. Render the master at high quality and transcode
down — encoding straight to the delivery bitrate wastes the dissolves:

```bash
cd out
ffmpeg -y -i master.mp4 -vf "scale=1600:900,fps=24" \
  -c:v libx264 -profile:v high -crf 32 -preset veryslow \
  -pix_fmt yuv420p -movflags +faststart -an hero.mp4

ffmpeg -y -i master.mp4 -vf "scale=1600:900,fps=24" \
  -c:v libvpx-vp9 -crf 48 -b:v 0 -row-mt 1 -cpu-used 1 \
  -pix_fmt yuv420p -an hero.webm
```

`1600×900 @ 24fps` is deliberate. This is a soft background behind a scrim, not
detail-critical footage; at 1920×1080/30 the same quality costs roughly 3× the
bytes for no visible gain. Current: **VP9 1,147 KB · H.264 1,340 KB**.

## Constraints anything replacing this must meet

1. **It must loop seamlessly.** Every animated value in `Composition.tsx` is a
   function of the *circular* distance from the frame to a fixed point, so all
   of them have period `TOTAL` by construction and frame 0 equals frame N. Do
   not replace that with hand-placed keyframes — the seam will drift the moment
   a timing is edited.
2. **The dissolves must stay linear.** Two eased opacity curves do not sum to 1
   across a crossfade, which shows as a brightness dip at every transition.
3. **Every shot must survive the hero scrim.** Charcoal type sits over the
   middle of this video. Score any new photograph the way the others were
   scored (see PROJECT_LOG) — it needs a veil alpha at or under **0.84**, which
   is where the hero's centred ellipse peaks. The three current shots measure
   0.61–0.63.
4. **Keep it under ~1.5 MB per encode.** It is deferred until after `load`, but
   it still competes for bandwidth on the connection that is already this
   site's weakest metric.
