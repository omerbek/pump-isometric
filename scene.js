'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mint = '#9ef4dc';
const amber = '#ffcb7d';
const ink = '#152129';
const duration = 8;
const controls = [...document.querySelectorAll('#settings input')];
const settings = Object.fromEntries(controls.map(input => [
  input.id, input.type === 'number' ? Number(input.value) : input.value
]));
controls.forEach(input => input.addEventListener('input', () => {
  if (input.type === 'number' && (input.value === '' || !input.validity.valid)) return;
  settings[input.id] = input.type === 'number' ? input.valueAsNumber : input.value;
  draw();
}));

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function line(points, color = mint, width = 3) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}


function render(t) {
  const lift = settings.lift * Math.sin(t * Math.PI / 8);
  const block = (x, y, c) => {
    line([[x, y], [x + 100, y - settings.tilt], [x + 230, y], [x + 130, y + settings.tilt], [x, y], [x, y + 45], [x + 130, y + settings.tilt + 45], [x + 230, y + 45], [x + 230, y]], c);
    line([[x + 130, y + settings.tilt], [x + 130, y + settings.tilt + 45]], c);
  };
  block(245, 235, mint);
  block(245, 175 - lift, amber);
}

const seek = document.querySelector('#seek');
const play = document.querySelector('#play');
const time = document.querySelector('#time');
let position = 0;
let playing = false;
let previous = null;
let animationId = null;

function draw() {
  rect(0, 0, canvas.width, canvas.height, ink);
  render(position);
  seek.value = position;
  time.value = `${position.toFixed(2)} sn`;
}

function frame(timestamp) {
  if (!playing) return;
  if (previous !== null) position = (position + (timestamp - previous) / 1000) % duration;
  previous = timestamp;
  draw();
  animationId = requestAnimationFrame(frame);
}

play.addEventListener('click', () => {
  playing = !playing;
  play.textContent = playing ? 'Duraklat' : 'Oynat';
  if (playing) {
    previous = null;
    animationId = requestAnimationFrame(frame);
  } else {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
});

seek.addEventListener('input', () => {
  position = Number(seek.value);
  draw();
});

document.querySelector('#save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'pump-isometric.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

draw();
