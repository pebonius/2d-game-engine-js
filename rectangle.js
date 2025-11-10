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
