// Wendle's band: step 1, just drawing the instruments in a row.
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

// Each instrument has a name, a colour and a drawing function.
// They all get drawn centred at (0,0) so I can just move them around.
function drawWoodblock(c) {
  c.fillStyle = c.color;
  c.fillRect(-45, -25, 90, 50);
  c.fillStyle = '#00000055';
  c.fillRect(-30, -6, 60, 12); // the slot
}

function drawClaves(c) {
  c.fillStyle = c.color;
  c.save(); c.rotate(-0.5);
  c.fillRect(-8, -50, 16, 100);
  c.restore();
  c.save(); c.rotate(0.5);
  c.fillRect(-8, -50, 16, 100);
  c.restore();
}

function drawGuiro(c) {
  // a ridged gourd for scraping
  c.fillStyle = c.color;
  c.beginPath(); c.ellipse(0, 0, 60, 28, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#00000066'; c.lineWidth = 3;
  for (let x = -40; x <= 40; x += 10) {
    c.beginPath(); c.moveTo(x, -18); c.lineTo(x, 18); c.stroke();
  }
}

function drawTriangle(c) {
  c.strokeStyle = c.color; c.lineWidth = 8; c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(0, -45); c.lineTo(45, 35); c.lineTo(-45, 35); c.closePath();
  c.stroke();
}

function drawShaker(c) {
  c.fillStyle = c.color;
  c.beginPath(); c.ellipse(0, -15, 28, 36, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#c99a5b';
  c.fillRect(-7, 18, 14, 40);
}

const instruments = [
  { name: 'Woodblock', color: '#e8a24a', draw: drawWoodblock },
  { name: 'Claves',    color: '#e86a6a', draw: drawClaves },
  { name: 'Guiro',     color: '#7bd47b', draw: drawGuiro },
  { name: 'Triangle',  color: '#6ad0e8', draw: drawTriangle },
  { name: 'Shaker',    color: '#c58af0', draw: drawShaker }
];

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const slot = canvas.width / instruments.length;
  ctx.textAlign = 'center';
  ctx.font = '20px system-ui, sans-serif';
  instruments.forEach((inst, i) => {
    const x = slot * i + slot / 2;
    ctx.save();
    ctx.translate(x, 130);
    ctx.color = inst.color;
    inst.draw(ctx);
    ctx.restore();
    ctx.fillStyle = '#f3e9ff';
    ctx.fillText(inst.name, x, 250);
  });
}

render();
