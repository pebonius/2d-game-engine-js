import Rectangle from "./rectangle.js";

export default class TestingScene {
  constructor() {
    this.rectangles = [
      new Rectangle(20, 10, 20, 20, 0, "black"),
      new Rectangle(50, 50, 30, 20, 0, "brown"),
      new Rectangle(150, 150, 50, 50, 120, "blue"),
    ];
  }
  update(game) {
    this.rectangles[2].rotationDeg++;

    if (this.rectangles[1].isFullyInViewport(game.canvas)) {
      this.rectangles[1].x++;
    }

    if (this.rectangles[0].isInViewPort(game.canvas)) {
      this.rectangles[0].x--;
    }
  }
  draw(context) {
    this.rectangles.forEach((element) => {
      element.draw(context);
    });
  }
}
