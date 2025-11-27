import Debug from "./debug.js";
import { clearContext } from "./graphics.js";
import InputManager from "./input.js";
import ContentManager from "./content.js";
import SoundManager from "./sound.js";

export default class Game {
  #lastUpdateTime = Date.now();
  #updateRate = 15;

  constructor(startingSceneInitializer) {
    this.canvas = document.querySelector("#main-canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.input = new InputManager(this.canvas);
    this.content = new ContentManager();
    this.sound = new SoundManager();
    this.content.onFinishedLoading = () => {
      this.start(startingSceneInitializer);
    };
    this.content.loadContent();
  }
  start(startingSceneInitializer) {
    const startingScene = startingSceneInitializer(this);
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

    this.input.update();
    scene.update(this);

    this.#lastUpdateTime = Date.now();
  }
  draw(scene) {
    clearContext(this.context);
    scene.draw(this.context);
  }
}