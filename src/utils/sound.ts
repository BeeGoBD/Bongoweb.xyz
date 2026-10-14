// Soft, pleasant tick/click & mechanical keyboard sound synthesizer using Web Audio API
// Subtle, professional, zero external assets, instant response across all devices

let audioCtx: AudioContext | null = null;
let soundMuted: boolean = false;

function getAudioContext(): AudioContext | null {
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioCtxClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  } catch {
    return null;
  }
}

export function isAudioMuted(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bongoweb_audio_muted');
    if (stored !== null) return stored === 'true';
  }
  return soundMuted;
}

export function setAudioMuted(muted: boolean): void {
  soundMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('bongoweb_audio_muted', String(muted));
  }
}

export function toggleAudioMuted(): boolean {
  const next = !isAudioMuted();
  setAudioMuted(next);
  return next;
}

/**
 * Global button click sound
 */
export function playClickSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Soft, crisp subtle mechanical tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.025);

    // Ultra-low, comfortable subtle volume
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.026);
  } catch {
    // Graceful fallback
  }
}

/**
 * Realistic mechanical keyboard keystroke sound for typewriter effect
 */
export function playKeyboardTypeSound(options?: { isSpace?: boolean; volume?: number }) {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const isSpace = options?.isSpace ?? false;
    const baseVolume = options?.volume ?? 0.07;

    // Organic key jitter: each key has a slightly different pitch
    const pitchJitter = 0.90 + Math.random() * 0.20;

    // 1. High-frequency crisp key switch click
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();

    const startFreq = isSpace ? 950 * pitchJitter : 1900 * pitchJitter;
    const endFreq = isSpace ? 350 * pitchJitter : 720 * pitchJitter;

    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(startFreq, now);
    oscClick.frequency.exponentialRampToValueAtTime(endFreq, now + 0.022);

    gainClick.gain.setValueAtTime(baseVolume, now);
    gainClick.gain.exponentialRampToValueAtTime(0.0001, now + 0.023);

    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);

    oscClick.start(now);
    oscClick.stop(now + 0.024);

    // 2. Low-frequency plastic keycap bottom-out thud
    const oscThud = ctx.createOscillator();
    const gainThud = ctx.createGain();

    const thudFreq = isSpace ? 130 : 210 * pitchJitter;
    oscThud.type = 'sine';
    oscThud.frequency.setValueAtTime(thudFreq, now);
    oscThud.frequency.exponentialRampToValueAtTime(75, now + 0.032);

    gainThud.gain.setValueAtTime(baseVolume * 0.65, now);
    gainThud.gain.exponentialRampToValueAtTime(0.0001, now + 0.033);

    oscThud.connect(gainThud);
    gainThud.connect(ctx.destination);

    oscThud.start(now);
    oscThud.stop(now + 0.034);
  } catch {
    // Graceful fallback
  }
}

/**
 * Soft chime for step transitions
 */
export function playStepSwooshSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  } catch {}
}

/**
 * Celebration chime when all 4 steps finish and grid reveals
 */
export function playAllStepsCelebrationSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    });
  } catch {}
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
