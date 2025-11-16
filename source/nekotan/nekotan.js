import Body from "../body.js";
import Sprite from "../sprite.js";

export default class Nekotan {
  #walkSpeed = 2;
  #walkCycleTimer = 0;
  #walkCycleTick = 16;

  constructor(scene, positionX, positionY) {
    this.body = new Body();
    this.positionX = positionX;
    this.positionY = positionY;
    this.height = 64;
    this.width = 64;
    this.sprite = new Sprite(scene.ufeffSpritesheet, 32);
    this.sprite.positionX = positionX;
    this.sprite.positionY = positionY;
    this.sprite.scaleX = 4;
    this.sprite.scaleY = 4;
    this.walkingLeft = true;
  }
  get positionX() {
    return this.body.positionX;
  }
  set positionX(value) {
    this.body.positionX = value;
  }
  get positionY() {
    return this.body.positionY;
  }
  set positionY(value) {
    this.body.positionY = value;
  }
  get deltaX() {
    return this.body.deltaX;
  }
  set deltaX(value) {
    this.body.deltaX = value;
  }
  get deltaY() {
    return this.body.deltaY;
  }
  set deltaY(value) {
    this.body.deltaY = value;
  }
  get width() {
    return this.body.width;
  }
  set width(value) {
    this.body.width = value;
  }
  get height() {
    return this.body.height;
  }
  set height(value) {
    this.body.height = value;
  }
  increaseSize() {
    this.sprite.scaleX++;
    this.sprite.scaleY++;
    this.width += this.sprite.spriteSheet.tileSize;
    this.height += this.sprite.spriteSheet.tileSize;
  }
  update(scene) {
    scene.physics.applyGravity(this, scene.game.canvas);
    scene.physics.applyDamping(this);
    scene.physics.floorDelta(this);
    this.checkWalkDirection(scene);
    this.walk(scene);
    this.body.update(scene);
    this.sprite.positionX = this.positionX;
    this.sprite.positionY = this.positionY;
  }
  checkWalkDirection(scene) {
    if (this.walkingLeft && this.positionX <= 0) {
      this.walkingLeft = false;
    }

    if (
      !this.walkingLeft &&
      this.positionX + this.width >= scene.game.canvas.width
    ) {
      this.walkingLeft = true;
    }
  }
  walk(scene) {
    if (this.walkingLeft) {
      this.positionX -= this.#walkSpeed;
    }

    if (!this.walkingLeft) {
      this.positionX += this.#walkSpeed;
    }

    this.updateWalkCycleTimer();
  }
  updateWalkCycleTimer() {
    if (this.#walkCycleTimer < this.#walkCycleTick) {
      this.#walkCycleTimer++;
      return;
    }

    this.#walkCycleTimer = 0;
    this.flipSprite();
  }
  flipSprite() {
    this.sprite.flipX = !this.sprite.flipX;
  }
  draw(context) {
    this.sprite.draw(context);
  }
}
