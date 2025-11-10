import { clearContext, drawRectangle, getCanvasCenter } from "./graphics.js";

let rotation = 0;
const rotationSpeed = 10;
const animationSize = { x: 50, y: 50 };
const animationColor = "green";
const animations = [
  { x: -100, y: 0 },
  { x: 0, y: 0 },
  { x: 100, y: 0 },
];

function drawAnimations(context) {
  for (let index = 0; index < animations.length; index++) {
    const element = animations[index];

    drawRectangle(
      context,
      getCanvasCenter(context.canvas).x - animationSize.x * 0.5 + element.x,
      getCanvasCenter(context.canvas).y - animationSize.y * 0.5 + element.y,
      animationSize.x,
      animationSize.y,
      rotation,
      animationColor
    );
  }
}

export default class App {
  constructor() {
    this.canvas = document.querySelector("#main-canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.context.save();
    this.running = false;
  }
  start() {
    this.running = true;
    this.gameLoop();
  }
  gameLoop() {
    this.update();
    this.draw();

    if (this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  update() {
    rotation += rotationSpeed;
  }
  draw() {
    clearContext(this.context);
    drawAnimations(this.context);
  }
}

function init() {
  const app = new App();
  app.start();
}

init();
