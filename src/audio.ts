import { useMultiplayerStore } from './store';
let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

export const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1, isBgm = false) => {
  const store = useMultiplayerStore.getState();
  const masterVol = isBgm ? (store.bgmVolume / 50) : (store.seVolume / 50);
  vol = vol * masterVol;
  if (vol <= 0.001) return; // Prevent zero or near-zero volume issues

  initAudio();
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const playSelect = () => playTone(660, 'sine', 0.1, 0.05);
export const playDrop = () => playTone(200, 'square', 0.15, 0.05);

export const playPop = () => {
  playTone(523.25, 'sine', 0.2, 0.1); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.3, 0.1), 100); // E5
}

export const playCombo = (combo: number) => {
  const baseFreq = 440 * Math.pow(1.05, combo * 2);
  playTone(baseFreq, 'sine', 0.3, 0.1);
  setTimeout(() => playTone(baseFreq * 1.5, 'sine', 0.4, 0.1), 100);
}

export const playSpecial = (type: string) => {
  initAudio();
  if (!audioCtx) return;
  if (type === 'gravity') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.6);
    const store = useMultiplayerStore.getState();
    const seVol = store.seVolume / 50;
    if (seVol <= 0.001) return;
    gain.gain.setValueAtTime(0.1 * seVol, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01 * seVol, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } else if (type === 'tornado') {
    playTone(300, 'sawtooth', 0.5, 0.1);
    setTimeout(() => playTone(400, 'sawtooth', 0.4, 0.1), 100);
    setTimeout(() => playTone(500, 'square', 0.3, 0.1), 200);
    setTimeout(() => playTone(600, 'triangle', 0.2, 0.1), 300);
  } else if (type === 'ojama') {
    playTone(150, 'sawtooth', 0.4, 0.1);
  } else if (type === 'chameleon') {
    playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(600, 'sine', 0.1, 0.1), 100);
    setTimeout(() => playTone(800, 'sine', 0.2, 0.1), 200);
  }
}

let bgmInterval: any = null;
let bgmStep = 0;

export const startBgm = () => {
  initAudio();
  if (bgmInterval) return;
  bgmStep = 0;
  
  // 4-note chords (7th chords) + Bass (longer 8-bar loop)
  const chords = [
    // 1. Cmaj7 (C5, E5, G5, B5)
    [523.25, 659.25, 783.99, 987.77],
    // 2. G7 (G4, B4, D5, F5)
    [392.00, 493.88, 587.33, 698.46],
    // 3. Am7 (A4, C5, E5, G5)
    [440.00, 523.25, 659.25, 783.99],
    // 4. Em7 (E4, G4, B4, D5)
    [329.63, 392.00, 493.88, 587.33],
    // 5. Fmaj7 (F4, A4, C5, E5)
    [349.23, 440.00, 523.25, 659.25],
    // 6. Cmaj7 (C5, E5, G5, B5)
    [523.25, 659.25, 783.99, 987.77],
    // 7. Dm7 (D5, F5, A5, C6)
    [587.33, 698.46, 880.00, 1046.50],
    // 8. G7 (D5, F5, G5, B5)
    [587.33, 698.46, 783.99, 987.77]
  ];
  
  const bass = [
    130.81, // C3
    98.00,  // G2
    110.00, // A2
    164.81, // E3
    87.31,  // F2
    130.81, // C3
    146.83, // D3
    98.00   // G2
  ];

  // We change chords every 4 steps (1 beat = 250ms, 1 bar = 4 beats = 1000ms)
  bgmInterval = setInterval(() => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    
    const bar = Math.floor((bgmStep / 4)) % chords.length;
    const currentChord = chords[bar];
    const currentBass = bass[bar];
    const beat = bgmStep % 4;
    
    // Play Bass (every beat)
    // On beat 1 and 3 play root, on 2 and 4 play octave higher
    const bassFreq = beat % 2 === 0 ? currentBass : currentBass * 2;
    playTone(bassFreq, 'triangle', 0.25, 0.05, true);
    
    // Play Chord (play on beats 1, 2, 3, 4 with rhythm)
    const vol = (beat === 0) ? 0.025 : 0.015;
    
    currentChord.forEach(freq => {
      playTone(freq, 'square', 0.15, vol, true);
    });
    
    // Arpeggio / Melody (Optional, to keep it lively)
    const melodyNote = currentChord[bgmStep % 4];
    playTone(melodyNote * 2, 'sine', 0.15, 0.02, true);
    
    bgmStep++;
  }, 250);
}

export const stopBgm = () => {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}
