import { clearContext, drawRectangle, getCanvasCenter } from "./graphics.js";
import TestingScene from "./testingScene.js";

const testingScene = new TestingScene();

export default class App {
  constructor() {
    this.canvas = document.querySelector("#main-canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.context.save();
    this.running = false;
    this.currentScene = testingScene;
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
    this.currentScene.update();
  }
  draw() {
    clearContext(this.context);
    this.currentScene.draw(this.context);
  }
}

function init() {
  const app = new App();
  app.start();
}

init();
