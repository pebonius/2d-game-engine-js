import { drawRectangle } from "./graphics.js";

export default class Rectangle {
  constructor(x, y, width, height, rotationDeg, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotationDeg = rotationDeg;
    this.color = color;
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
