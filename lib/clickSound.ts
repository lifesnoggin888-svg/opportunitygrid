// Synthesized UI click — a short glass-tap blip, no audio asset needed.
// Fires on any click of an interactive element site-wide.
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  return ctx;
}

export function playUiClick() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();

  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1180, now);
  osc.frequency.exponentialRampToValueAtTime(620, now + 0.055);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.1);

  const shimmer = audioCtx.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(2600, now);
  const shimmerGain = audioCtx.createGain();
  shimmerGain.gain.setValueAtTime(0, now);
  shimmerGain.gain.linearRampToValueAtTime(0.02, now + 0.003);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(audioCtx.destination);
  shimmer.start(now);
  shimmer.stop(now + 0.06);
}

export function attachGlobalClickSound() {
  if (typeof window === "undefined") return () => {};
  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const interactive = target.closest("a, button, [data-sound], [role='button']");
    if (!interactive) return;
    if (interactive.hasAttribute("data-no-sound")) return;
    playUiClick();
  };
  document.addEventListener("click", handler, { capture: true });
  return () => document.removeEventListener("click", handler, { capture: true });
}
