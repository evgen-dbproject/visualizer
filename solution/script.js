'use strict'
let WIDTH;
let HEIGHT;

const START_BTN = document.getElementById('start');
const STOP_BTN = document.getElementById('stop');
//const FULLSCREEN_BTN = document.getElementById('full-screen');

//Parametrs:
let ANGEL_COUNT = 80;
let LINE_WIDTH = 1;
let RESIST = 0.05;
let POWER = 20;
let GRADIENT_ELEM = new Gradient(updateGradient);
let GRADIENT = [ [255, 255, 255, 1], [0, 0, 0, 1] ];
let GRADIENT_DELTA = 1;
let LINE_CONNECT = true;

//Animations control:
let play = false;
let pause_check = false;

let ctx;
let canvas;
let center;
let particals = [];

init();

function init() {
  play = true;
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  WIDTH = canvas.width = window.screen.width / 2.2;
  HEIGHT = canvas.height = canvas.width;
  particals = [];

  ANGEL_COUNT = +document.querySelector('#shapeV').value;
  LINE_WIDTH = +document.querySelector('#lineWidthV').value;
  POWER = +document.querySelector('#spreadV').value;
  RESIST = +document.querySelector('#dampingV').value;
  GRADIENT_DELTA = +document.querySelector('#gradientSpeedV').value;
  LINE_CONNECT = document.querySelector('#lineConnectV').checked;

  ctx.lineWidth = LINE_WIDTH;

  let rotate_angel = 360 / ANGEL_COUNT;

  for (let i = 0; i < ANGEL_COUNT; i++) {
    let vec = transAnglToVec(i * rotate_angel, POWER);
    particals.push(new Partical(vec, [WIDTH / 2, HEIGHT / 2]));
  }

  let vec = transAnglToVec(0 * rotate_angel, POWER);
  particals.push(new Partical(vec, [WIDTH / 2, HEIGHT / 2]));
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.rect(0, 0, WIDTH, HEIGHT);
  ctx.fill();
}

function draw() {
  if (play) {
    ctx.beginPath();
    for (let p of particals) {
      p.calcPoint();
      let color = `rgba(${p.colr[0]}, ${p.colr[1]}, ${p.colr[2]}, ${p.colr[3]})`;
      ctx.strokeStyle = color;

      let y1 = HEIGHT - p.prev_p[1];
      let y2 = HEIGHT - p.p[1];
      let x1 = p.prev_p[0];
      let x2 = p.p[0];

      if (LINE_CONNECT) {
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);
      }
      else {
        ctx.moveTo(x2, y2);
        ctx.lineTo(x1, y1);
      }
    }
    ctx.stroke();
    window.requestAnimationFrame(draw);
  }
  else {
    if (!pause_check) {
      stop(false);
    }
  }
}

function Partical(vector, point) {
  this.vec = vector;
  this.p = point;
  this.prev_p = point;
  this.colr = [];
  this.dt = 0;
  this.mul = true;

  this.calcPoint = function() {
    if (Math.abs(this.vec[0]) > 0.3 || Math.abs(this.vec[1]) > 0.3) {
      this.prev_p = this.p.slice(0);
      this.vec[0] *= 1 - (RESIST * 1.2);
      this.vec[1] *= 1 - (RESIST * 1.2);
      this.p[0] += this.vec[0];
      this.p[1] += this.vec[1];
      this.dt += GRADIENT_DELTA;
      this.colr = changeColor(++this.dt);
    }
    else {
      play = false;
    }
  };
}

function changeColor(dt) {
  let r = GRADIENT[0][0] - ((GRADIENT[0][0] - GRADIENT[1][0]) * (dt / 50));
  let g = GRADIENT[0][1] - ((GRADIENT[0][1] - GRADIENT[1][1]) * (dt / 50));
  let b = GRADIENT[0][2] - ((GRADIENT[0][2] - GRADIENT[1][2]) * (dt / 50));
  let a = GRADIENT[0][3] - ((GRADIENT[0][3] - GRADIENT[1][3]) * (dt / 20));
  return [r, g, b, a];
}

function transAnglToVec(angel, vec_length) {
  let radians = Math.PI * angel / 180;
  let y_offset = Math.cos(radians) * vec_length;
  radians = Math.PI * (90 - angel) / 180;
  let x_offset = Math.cos(radians) * vec_length;
  return [x_offset, y_offset];
}

function updateGradient() {
  GRADIENT[0] = GRADIENT_ELEM.first_color;
  GRADIENT[1] = GRADIENT_ELEM.second_color;
}

function start(first) {
  play = true;
  pause_check = false;
  if (first === true) {
    init();
  }
  draw();
  START_BTN.onclick = pause.bind(false);
  START_BTN.value = 'Пауза';
}

function pause() {
  play = false;
  pause_check = true;
  START_BTN.onclick = start;
  START_BTN.value = 'Продолжить';
}

function stop(remove) {
  START_BTN.onclick = start.bind(true);
  START_BTN.value = 'Запустить';
  if (remove) {
    init();
  }
  play = false;
}
