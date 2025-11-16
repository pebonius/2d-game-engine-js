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
  #ufeffSpritesheet;
  #neko;

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

    this.#ufeffSpritesheet = new SpriteSheet(
      game.content.getAsset("ufeff"),
      16
    );

    this.#neko = new Sprite(this.#ufeffSpritesheet, 32);
    this.#neko.positionX = 400;
    this.#neko.positionY = 300;
    this.#neko.scaleX = 8;
    this.#neko.scaleY = 8;
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

    this.handlePointerInput(game);
  }
  handlePointerInput(game) {
    if (game.input.isClick()) {
      this.onViewportClick(game);
    }
  }
  onViewportClick(game) {
    this.#rectangles.push(
      new Rectangle(
        game.input.pointerPosition.x,
        game.input.pointerPosition.y,
        32,
        32,
        0,
        "yellow"
      )
    );
  }
  draw(context) {
    this.#rectangles.forEach((element) => {
      element.draw(context);
    });

    this.#apple.draw(context);
    this.#neko.draw(context);

    this.#testingHud.draw(context);
  }
}
