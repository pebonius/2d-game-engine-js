import Debug from "../debug.js";
import TestingHud from "../testingHud.js";
import SpriteSheet from "../spriteSheet.js";
import Sprite from "../sprite.js";
import Food from "./food.js";
import nekotanPhysics from "./nekotanPhysics.js";
import Nekotan from "./nekotan.js";
import { drawText, getCanvasCenter } from "../graphics.js";

export default class NekotanScene {
  #testingHud = new TestingHud();
  #fruitsSpritesheet;
  #ufeffSpritesheet;
  #nekotan;
  #apples = [];
  #physics = new nekotanPhysics();
  #foodEaten = 0;

  constructor(game) {
    this.game = game;

    this.#fruitsSpritesheet = new SpriteSheet(
      game.content.getAsset("fruits"),
      16
    );

    this.#ufeffSpritesheet = new SpriteSheet(
      game.content.getAsset("ufeff"),
      16
    );

    this.#nekotan = new Nekotan(
      this,
      getCanvasCenter(game.canvas).x - 32,
      getCanvasCenter(game.canvas).y - 32
    );
  }
  get fruitsSpritesheet() {
    return this.#fruitsSpritesheet;
  }
  get ufeffSpritesheet() {
    return this.#ufeffSpritesheet;
  }
  get physics() {
    return this.#physics;
  }
  update(game) {
    this.#apples.forEach((element) => {
      element.update(this);
    });

    this.#nekotan.update(this);

    this.#testingHud.update(game);

    this.handlePointerInput(game);
  }
  handlePointerInput(game) {
    if (game.input.isClick()) {
      this.onViewportClick(game);
    }
  }
  onViewportClick(game) {
    const posX =
      game.input.pointerPosition.x > game.canvas.width - 64
        ? game.canvas.width - 64
        : game.input.pointerPosition.x;

    this.#apples.push(new Food(this, posX, game.input.pointerPosition.y));
  }
  draw(context) {
    this.#apples.forEach((element) => {
      element.draw(context);
    });

    this.#nekotan.draw(context);

    drawText(context, `food consumed: ${this.#foodEaten}`, 32, "lime", 32, 32);

    this.#testingHud.draw(context);
  }
}
