import { clearContext } from "./graphics.js";
import NekotanScene from "./nekotan/nekotanScene.js";
import Debug from "./debug.js";
import InputManager from "./input.js";
import ContentManager from "./content.js";

export default class Game {
  #lastUpdateTime = Date.now();
  #updateRate = 15;

  constructor() {
    this.canvas = document.querySelector("#main-canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.input = new InputManager(this.canvas);
    this.content = new ContentManager();
    this.content.onFinishedLoading = () => {
      this.start();
    };
    this.content.loadContent();
  }
  start() {
    const startingScene = new NekotanScene(this);
    this.currentScene = startingScene;
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
    if (Date.now() < this.#lastUpdateTime + this.#updateRate) {
      return;
    }

    scene.update(this);

    this.#lastUpdateTime = Date.now();
  }
  draw(scene) {
    clearContext(this.context);
    scene.draw(this.context);
  }
}

function init() {
  const game = new Game();
}

init();
