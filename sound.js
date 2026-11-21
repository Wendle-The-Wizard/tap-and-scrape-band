// Wendle's sounds: all made from noise and tiny oscillators, no sound files.
let audio = null;
let noiseBuf = null;

// Browsers only allow sound after a tap, so I make the audio context lazily.
function getAudio() {
  if (!audio) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio = new AC();
    // one second of white noise, reused by the scrapey sounds
    noiseBuf = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

// a short beep that drops in pitch, with a quick fade
function tone(a, t, type, f1, f2, dur, vol) {
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f1, t);
  o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

// filtered noise burst
function noise(a, t, ftype, freq, dur, vol, q) {
  const s = a.createBufferSource(); s.buffer = noiseBuf;
  const f = a.createBiquadFilter(); f.type = ftype; f.frequency.value = freq; f.Q.value = q || 1;
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(a.destination);
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}

const sounds = {
  Woodblock(a, t) { tone(a, t, 'square', 900, 700, 0.07, 0.25); noise(a, t, 'bandpass', 1500, 0.03, 0.2, 3); },
  Claves(a, t) { tone(a, t, 'sine', 2400, 2200, 0.12, 0.4); tone(a, t, 'triangle', 1200, 1100, 0.05, 0.2); },
  Guiro(a, t) {
    // a scrape is a few quick rasps in a row
    for (let i = 0; i < 6; i++) noise(a, t + i * 0.025, 'bandpass', 3500 + i * 150, 0.02, 0.35, 4);
  },
  Triangle(a, t) {
    tone(a, t, 'sine', 3520, 3500, 0.9, 0.18);
    tone(a, t, 'sine', 5300, 5280, 0.6, 0.1);
  },
  Shaker(a, t) { noise(a, t, 'highpass', 6000, 0.12, 0.3, 0.7); }
};

function playSound(name) {
  const a = getAudio();
  if (!a || !sounds[name]) return;
  sounds[name](a, a.currentTime + 0.01);
}
