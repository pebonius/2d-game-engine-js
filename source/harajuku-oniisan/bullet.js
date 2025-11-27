import { drawRectangle } from "../graphics.js";

export default class Bullet {
  #positionX;
  #positionY;
  #width = 10;
  #height = 10;
  #deltaX = 0;
  #deltaY = 0;

  constructor(positionX, positionY, deltaX, deltaY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.isDead = false;
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
  get height() {
    return this.#height;
  }
  get deltaX() {
    return this.#deltaX;
  }
  set deltaX(value) {
    this.#deltaX = Math.round(value);
  }
  get deltaY() {
    return this.#deltaY;
  }
  set deltaY(value) {
    this.#deltaY = Math.round(value);
  }
  update(game) {
    this.positionX += this.deltaX;
    this.positionY += this.deltaY;

    if (
      this.positionX < 0 ||
      this.positionX > game.canvas.width ||
      this.positionY < 0 ||
      this.positionY > game.canvas.height
    ) {
      this.isDead = true;
    }
  }
  draw(context) {
    drawRectangle(
      context,
      this.positionX,
      this.positionY,
      this.#width,
      this.#height,
      0,
      "yellow"
    );
  }
}
