// Wendle's band: step 2, the instruments now make sounds when tapped.
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

// Each instrument is drawn centred at (0,0). I scale them up to fill the stage.
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

const instruments = [
  { name: 'Woodblock', color: '#e8a24a', draw: drawWoodblock, hit: 0 },
  { name: 'Claves',    color: '#e86a6a', draw: drawClaves, hit: 0 },
  { name: 'Guiro',     color: '#7bd47b', draw: drawGuiro, hit: 0 },
  { name: 'Triangle',  color: '#6ad0e8', draw: drawTriangle, hit: 0 },
  { name: 'Shaker',    color: '#c58af0', draw: drawShaker, hit: 0 }
];

const SCALE = 1.5;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const slot = canvas.width / instruments.length;
  ctx.textAlign = 'center';
  ctx.font = '24px system-ui, sans-serif';
  instruments.forEach((inst, i) => {
    const x = slot * i + slot / 2;
    // the 'hit' value wobbles the instrument a bit after a tap
    const s = SCALE * (1 + inst.hit * 0.2);
    ctx.save();
    ctx.translate(x, 190);
    ctx.scale(s, s);
    ctx.rotate(Math.sin(inst.hit * 20) * inst.hit * 0.15);
    if (inst.hit > 0.05) { ctx.shadowColor = inst.color; ctx.shadowBlur = 30 * inst.hit; }
    inst.draw(ctx, inst.color);
    ctx.restore();
    ctx.fillStyle = '#f3e9ff';
    ctx.fillText(inst.name, x, 365);
  });
}

// fade the wobble out each frame
function tick() {
  let busy = false;
  for (const inst of instruments) {
    if (inst.hit > 0) { inst.hit = Math.max(0, inst.hit - 0.04); busy = true; }
  }
  render();
  if (busy) requestAnimationFrame(tick);
}

function hitInstrument(i) {
  const inst = instruments[i];
  inst.hit = 1;
  playSound(inst.name);
  document.getElementById('hint').textContent = inst.name + '!';
  requestAnimationFrame(tick);
}

// work out which slot was tapped (canvas is scaled by CSS, so use its rect)
canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const i = Math.min(instruments.length - 1, Math.floor(x * instruments.length));
  hitInstrument(i);
});

render();
