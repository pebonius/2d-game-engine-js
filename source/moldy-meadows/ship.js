import { drawSprite } from "../graphics.js";

export default class Ship {
  #shipSprite;
  #positionX;
  #positionY;
  #deltaX = 0;
  #deltaY = 0;
  #maxDelta = 8;
  #movementDamping = 0.9;
  #width = 112;
  #height = 48;
  #speed = 1;

  constructor(scene) {
    this.#shipSprite = scene.game.content.ship;
    this.positionX = scene.game.canvas.width * 0.5 - this.#width * 0.5;
    this.positionY = 200;
    const canvas = scene.game.canvas;
    this.movementBoundsMargin = 48;
    this.minY = 0;
    this.maxY = canvas.height - this.height;
    this.minX = 0;
    this.maxX = canvas.width - this.width;
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
  update(scene) {
    this.handleInput(scene);
    this.limitDelta();
    this.dampMovement();
    this.move();
    this.bindToViewport(scene);
  }
  handleInput(scene) {
    const input = scene.game.input;
    const keys = scene.game.input.keys;

    if (input.isKeyDown(keys.W)) {
      this.moveUp(scene);
    } else if (input.isKeyDown(keys.S)) {
      this.moveDown(scene);
    }

    if (input.isKeyDown(keys.A)) {
      this.moveLeft(scene);
    } else if (input.isKeyDown(keys.D)) {
      this.moveRight(scene);
    }
  }
  limitDelta() {
    if (this.#deltaY > this.#maxDelta) {
      this.#deltaY = this.#maxDelta;
    }

    if (this.#deltaY < -this.#maxDelta) {
      this.#deltaY = -this.#maxDelta;
    }

    if (this.#deltaX > this.#maxDelta) {
      this.#deltaX = this.#maxDelta;
    }

    if (this.#deltaX < -this.#maxDelta) {
      this.#deltaX = -this.#maxDelta;
    }
  }
  dampMovement() {
    this.#deltaX *= this.#movementDamping;
    this.#deltaY *= this.#movementDamping;

    if (this.#deltaY > -0.1 && this.#deltaY < -0.1) {
      this.#deltaY = 0;
    }

    if (this.#deltaX > -0.1 && this.#deltaX < -0.1) {
      this.#deltaX = 0;
    }
  }
  move() {
    this.positionX += this.#deltaX;
    this.positionY += this.#deltaY;
  }
  bindToViewport(scene) {
    if (this.positionY < this.minY) {
      this.positionY = this.minY;
    }

    if (this.positionY > this.maxY) {
      this.positionY = this.maxY;
    }

    if (this.positionX < this.minX) {
      this.positionX = this.minX;
    }

    if (this.positionX > this.maxX) {
      this.positionX = this.maxX;
    }

    this.negateSpeedNearBounds();
  }
  negateSpeedNearBounds() {
    if (this.positionY < this.minY + this.movementBoundsMargin) {
      this.#deltaY *= 0.9;
      this.#deltaY += this.#speed;
    }

    if (this.positionY > this.maxY - this.movementBoundsMargin) {
      this.#deltaY *= 0.9;
      this.#deltaY -= this.#speed;
    }

    if (this.positionX < this.minX + this.movementBoundsMargin) {
      this.#deltaX *= 0.9;
      this.#deltaX += this.#speed;
    }

    if (this.positionX > this.maxX - this.movementBoundsMargin) {
      this.#deltaX *= 0.9;
      this.#deltaX -= this.#speed;
    }
  }

  moveUp(scene) {
    if (this.positionY > 0) {
      this.#deltaY -= this.#speed;
    }
  }
  moveDown(scene) {
    if (this.positionY < scene.game.canvas.height) {
      this.#deltaY += this.#speed;
    }
  }
  moveLeft(scene) {
    if (this.positionX > 0) {
      this.#deltaX -= this.#speed;
    }
  }
  moveRight(scene) {
    if (this.positionX < scene.game.canvas.width) {
      this.#deltaX += this.#speed;
    }
  }
  draw(context) {
    drawSprite(
      context,
      this.#shipSprite,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
  }
}
