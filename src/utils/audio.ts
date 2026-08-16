// Simple audio synthesizer for prototype SFX

let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

export const playPopSound = (pitchMultiplier: number = 1) => {
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  // Increase pitch for higher combos
  oscillator.frequency.setValueAtTime(440 * pitchMultiplier, audioCtx.currentTime); 
  oscillator.frequency.exponentialRampToValueAtTime(880 * pitchMultiplier, audioCtx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
};

export const playDropSound = () => {
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
};
