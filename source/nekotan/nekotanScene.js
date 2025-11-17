import Debug from "../debug.js";
import TestingHud from "../testingHud.js";
import SpriteSheet from "../spriteSheet.js";
import Sprite from "../sprite.js";
import Food from "./food.js";
import nekotanPhysics from "./nekotanPhysics.js";
import Nekotan from "./nekotan.js";
import { distance, drawText, getCanvasCenter } from "../graphics.js";
import { removeDead } from "../utilities.js";

export default class NekotanScene {
  #testingHud = new TestingHud();
  #fruitsSpritesheet;
  #ufeffSpritesheet;
  #nekotan;
  #foods;
  #physics;
  #foodEaten;
  #growthDelay = 10;
  #gameOver;
  #restartTimer;
  #restartDelay;
  #crunch1;
  #groundTiles;

  constructor(game) {
    this.game = game;

    this.#physics = new nekotanPhysics(this);

    this.#fruitsSpritesheet = new SpriteSheet(
      game.content.getAsset("fruits"),
      16
    );

    this.#ufeffSpritesheet = new SpriteSheet(
      game.content.getAsset("ufeff"),
      16
    );

    this.#crunch1 = game.content.getAsset("crunch1");
    this.start();
  }
  start() {
    this.#nekotan = new Nekotan(
      this,
      getCanvasCenter(this.game.canvas).x - 32,
      getCanvasCenter(this.game.canvas).y - 32
    );
    this.#foods = [];
    this.#foodEaten = 0;
    this.#gameOver = false;
    this.#restartTimer = 0;
    this.#restartDelay = 240;

    this.createGroundTiles();
  }
  createGroundTiles() {
    this.#groundTiles = [];
    const groundScale = 4;
    const groundTileIndex = 128;

    for (let index = 0; index < 10; index++) {
      const newTile = new Sprite(this.#ufeffSpritesheet, groundTileIndex);
      newTile.positionX = index * this.#ufeffSpritesheet.tileSize * groundScale;
      newTile.positionY =
        this.game.canvas.height - this.#ufeffSpritesheet.tileSize * groundScale;
      newTile.scaleX = groundScale;
      newTile.scaleY = groundScale;

      this.#groundTiles.push(newTile);
    }
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
    removeDead(this.#foods);

    this.#foods.forEach((food) => {
      food.update(this);

      this.detectFoodCollision(food);
    });

    this.#nekotan.update(this);

    this.handlePointerInput(game);

    if (this.#gameOver) {
      this.updateRestartTimer();
    }
  }
  updateRestartTimer() {
    if (this.#restartTimer < this.#restartDelay) {
      this.#restartTimer++;
      return;
    }

    this.start();
  }
  detectFoodCollision(food) {
    const nekotanPosition = {
      x: this.#nekotan.positionX + this.#nekotan.width * 0.5,
      y: this.#nekotan.positionY + this.#nekotan.height * 0.5,
    };

    const foodPosition = {
      x: food.positionX + food.width * 0.5,
      y: food.positionY + food.height * 0.5,
    };

    const eatDistance = this.#nekotan.width * 0.5;

    if (distance(nekotanPosition, foodPosition) < eatDistance) {
      this.eatFood(food);
    }
  }
  eatFood(food) {
    food.isDead = true;
    this.#foodEaten++;

    if (this.#foodEaten % this.#growthDelay == 0) {
      this.#nekotan.increaseSize();
    }

    if (this.#nekotan.width >= this.game.canvas.width) {
      this.#gameOver = true;
    }

    this.game.sound.playSoundEffect(this.#crunch1);
  }
  handlePointerInput(game) {
    if (game.input.isClick()) {
      this.onViewportClick(game);
    }
  }
  onViewportClick(game) {
    if (this.#gameOver) {
      return;
    }

    const posX =
      game.input.pointerPosition.x > game.canvas.width - 64
        ? game.canvas.width - 64
        : game.input.pointerPosition.x;

    this.#foods.push(new Food(this, posX, game.input.pointerPosition.y));
  }
  draw(context) {
    if (this.#gameOver) {
      this.drawGameOverText(context);
      return;
    }

    this.drawGround(context);

    this.drawNekotan(context);

    this.drawFood(context);

    this.drawFoodEatenString(context);
  }
  drawGameOverText(context) {
    drawText(
      context,
      `this world can't`,
      64,
      "yellow",
      16,
      getCanvasCenter(context.canvas).y - 60
    );
    drawText(
      context,
      `contain me`,
      64,
      "yellow",
      16,
      getCanvasCenter(context.canvas).y
    );
  }
  drawFoodEatenString(context) {
    const foodStringColor = `rgb(225, ${225 - this.#foodEaten * 0.5},${
      225 - this.#foodEaten
    })`;

    drawText(
      context,
      `food consumed: ${this.#foodEaten}`,
      32 + this.#foodEaten * 0.1,
      foodStringColor,
      32,
      32
    );
  }
  drawNekotan(context) {
    this.#nekotan.draw(context);
  }
  drawFood(context) {
    this.#foods.forEach((element) => {
      element.draw(context);
    });
  }
  drawGround(context) {
    this.#groundTiles.forEach((element) => {
      element.draw(context);
    });
  }
}
