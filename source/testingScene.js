import Rectangle from "./rectangle.js";
import Debug from "./debug.js";

export default class TestingScene {
  constructor() {
    this.rectangles = [
      new Rectangle(20, 10, 20, 20, 0, "black"),
      new Rectangle(50, 50, 30, 20, 0, "brown"),
      new Rectangle(150, 150, 50, 50, 120, "blue"),
      new Rectangle(250, 250, 40, 40, 0, "lime"),
    ];
  }
  update(game) {
    this.rectangles[2].rotationDeg--;
    this.rectangles[3].rotationDeg += 10;

    if (this.rectangles[1].isFullyInViewport(game.canvas)) {
      this.rectangles[1].x++;
    }

    if (this.rectangles[0].isInViewPort(game.canvas)) {
      this.rectangles[0].y++;
    }
  }
  draw(context) {
    this.rectangles.forEach((element) => {
      element.draw(context);
    });
  }
}
