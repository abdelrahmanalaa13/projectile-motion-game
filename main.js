// Constants values
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const controls = document.getElementById("controls");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;
const w = canvas.width;
const h = canvas.height;
const g = 9.8;

// Set defult values
let time = 0; // time
let ball_size = 10; // ball size
let arrow_length = 100;
let ground_highet = 150;
let t_rate = 60; // how many frames will be showen ber sucend
let xi = 50; // initiall x
let yi = h - ground_highet; // initiall y
let xpos = xi; // the changeable x
let ypos = yi; // the changeable x
let path = []; // will includs path ؤoordinates
let loop; // for interval set
let midPoint; // the center point to that have the max-highet

// colores
let ball_color = "red";
let sky_color = "#87ceeb";
let ground_color = "#268b07";
let path_color = "blue";
let angle_color = "black";

// inputs
let vi = 50; // Initial velocity
let theta = Math.PI / 3; // Initial theta
let targetX; // the X axis of the target point

let started = false; // to check if lunched or not

/**
 * To initlize and reset the whole canves elements
 */
function init() {
  restInitValues();
  draw_background();
  getInputsData();
  initDraw();
}

/**
 * Resetting the main values to the defults
 */
function restInitValues() {
  if (loop) {
    clearInterval(loop);
  }
  xpos = xi;
  ypos = yi;
  time = 0;
  path = [];
  started = false;
  controls.classList.remove("disabled");
  targetX = randomTarget();
}

/**
 * Getting the main inputs
 */
function getInputsData() {
  setAngle();
  setVelocity();
}

/**
 * get and calculate the angle from the dom
 */
function setAngle() {
  theta = (document.getElementById("angle").value * Math.PI) / 180;
}
/**
 * get the velocity from the dom
 */
function setVelocity() {
  vi = document.getElementById("velocity").value;
}

/**
 * draw the initial elements
 */
function initDraw() {
  draw_background();
  draw_angle();
  draw_ball();
}

/**
 * setting the background that contains ground and sky
 */
function draw_background() {
  // ground
  context.fillStyle = ground_color;
  context.fillRect(0, yi, w, ground_highet);

  // sky
  context.fillStyle = sky_color;
  context.fillRect(0, 0, w, h - ground_highet);
}

/**
 * drawing the ball that will be thrown
 */
function draw_ball() {
  // ball
  context.fillStyle = ball_color;
  context.lineWidth = 2;
  context.beginPath();
  context.arc(xpos, ypos, ball_size, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
  context.closePath();
}

/**
 * drawing the arrow that will represent the angle
 */
function draw_angle() {
  arrow_length = vi > 100 ? 150 : Number(vi) + 50;
  context.strokeStyle = angle_color;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(xi, yi);
  let x = xi + arrow_length * Math.cos(theta);
  let y = yi - arrow_length * Math.sin(theta);
  context.lineTo(x, y);
  context.stroke();
  context.closePath();
  draw_target();
}

/**
 * drawing target details that will be shoten
 */
function draw_target() {
  context.beginPath();
  context.fillStyle = ball_color;
  context.lineWidth = 2;
  context.arc(targetX, yi, 20, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
  context.beginPath();
  context.fillStyle = "#fff";
  context.arc(targetX, yi, 10, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
  context.beginPath();
  context.fillStyle = ball_color;
  context.arc(targetX, yi, 2.5, 0, 2 * Math.PI);
  context.fill();
  context.closePath();

  context.beginPath();
  context.strokeStyle = "red";
  context.lineWidth = 1;
  context.moveTo(xi, yi + 20);
  context.lineTo(xi, yi + 30);
  context.lineTo(targetX, yi + 30);
  context.lineTo(targetX, yi + 20);
  context.stroke();
  context.closePath();
  context.font = "15px Arial";
  context.fillText(
    `Distance to the target = ${(targetX - xi).toFixed(2)}m`,
    xi,
    yi + 50
  );
}
/**
 * calulating the target xAxis to be setted in a random postion
 * @returns targetX
 */
function randomTarget() {
  max = w - xi * 2;
  min = xi * 2;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *
 * drawning the output path of points
 */
function draw_path() {
  if (path.length == 0) {
    return;
  }

  context.strokeStyle = path_color;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; ++i) {
    context.lineTo(path[i].x, path[i].y);
  }
  context.stroke();
  context.closePath();
}

/**
 * draw and calculate the output results
 */
function drawFinalResults() {
  draw_h_max();
  draw_time();
  checkSuccess();
}

/**
 * caculating the maxmume highet that will be reached by the ball
 */
function draw_h_max() {
  const maxY = Math.min.apply(
    Math,
    path.map(function (o) {
      return o.y;
    })
  );
  midPoint = path.find((o) => o.y === maxY);
  context.strokeStyle = angle_color;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(midPoint.x, yi + ball_size);
  context.lineTo(midPoint.x, midPoint.y);
  context.stroke();
  context.closePath();
  context.font = "15px Arial";
  context.fillText(
    `The max highet = ${maxY.toFixed(2)}m`,
    midPoint.x - 30,
    midPoint.y - 10
  );
}

/**
 * drow and calculate the distance between the init point and the ball after fallen
 */
function draw_distance() {
  context.strokeStyle = angle_color;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(xi, yi + 20);
  context.lineTo(xi, yi + 70);
  context.lineTo(path[path.length - 1].x, yi + 70);
  context.lineTo(path[path.length - 1].x, path[path.length - 1].y + 20);
  context.stroke();
  context.closePath();
  context.font = "15px Arial";
  context.fillText(
    `Total distance = ${(path[path.length - 1].x - xi).toFixed(2)}m`,
    midPoint.x - 30,
    yi + 90
  );
}

/**
 * drow and calcualte total time to send the ball
 */
function draw_time() {
  const total_time = ((2 * vi * Math.sin(theta)) / g).toFixed(2);
  context.font = "15px Arial";

  context.fillText(`Total Time = ${total_time}s`, xpos + 20, ypos - 20);
}
/**
 * checking if the ball hitted the target
 */
function checkSuccess() {
  let isSucssess = xpos.toFixed() === targetX.toFixed();
  context.font = "40px Arial";
  if (isSucssess) {
    context.fillStyle = ground_color;
    context.fillText("Sucess!", w / 2 - 50, 50);
  } else {
    context.fillStyle = "red";
    context.fillText("Failed!", w / 2 - 50, 50);
    draw_distance();
  }
}

/**
 * Caculating the points
 * pushing the calculated points to the path
 */
function move() {
  xpos = xi + vi * Math.cos(theta) * time;
  ypos = yi - vi * Math.sin(theta) * time + (1 / 2) * g * time ** 2;
  path.push({ x: xpos, y: ypos });
}

/**
 * show the path of the ball
 */
function show() {
  draw_background();
  draw_path();
  draw_angle();
  draw_ball();
  time += 1 / t_rate;
  move();
  if (ypos >= yi) {
    clearInterval(loop);
    drawFinalResults();
  }
}

/**
 * check and start the loop that drowing the path
 */
function start() {
  if (started) {
    return;
  }
  if (loop) {
    clearInterval(loop);
  }
  started = true;

  controls.classList.add("disabled");
  loop = setInterval(show, 1000 / t_rate);
}

init();
