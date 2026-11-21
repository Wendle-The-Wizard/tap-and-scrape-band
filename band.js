// Wendle's band: step 3, every instrument now has a looping 16-step pattern.
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

// Each instrument is drawn centred at (0,0).
function drawWoodblock(c, col) {
  c.fillStyle = col;
  c.fillRect(-45, -25, 90, 50);
  c.fillStyle = '#00000055';
  c.fillRect(-30, -6, 60, 12);
}
function drawClaves(c, col) {
  c.fillStyle = col;
  for (const r of [-0.5, 0.5]) {
    c.save(); c.rotate(r); c.fillRect(-8, -50, 16, 100); c.restore();
  }
}
function drawGuiro(c, col) {
  c.fillStyle = col;
  c.beginPath(); c.ellipse(0, 0, 60, 28, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#00000066'; c.lineWidth = 3;
  for (let x = -40; x <= 40; x += 10) {
    c.beginPath(); c.moveTo(x, -18); c.lineTo(x, 18); c.stroke();
  }
}
function drawTriangle(c, col) {
  c.strokeStyle = col; c.lineWidth = 8; c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(0, -45); c.lineTo(45, 35); c.lineTo(-45, 35); c.closePath();
  c.stroke();
}
function drawShaker(c, col) {
  c.fillStyle = col;
  c.beginPath(); c.ellipse(0, -15, 28, 36, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#c99a5b';
  c.fillRect(-7, 18, 14, 40);
}

// Patterns: 16 steps, 'x' means play. Wendle's little grooves.
function pat(s) { return s.replace(/ /g, '').split('').map(ch => ch === 'x'); }
const instruments = [
  { name: 'Woodblock', color: '#e8a24a', draw: drawWoodblock, hit: 0, steps: pat('x...x...x...x.x.') },
  { name: 'Claves',    color: '#e86a6a', draw: drawClaves,    hit: 0, steps: pat('x..x..x...x..x..') },
  { name: 'Guiro',     color: '#7bd47b', draw: drawGuiro,     hit: 0, steps: pat('....x.......x..x') },
  { name: 'Triangle',  color: '#6ad0e8', draw: drawTriangle,  hit: 0, steps: pat('..x.......x.....') },
  { name: 'Shaker',    color: '#c58af0', draw: drawShaker,    hit: 0, steps: pat('.x.x.x.x.x.x.x.x') }
];

const SCALE = 1.1;
const STEPS = 16;
const BPM = 110;               // fixed for now, slider comes in step 5
const stepTime = 60 / BPM / 4; // sixteenth notes
let currentStep = -1;
let playing = false;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const slot = canvas.width / instruments.length;
  ctx.textAlign = 'center';
  ctx.font = '22px system-ui, sans-serif';
  instruments.forEach((inst, i) => {
    const x = slot * i + slot / 2;
    const s = SCALE * (1 + inst.hit * 0.2);
    ctx.save();
    ctx.translate(x, 100);
    ctx.scale(s, s);
    ctx.rotate(Math.sin(inst.hit * 20) * inst.hit * 0.15);
    if (inst.hit > 0.05) { ctx.shadowColor = inst.color; ctx.shadowBlur = 30 * inst.hit; }
    inst.draw(ctx, inst.color);
    ctx.restore();
    ctx.fillStyle = '#f3e9ff';
    ctx.fillText(inst.name, x, 190);

    // the pattern: a 4x4 grid of dots under each instrument
    for (let k = 0; k < STEPS; k++) {
      const gx = x - 45 + (k % 4) * 30;
      const gy = 230 + Math.floor(k / 4) * 32;
      const on = inst.steps[k];
      ctx.beginPath();
      ctx.arc(gx, gy, 11, 0, Math.PI * 2);
      ctx.fillStyle = on ? inst.color : '#00000044';
      ctx.fill();
      if (k === currentStep) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
      }
    }
  });
}

// fade the wobble out each frame, keep drawing while anything is moving
let animating = false;
function tick() {
  let busy = playing;
  for (const inst of instruments) {
    if (inst.hit > 0) { inst.hit = Math.max(0, inst.hit - 0.04); busy = true; }
  }
  render();
  if (busy) requestAnimationFrame(tick); else animating = false;
}
function kick() {
  if (!animating) { animating = true; requestAnimationFrame(tick); }
}

function flash(i) { instruments[i].hit = 1; kick(); }

// The scheduler: looks a little ahead and queues sounds on the audio clock,
// so the beat stays steady even if the page gets busy.
let nextTime = 0;
let stepIndex = 0;
const queue = []; // {time, step} so the visuals match what you hear
function scheduler() {
  const a = getAudio();
  if (!a) return;
  while (nextTime < a.currentTime + 0.15) {
    instruments.forEach((inst, i) => {
      if (inst.steps[stepIndex]) {
        sounds[inst.name](a, nextTime);
        queue.push({ time: nextTime, step: stepIndex, inst: i });
      }
    });
    queue.push({ time: nextTime, step: stepIndex, inst: -1 });
    nextTime += stepTime;
    stepIndex = (stepIndex + 1) % STEPS;
  }
  // show steps whose time has come
  while (queue.length && queue[0].time <= a.currentTime) {
    const q = queue.shift();
    currentStep = q.step;
    if (q.inst >= 0) instruments[q.inst].hit = 1;
  }
}

function startBand() {
  const a = getAudio();
  if (!a || playing) return;
  playing = true;
  nextTime = a.currentTime + 0.1;
  stepIndex = 0;
  setInterval(scheduler, 25);
  kick();
  document.getElementById('hint').textContent = 'The band is looping!';
}

canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const i = Math.min(instruments.length - 1, Math.floor(x * instruments.length));
  playSound(instruments[i].name);
  flash(i);
  // the first tap also wakes the band (a real start button comes in step 5)
  startBand();
});

render();
