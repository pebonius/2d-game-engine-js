import { clearContext } from "./graphics.js";
import TestingScene from "./testingScene.js";
import Debug from "./debug.js";
import InputManager from "./input.js";

const testingScene = new TestingScene();

export default class Game {
  constructor() {
    this.canvas = document.querySelector("#main-canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
  }
  start(scene) {
    this.input = new InputManager(this.canvas);
    this.currentScene = scene;
    this.running = true;
    this.gameLoop();
    Debug.log("game started");
  }
  gameLoop() {
    if (!this.currentScene) {
      this.running = false;
      return;
    }

    this.update(this.currentScene);
    this.draw(this.currentScene);

    if (this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  update(scene) {
    scene.update(this);
  }
  draw(scene) {
    clearContext(this.context);
    scene.draw(this.context);
  }
}

function init() {
  const game = new Game();
  game.start(testingScene);
}

init();
