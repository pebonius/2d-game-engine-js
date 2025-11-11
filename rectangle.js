import { drawRectangle, normalizeRotationDegrees } from "./graphics.js";

export default class Rectangle {
  constructor(x, y, width, height, rotationDeg, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotationDeg = rotationDeg;
    this.color = color;
  }
  get rotationDeg() {
    return this._rotationDeg;
  }
  set rotationDeg(value) {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `provided value should be an integer, and was ${typeof value}`
      );
    }

    this._rotationDeg = normalizeRotationDegrees(value);
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
      this._rotationDeg,
      this.color
    );
  }
}
