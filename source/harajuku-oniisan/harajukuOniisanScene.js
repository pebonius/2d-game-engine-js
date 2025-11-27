import { distance, drawText } from "../graphics.js";
import SpriteSheet from "../spriteSheet.js";
import { randomNumber } from "../utilities.js";
import Cow from "./cow.js";
import Oniisan from "./oniisan.js";
import TileMap from "./tileMap.js";

export default class HarajukuOniisanScene {
  #points;
  #oniisanSpritesheet;
  #cowSpritesheet;
  #explosionSpritesheet;
  #tileset;
  #cows;
  #lastCowSpawnTime;
  #cowSpawnDelay = 5000;
  #maxCows = 100;
  #lastLifeDecreaseTime;
  #lifeDecreaseDelay = 1000;
  #gameOver;
  #gameOverTime;
  #restartDelay = 1000;

  constructor(game) {
    this.game = game;
    this.#oniisanSpritesheet = new SpriteSheet(game.content.oniisan, 28);
    this.#cowSpritesheet = new SpriteSheet(game.content.cow, 128);
    this.#tileset = new SpriteSheet(game.content.tileset, 16);
    this.map = new TileMap(this.#tileset);
    this.start(game);
  }
  start(game) {
    const oniisanOffset = 28;
    const startingPosX = game.canvas.width * 0.5 - oniisanOffset;
    const startingPosY = game.canvas.height * 0.5 - oniisanOffset;

    this.oniisan = new Oniisan(
      startingPosX,
      startingPosY,
      this.#oniisanSpritesheet
    );

    this.#gameOver = false;

    this.#points = 0;

    this.#cows = [];

    this.#lastCowSpawnTime = Date.now();

    this.#lastLifeDecreaseTime = Date.now();
  }
  update(game) {
    if (!this.#gameOver) {
      this.oniisan.update(game);
      this.updateCows(game, this);
      this.spawnCows(game);
    }

    if (!this.#gameOver && this.oniisan.life <= 0) {
      this.#gameOver = true;
      this.#gameOverTime = Date.now();
    }

    this.checkForRestart(game);
  }
  checkForRestart(game) {
    if (
      this.#gameOver &&
      Date.now() - this.#gameOverTime > this.#restartDelay &&
      game.input.isKeyPressed(game.input.keys.Z)
    ) {
      this.start(this.game);
    }
  }
  updateCows(game, scene) {
    this.#cows.forEach((cow) => {
      cow.update(game, scene);

      this.checkCowlisionWithOniisan(cow);
    });
  }
  checkCowlisionWithOniisan(cow) {
    if (!this.canHurtOniisan()) {
      return;
    }

    const oniisanMiddle = {
      x: this.oniisan.positionX + this.oniisan.width * 0.5,
      y: this.oniisan.positionY + this.oniisan.height * 0.5,
    };

    const cowMiddle = {
      x: cow.positionX + cow.width * 0.5,
      y: cow.positionY + cow.height * 0.5,
    };

    const collisionDistance = 60;

    if (distance(oniisanMiddle, cowMiddle) < 60) {
      this.hurtOniisan();
    }
  }
  canHurtOniisan() {
    return Date.now() - this.#lastLifeDecreaseTime > this.#lifeDecreaseDelay;
  }
  hurtOniisan() {
    if (this.canHurtOniisan()) {
      this.#lastLifeDecreaseTime = Date.now();
      this.oniisan.life--;
    }
  }
  spawnCows(game) {
    if (
      Date.now() - this.#lastCowSpawnTime > this.#cowSpawnDelay &&
      this.#cows.length < this.#maxCows
    ) {
      this.#lastCowSpawnTime = Date.now();

      const side = randomNumber(0, 1);

      const posX = !side ? 0 : game.canvas.width;
      const posY = randomNumber(0, game.canvas.height);

      this.#cows.push(new Cow(posX, posY, this.#cowSpritesheet));
    }
  }
  draw(context) {
    this.map.draw(context);
    this.oniisan.draw(context);
    this.drawCows(context);
    this.drawLife(context);
    this.drawPoints(context);
    this.drawGameOverText(context);
  }
  drawCows(context) {
    this.#cows.sort((a, b) => a.positionY - b.positionY);

    this.#cows.forEach((cow) => {
      cow.draw(context);
    });
  }
  drawLife(context) {
    drawText(context, `LIFE: ${this.oniisan.life}`, 32, "white", 30, 30);
  }
  drawPoints(context) {
    drawText(context, `POINTS: ${this.#points}`, 32, "white", 360, 30);
  }
  drawGameOverText(context) {
    if (!this.#gameOver) {
      return;
    }
    const gameOverMessage = "GOODNIGHT ONIISAN";
    const gameOverMessageFontSize = 32;
    const gameOverMessageX = 180;
    const gameOverMessageY = 200;

    drawText(
      context,
      gameOverMessage,
      gameOverMessageFontSize,
      "black",
      gameOverMessageX + 1,
      gameOverMessageY + 1
    );
    drawText(
      context,
      gameOverMessage,
      gameOverMessageFontSize,
      "red",
      gameOverMessageX,
      gameOverMessageY
    );
    drawText(
      context,
      "PRESS Z TO RESTART",
      gameOverMessageFontSize,
      "black",
      gameOverMessageX + 1,
      gameOverMessageY + 51
    );
    drawText(
      context,
      "PRESS Z TO RESTART",
      gameOverMessageFontSize,
      "red",
      gameOverMessageX,
      gameOverMessageY + 50
    );
  }
}
