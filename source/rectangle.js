import { drawRectangle, normalizeRotationDegrees } from "./graphics.js";

export default class Rectangle {
  #x = 0;
  #y = 0;
  #width = 0;
  #height = 0;
  #rotationDeg = 0;
  #color = "black";

  constructor(x, y, width, height, rotationDeg, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotationDeg = rotationDeg;
    this.color = color;
  }
  get x() {
    return this.#x;
  }
  set x(value) {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `provided value should be an integer, and was ${typeof value}`
      );
    }

    this.#x = value;
  }
  get y() {
    return this.#y;
  }
  set y(value) {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `provided value should be an integer, and was ${typeof value}`
      );
    }

    this.#y = value;
  }
  get width() {
    return this.#width;
  }
  set width(value) {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `provided value should be an integer, and was ${typeof value}`
      );
    }

    this.#width = value;
  }
  get height() {
    return this.#height;
  }
  set height(value) {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `provided value should be an integer, and was ${typeof value}`
      );
    }

    this.#height = value;
  }
  get rotationDeg() {
    return this.#rotationDeg;
  }
  set rotationDeg(value) {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `provided value should be an integer, and was ${typeof value}`
      );
    }

    this.#rotationDeg = normalizeRotationDegrees(value);
  }
  get color() {
    return this.#color;
  }
  set color(value) {
    if (typeof value !== "string") {
      throw new RangeError(
        `provided value should be a string, and was ${typeof value}`
      );
    }

    this.#color = value;
  }
  isInViewPort(canvas) {
    return (
      this.x > 1 - this.width &&
      this.x + 1 < canvas.width &&
      this.y > 1 - this.height &&
      this.y + 1 < canvas.height
    );
  }
  isFullyInViewport(canvas) {
    return (
      this.x > 0 &&
      this.x + this.width < canvas.width &&
      this.y > 0 &&
      this.y + this.height < canvas.height
    );
  }
  draw(context) {
    drawRectangle(
      context,
      this.x,
      this.y,
      this.width,
      this.height,
      this.rotationDeg,
      this.color
    );
  }
}
