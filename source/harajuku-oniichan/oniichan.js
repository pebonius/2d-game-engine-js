import { drawSpriteFromSheet } from "../graphics.js";
import Bullet from "./bullet.js";

export default class Oniichan {
  #positionX;
  #positionY;
  #deltaX;
  #deltaY;
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
  #bulletSpeed = 10;
  #bulletDeltaX = this.#bulletSpeed;
  #bulletDeltaY = 0;
  #dashBoost = 3;
  #isDashing = false;
  #dashStart;
  #dashTime = 100;
  #dashCooldownStart;
  #dashCooldownTime = 100;

  constructor(positionX, positionY, spritesheet) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.life = 5;
    this.#spriteSheet = spritesheet;
    this.#dashCooldownStart = Date.now();
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
    this.resetDelta();
    this.handleInput(game, scene);
    this.updateDash();
    this.move();
  }
  updateDash() {
    if (this.#isDashing && Date.now() - this.#dashStart > this.#dashTime) {
      this.#isDashing = false;
      this.#dashCooldownStart = Date.now();
    }
  }
  resetDelta() {
    this.#deltaX = 0;
    this.#deltaY = 0;
  }
  move() {
    const dashBoost = this.#isDashing ? this.#dashBoost : 1;
    this.positionX += this.#deltaX * dashBoost;
    this.positionY += this.#deltaY * dashBoost;
  }
  resetSprite() {
    this.#currentSprite = 0;
  }
  handleInput(game, scene) {
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

    if (game.input.isKeyPressed(game.input.keys.X)) {
      this.dash(game);
    }

    this.handleShooting(game, scene);

    if (
      !game.input.isKeyDown(game.input.keys.LEFT) &&
      !game.input.isKeyDown(game.input.keys.RIGHT) &&
      !game.input.isKeyDown(game.input.keys.UP) &&
      !game.input.isKeyDown(game.input.keys.DOWN)
    ) {
      this.resetSprite();
    }
  }
  dash(game) {
    if (
      !this.#isDashing &&
      Date.now() - this.#dashCooldownStart > this.#dashCooldownTime
    ) {
      this.#isDashing = true;
      this.#dashStart = Date.now();
      game.sound.playSoundEffect(game.content.dash);
    }
  }
  handleShooting(game, scene) {
    if (game.input.isKeyDown(game.input.keys.LEFT)) {
      this.#bulletDeltaX = -this.#bulletSpeed;
    }
    if (game.input.isKeyDown(game.input.keys.RIGHT)) {
      this.#bulletDeltaX = this.#bulletSpeed;
    }
    if (game.input.isKeyDown(game.input.keys.UP)) {
      this.#bulletDeltaY = -this.#bulletSpeed;
    }
    if (game.input.isKeyDown(game.input.keys.DOWN)) {
      this.#bulletDeltaY = this.#bulletSpeed;
    }
    if (
      (game.input.isKeyDown(game.input.keys.UP) ||
        game.input.isKeyDown(game.input.keys.DOWN)) &&
      !game.input.isKeyDown(game.input.keys.LEFT) &&
      !game.input.isKeyDown(game.input.keys.RIGHT)
    ) {
      this.#bulletDeltaX = 0;
    }
    if (
      (game.input.isKeyDown(game.input.keys.LEFT) ||
        game.input.isKeyDown(game.input.keys.RIGHT)) &&
      !game.input.isKeyDown(game.input.keys.UP) &&
      !game.input.isKeyDown(game.input.keys.DOWN)
    ) {
      this.#bulletDeltaY = 0;
    }

    if (game.input.isKeyPressed(game.input.keys.Z)) {
      this.shoot(scene);
    }
  }
  shoot(scene) {
    const posX = this.positionX + this.width * 0.5;
    const posY = this.positionY + this.#height * 0.5;

    if (scene.bullets.length < scene.maxBullets) {
      scene.bullets.push(
        new Bullet(posX, posY, this.#bulletDeltaX, this.#bulletDeltaY)
      );
      scene.game.sound.playSoundEffect(scene.game.content.blaster);
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
      this.#deltaY = -this.#speed;
    }
    this.updateWalkCycle(3, 3, true);
  }
  walkDown(game) {
    if (this.positionY + this.width < game.canvas.height) {
      this.#deltaY = this.#speed;
    }
    this.updateWalkCycle(0, 1);
  }
  walkLeft(game) {
    if (this.positionX > 0) {
      this.#deltaX = -this.#speed;
    }
    this.#spriteFlipX = true;
    this.updateWalkCycle(0, 1);
  }
  walkRight(game) {
    if (this.positionX + this.width < game.canvas.width) {
      this.#deltaX = this.#speed;
    }
    this.#spriteFlipX = false;
    this.updateWalkCycle(0, 1);
  }
  draw(context) {
    drawSpriteFromSheet(
      context,
      this.#spriteSheet,
      this.#currentSprite,
      this.positionX,
      this.positionY,
      this.#spriteFlipX,
      false,
      this.#spriteScale,
      this.#spriteScale,
      0
    );
  }
}
