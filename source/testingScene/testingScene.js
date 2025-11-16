import Debug from "../debug.js";
import TestingHud from "../testingHud.js";
import SpriteSheet from "../spriteSheet.js";
import Sprite from "../sprite.js";
import Apple from "./apple.js";
import TestingScenePhysics from "./testingScenePhysics.js";

export default class TestingScene {
  #testingHud = new TestingHud();
  #fruitsSpritesheet;
  #ufeffSpritesheet;
  #neko;
  #apples = [];
  #physics = new TestingScenePhysics();

  constructor(game) {
    this.#fruitsSpritesheet = new SpriteSheet(
      game.content.getAsset("fruits"),
      16
    );

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
  get fruitsSpritesheet() {
    return this.#fruitsSpritesheet;
  }
  update(game) {
    this.#apples.forEach((element) => {
      this.#physics.applyGravity(element, game.canvas);
      this.#physics.applyDamping(element, game.canvas);
      element.update(this);
    });

    this.#testingHud.update(game);

    this.handlePointerInput(game);
  }
  handlePointerInput(game) {
    if (game.input.isClick()) {
      this.onViewportClick(game);
    }
  }
  onViewportClick(game) {
    this.#apples.push(
      new Apple(
        this,
        game.input.pointerPosition.x,
        game.input.pointerPosition.y
      )
    );
  }
  draw(context) {
    this.#apples.forEach((element) => {
      element.draw(context);
    });

    this.#neko.draw(context);

    this.#testingHud.draw(context);
  }
}
