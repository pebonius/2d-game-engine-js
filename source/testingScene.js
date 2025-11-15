import Rectangle from "./rectangle.js";
import Debug from "./debug.js";
import TestingHud from "./testingHud.js";
import SpriteSheet from "./spriteSheet.js";
import Sprite from "./sprite.js";

export default class TestingScene {
  #testingHud = new TestingHud();
  #rectangles = [
    new Rectangle(20, 10, 20, 20, 0, "black"),
    new Rectangle(50, 50, 30, 20, 0, "brown"),
    new Rectangle(150, 150, 50, 50, 120, "blue"),
    new Rectangle(250, 250, 40, 40, 0, "lime"),
  ];
  #fruitsSpritesheet;
  #apple;
  #animalsSpriteSheet;

  constructor(game) {
    this.#fruitsSpritesheet = new SpriteSheet(
      game.content.getAsset("fruits"),
      16
    );

    this.#apple = new Sprite(this.#fruitsSpritesheet, 12);
    this.#apple.positionX = 400;
    this.#apple.positionY = 250;
    this.#apple.scaleX = 4;
    this.#apple.scaleY = 4;
    this.#apple.flipX = true;
    this.#apple.flipY = true;
    this.#apple.rotationDeg = 180;
  }
  update(game) {
    this.#rectangles[2].rotationDeg--;
    this.#rectangles[3].rotationDeg += 10;

    if (this.#rectangles[1].isFullyInViewport(game.canvas)) {
      this.#rectangles[1].x++;
    }

    if (this.#rectangles[0].isInViewPort(game.canvas)) {
      this.#rectangles[0].y++;
    }

    this.#testingHud.update(game);
  }
  draw(context) {
    this.#rectangles.forEach((element) => {
      element.draw(context);
    });

    this.#apple.draw(context);

    this.#testingHud.draw(context);
  }
}
