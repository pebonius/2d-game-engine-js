import { drawRectangle, drawSpriteFromSheet } from "../graphics.js";

export default class Oniisan {
  #positionX;
  #positionY;
  #width = 56;
  #height = 56;
  #life;
  #speed = 4;
  #spriteSheet;
  #currentSprite = 0;
  #spriteScale = 2;
  #spriteFlipX = false;
  #walkCycleLastChange = Date.now();
  #walkCycleDelay = 160;

  constructor(positionX, positionY, spritesheet) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.life = 5;
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
  update(game) {
    this.handleInput(game);
  }
  resetSprite() {
    this.#currentSprite = 0;
  }
  handleInput(game) {
    if (game.input.isKeyDown(game.input.keys.LEFT)) {
      this.walkLeft(game);
    } else if (game.input.isKeyDown(game.input.keys.RIGHT)) {
      this.walkRight(game);
    }

    if (game.input.isKeyDown(game.input.keys.UP)) {
      this.walkUp(game);
    } else if (game.input.isKeyDown(game.input.keys.DOWN)) {
      this.walkDown(game);
    }

    if (
      !game.input.isKeyDown(game.input.keys.LEFT) &&
      !game.input.isKeyDown(game.input.keys.RIGHT) &&
      !game.input.isKeyDown(game.input.keys.UP) &&
      !game.input.isKeyDown(game.input.keys.DOWN)
    ) {
      this.resetSprite();
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
    this.updateWalkCycle(3, 3, true);
  }
  walkDown(game) {
    if (this.positionY + this.width < game.canvas.height) {
      this.positionY += this.#speed;
    }
    this.updateWalkCycle(0, 1);
  }
  walkLeft(game) {
    if (this.positionX > 0) {
      this.positionX -= this.#speed;
    }
    this.#spriteFlipX = true;
    this.updateWalkCycle(0, 1);
  }
  walkRight(game) {
    if (this.positionX + this.width < game.canvas.width) {
      this.positionX += this.#speed;
    }
    this.#spriteFlipX = false;
    this.updateWalkCycle(0, 1);
  }
  draw(context) {
    drawRectangle(
      context,
      this.positionX,
      this.positionY,
      this.width,
      this.height,
      0,
      "blue"
    );
    drawSpriteFromSheet(
      context,
      this.#spriteSheet,
      this.#currentSprite,
      { x: this.positionX, y: this.positionY },
      this.#spriteFlipX,
      false,
      this.#spriteScale,
      this.#spriteScale,
      0
    );
  }
}
