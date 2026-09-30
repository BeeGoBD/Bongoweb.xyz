// Soft, pleasant tick/click sound synthesizer using Web Audio API
// Subtle, professional, zero external assets, instant response across all devices

let audioCtx: AudioContext | null = null;

export function playClickSound() {
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    if (!audioCtx) {
      audioCtx = new AudioCtxClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Soft, crisp subtle mechanical tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.025);

    // Ultra-low, comfortable subtle volume
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.025);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.026);
  } catch {
    // Graceful fallback if audio is not permitted by user gesture
  }
}

// Global click event listener to automatically produce the soft click sound on all interactive buttons/options
export function initGlobalClickSound() {
  if (typeof window === 'undefined') return;

  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const clickable = target.closest(
      'button, a, input[type="radio"], input[type="checkbox"], select, [role="button"], [data-clickable]'
    );

    if (clickable) {
      playClickSound();
    }
  };

  window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
}
