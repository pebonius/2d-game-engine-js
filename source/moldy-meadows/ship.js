import { drawSprite } from "../graphics.js";
import { randomNumber } from "../utilities.js";
import Thruster from "./thruster.js";

export default class Ship {
  #shipSprite;
  #positionX;
  #positionY;
  #deltaX = 0;
  #deltaY = -3;
  #maxDelta = 5;
  #movementDamping = 0.92;
  #width = 112;
  #height = 48;
  #speed = 1;
  #shadowImage;

  constructor(scene) {
    this.#shipSprite = scene.game.content.ship;
    this.positionX = scene.game.canvas.width * 0.5 - this.#width * 0.5;
    this.positionY = 300;
    const canvas = scene.game.canvas;
    this.movementBoundsMargin = 48;
    this.minY = 0;
    this.maxY = canvas.height - this.height;
    this.minX = 0;
    this.maxX = canvas.width - this.width;
    this.thruster = new Thruster(scene);
    this.#shadowImage = scene.game.content.shadow;
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
    this.thruster.update(scene);
  }
  handleInput(scene) {
    const input = scene.game.input;
    const keys = scene.game.input.keys;

    if (input.isKeyDown(keys.W) || input.isKeyDown(keys.UP)) {
      this.moveUp(scene);
      scene.increaseSpeed();
    } else if (input.isKeyDown(keys.S) || input.isKeyDown(keys.DOWN)) {
      this.moveDown(scene);
      scene.decreaseSpeed();
    } else {
      scene.restoreBaseSpeed();
    }

    if (input.isKeyDown(keys.A) || input.isKeyDown(keys.LEFT)) {
      this.moveLeft(scene);
    } else if (input.isKeyDown(keys.D) || input.isKeyDown(keys.RIGHT)) {
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
    const shadowWidth = this.width * 1.0;
    const shadowHeight = this.height * 1.2;
    const shadowOffsetX = 0;
    const shadowOffsetY = 160 + randomNumber(0, 2);

    drawSprite(
      context,
      this.#shadowImage,
      this.positionX + this.width * 0.5 - shadowWidth * 0.5 + shadowOffsetX,
      this.positionY + this.height * 0.5 - shadowHeight * 0.5 + shadowOffsetY,
      shadowWidth,
      shadowHeight
    );
    drawSprite(
      context,
      this.#shipSprite,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
    this.thruster.draw(
      context,
      this.positionX + this.width * 0.5 - this.thruster.width * 0.5,
      this.positionY + this.height
    );
  }
}
