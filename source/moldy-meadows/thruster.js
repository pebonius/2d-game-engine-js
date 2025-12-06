import { drawSprite } from "../graphics.js";
import { randomNumber } from "../utilities.js";

export default class Thruster {
  #thrusterImage;
  #scale = 2;
  #width = 8 * this.#scale;
  #baseHeight = 5 * this.#scale;
  #height;
  #animationCycleStart;
  #animationCycleTime = 100;
  #drawTime;
  #displayed = true;

  constructor(scene) {
    this.#thrusterImage = scene.game.content.thruster;
    this.height = this.#baseHeight * 2;
    this.#animationCycleStart = Date.now();
    this.#drawTime = this.#animationCycleTime * 0.8;
  }
  get width() {
    return this.#width;
  }
  set width(value) {
    if (!Number.isSafeInteger(value)) {
      throw new Error("value must be a safe integer");
    }

    this.#width = value;
  }
  get height() {
    return this.#height;
  }
  set height(value) {
    if (!Number.isSafeInteger(value)) {
      throw new Error("value must be a safe integer");
    }

    this.#height = value;
  }
  update(scene) {
    this.animationTimeElapsed = Date.now() - this.#animationCycleStart;
    this.updateAnimation();
    this.updateHeight(scene);
  }
  updateHeight(scene) {
    this.height = 2 * Math.floor(this.#baseHeight * (scene.speed * 0.1) * (this.animationTimeElapsed * 0.01));

    const heightChange = this.height * 0.25;
    this.height += randomNumber(-heightChange, heightChange);
  }
  updateAnimation() {
    if (this.animationTimeElapsed >= this.#animationCycleTime) {
      this.#animationCycleStart = Date.now();
      return;
    }

    if (this.animationTimeElapsed < this.#drawTime) {
      this.#displayed = true;
    } else {
      this.#displayed = false;
    }
  }
  draw(context, posX, posY) {
    if (this.#displayed) {
      drawSprite(
        context,
        this.#thrusterImage,
        posX,
        posY,
        this.#width,
        this.#height
      );
    }
  }
}
