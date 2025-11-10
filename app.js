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
    const scene = this.currentScene;

    if (!scene) {
      this.running = false;
      return;
    }

    this.update(scene);
    this.draw(scene);

    if (this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  update(scene) {
    scene.update();
  }
  draw(scene) {
    clearContext(this.context);
    scene.draw(this.context);
  }
}

function init() {
  const app = new App();
  app.start();
}

init();
