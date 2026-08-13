import React from "react";
import {
  AbsoluteFill,
  Composition,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

/**
 * Florida Green Improvements — hero background loop.
 *
 * The previous version of this was a single still under an ffmpeg zoompan,
 * which the client correctly called "a shaking image". A move applied to one
 * photograph is not a video: nothing enters, nothing leaves, and the eye reads
 * the drift as a wobble because there is no cut to reset it.
 *
 * This is a three-shot sequence with cross-dissolves, a different camera move
 * per shot, and a light sweep that travels across the frame independently of
 * the images. That last part matters most — it is the only element that is not
 * derived from the stills, and it is what makes the result read as footage
 * rather than as a slideshow.
 *
 * ── SEAMLESS LOOP ──────────────────────────────────────────────────────────
 * Every animated quantity is a function of the CIRCULAR distance from the
 * frame to a fixed point on the timeline, so every quantity has period
 * TOTAL_FRAMES by construction. Frame 0 and frame TOTAL are therefore
 * identical without a hand-tuned "return to start" keyframe, and the loop
 * point cannot drift if the timings are edited later.
 *
 * The dissolves are LINEAR rather than eased. Two eased opacity curves do not
 * sum to 1 across a crossfade, which shows up as a visible brightness dip at
 * the midpoint of every transition. Linear pairs sum to exactly 1.
 */

const FPS = 30;
const SHOT = 150; // 5s of screen time per shot
const FADE = 45; // 1.5s dissolve
const TOTAL = SHOT * 3; // 450 frames = 15s

type Move = {
  src: string;
  /** scale at the start and end of the shot's own window */
  scale: [number, number];
  /** percentage translate at start and end */
  x: [number, number];
  y: [number, number];
};

const SHOTS: Move[] = [
  // Push in, very slightly rising — the establishing shot.
  { src: "shot-1.jpg", scale: [1.14, 1.03], x: [0, 0], y: [1.5, -1.5] },
  // Lateral drift with almost no scale change, so it reads as a dolly rather
  // than a zoom and breaks up the rhythm of the first shot.
  { src: "shot-2.jpg", scale: [1.07, 1.07], x: [-3.2, 3.2], y: [0, 0] },
  // Pull back out, which hands the eye back to shot 1's wide start.
  { src: "shot-3.jpg", scale: [1.03, 1.13], x: [1.2, -1.2], y: [-1, 1] },
];

/** Signed distance from `frame` to `center` on a circle of circumference TOTAL. */
const circularDelta = (frame: number, center: number, total: number) => {
  let d = (frame - center) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
};

const Shot: React.FC<{ shot: Move; index: number }> = ({ shot, index }) => {
  const frame = useCurrentFrame();
  const s = circularDelta(frame, index * SHOT, TOTAL);
  const half = SHOT / 2;

  // Linear crossfade: full opacity until FADE/2 before the slot edge, zero
  // FADE/2 after it. Adjacent shots' ramps sum to 1 at every frame.
  const opacity = interpolate(
    Math.abs(s),
    [half - FADE / 2, half + FADE / 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (opacity <= 0) return null;

  // t runs -0.5 → +0.5 across the shot's own slot. Eased so the move settles
  // rather than tracking at a constant rate, which is the other half of why
  // a raw zoompan looks mechanical.
  const t = interpolate(s, [-half - FADE / 2, half + FADE / 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.37, 0, 0.63, 1),
  });

  const scale = interpolate(t, [0, 1], shot.scale);
  const x = interpolate(t, [0, 1], shot.x);
  const y = interpolate(t, [0, 1], shot.y);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(shot.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${x}%, ${y}%)`,
          // Rendering hint only — Remotion renders offline, but this keeps the
          // Studio preview from resampling on every frame.
          willChange: "transform",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * A soft highlight that travels across the frame on its own cycle, plus a very
 * slight exposure breath. Neither is tied to a shot boundary, so the frame is
 * never completely static even at the middle of a hold.
 */
const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = (frame / TOTAL) * Math.PI * 2;
  const cx = 50 + 34 * Math.sin(phase);
  const cy = 40 + 10 * Math.cos(phase * 2);
  const strength = 0.1 + 0.05 * (0.5 + 0.5 * Math.cos(phase));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 70% at ${cx}% ${cy}%, rgba(255,252,240,${strength}) 0%, rgba(255,252,240,0) 70%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

/** Corner falloff, breathing on the same period. Keeps the eye centred. */
const Vignette: React.FC = () => {
  const frame = useCurrentFrame();
  const a = 0.16 + 0.04 * Math.sin((frame / TOTAL) * Math.PI * 2);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(78% 78% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${a}) 100%)`,
      }}
    />
  );
};

export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const brightness = 1 + 0.018 * Math.sin(phase);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF8" }}>
      <AbsoluteFill style={{ filter: `brightness(${brightness}) saturate(1.04)` }}>
        {SHOTS.map((shot, i) => (
          <Shot key={shot.src} shot={shot} index={i} />
        ))}
      </AbsoluteFill>
      <LightSweep />
      <Vignette />
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="HeroLoop"
      component={HeroLoop}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
