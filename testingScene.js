import Rectangle from "./rectangle.js";

export default class TestingScene {
  constructor() {
    this.rectangles = [
      new Rectangle(10, 10, 10, 10, 45, "black"),
      new Rectangle(50, 50, 30, 20, 0, "brown"),
      new Rectangle(150, 150, 50, 50, 120, "blue"),
    ];
  }
  update() {
    this.rectangles.forEach((element) => {
      element.rotationDeg++;
    });
  }
  draw(context) {
    this.rectangles.forEach((element) => {
      element.draw(context);
    });
  }
}
