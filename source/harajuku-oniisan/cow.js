import { drawRectangle, drawSpriteFromSheet } from "../graphics.js";

export default class Cow {
  #positionX;
  #positionY;
  #width = 90;
  #height = 90;
  #speed = 1;
  #life = 3;
  #spriteSheet;
  #currentSprite = 0;
  #spriteScale = 2;
  #spriteFlipX = false;
  #walkCycleLastChange = Date.now();
  #walkCycleDelay = 160;

  constructor(positionX, positionY, spritesheet) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.#spriteSheet = spritesheet;
  }
  get positionX() {
    return this.#positionX;
  }
  set positionX(value) {
    this.#positionX = Math.round(value);
  }
  get positionY() {
    return this.#positionY;
  }
  set positionY(value) {
    this.#positionY = Math.round(value);
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
  get life() {
    return this.#life;
  }
  set life(value) {
    if (!Number.isSafeInteger(value)) {
      throw new Error("value must be a safe integer");
    }

    this.#life = value;
  }
  update(game, scene) {
    this.walkTowardsPlayer(game, scene);
  }
  walkTowardsPlayer(game, scene) {
    if (scene.oniisan.positionX < this.positionX) {
      this.walkLeft(game);
    }
    if (scene.oniisan.positionX > this.positionX) {
      this.walkRight(game);
    }
    if (scene.oniisan.positionY < this.positionY) {
      this.walkUp(game);
    }
    if (scene.oniisan.positionY > this.positionY) {
      this.walkDown(game);
    }
  }
  updateWalkCycle(sprite1, sprite2, flip = false) {
    if (Date.now() - this.#walkCycleLastChange > this.#walkCycleDelay) {
      this.#walkCycleLastChange = Date.now();

      this.#currentSprite = this.#currentSprite === sprite1 ? sprite2 : sprite1;

      if (flip) {
        this.#spriteFlipX = !this.#spriteFlipX;
      }
    }
  }
  walkUp(game) {
    if (this.positionY > 0) {
      this.positionY -= this.#speed;
    }
    this.updateWalkCycle(0, 2);
  }
  walkDown(game) {
    if (this.positionY + this.width < game.canvas.height) {
      this.positionY += this.#speed;
    }
    this.updateWalkCycle(8, 10);
  }
  walkLeft(game) {
    if (this.positionX > 0) {
      this.positionX -= this.#speed;
    }
    this.#spriteFlipX = true;
    this.updateWalkCycle(12, 14);
  }
  walkRight(game) {
    if (this.positionX + this.width < game.canvas.width) {
      this.positionX += this.#speed;
    }
    this.#spriteFlipX = false;
    this.updateWalkCycle(12, 14);
  }
  draw(context) {
    const spriteOffsetX = -84;
    const spriteOffsetY = -106;

    drawSpriteFromSheet(
      context,
      this.#spriteSheet,
      this.#currentSprite,
      { x: this.positionX + spriteOffsetX, y: this.positionY + spriteOffsetY },
      this.#spriteFlipX,
      false,
      this.#spriteScale,
      this.#spriteScale,
      0
    );
  }
}
