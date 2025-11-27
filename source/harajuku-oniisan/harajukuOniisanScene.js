import { distance, drawText } from "../graphics.js";
import SpriteSheet from "../spriteSheet.js";
import { passPercentileRoll, randomNumber, removeDead } from "../utilities.js";
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
  #lastLifeDecreaseTime;
  #lifeDecreaseDelay = 1000;
  #gameOver;
  #gameOverTime;
  #restartDelay = 1000;
  #musicDelay = 2000;
  #musicStarted = false;

  constructor(game) {
    this.game = game;
    this.#oniisanSpritesheet = new SpriteSheet(game.content.oniisan, 28);
    this.#cowSpritesheet = new SpriteSheet(game.content.cow, 128);
    this.#tileset = new SpriteSheet(game.content.tileset, 16);
    this.start(game);
  }
  start(game) {
    this.gameStartTime = Date.now();
    this.#musicStarted = false;
    this.map = new TileMap(this.#tileset);

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

    this.bullets = [];
    this.maxBullets = 3;

    this.#lastLifeDecreaseTime = Date.now();
  }
  update(game) {
    if (
      !this.#musicStarted &&
      Date.now() - this.gameStartTime > this.#musicDelay
    ) {
      this.#musicStarted = true;
      game.sound.playMusic(game.content.crazycow, true);
    }

    if (!this.#gameOver) {
      this.oniisan.update(game, this);
      this.updateBullets(game);
      this.updateCows(game, this);
      this.spawnCows(game);
    }

    if (!this.#gameOver && this.oniisan.life <= 0) {
      this.#gameOver = true;
      this.#gameOverTime = Date.now();
    }

    this.checkForRestart(game);
  }
  updateBullets(game) {
    removeDead(this.bullets);

    this.bullets.forEach((bullet) => {
      bullet.update(game);
    });
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
    removeDead(this.#cows);
    this.#cows.forEach((cow) => {
      cow.update(game, scene);
      this.checkCowlisionWithOniisan(cow);
      this.checkCowlisionWithBullets(cow, game);
    });
  }
  checkCowlisionWithBullets(cow, game) {
    this.bullets.forEach((bullet) => {
      if (!bullet.isDead) {
        const bulletMiddle = {
          x: bullet.positionX + bullet.width * 0.5,
          y: bullet.positionY + bullet.height * 0.5,
        };

        const cowMiddle = {
          x: cow.positionX + cow.width * 0.5,
          y: cow.positionY + cow.height * 0.5,
        };

        const collisionDistance = 40;

        if (distance(bulletMiddle, cowMiddle) < collisionDistance) {
          this.collideWithBullet(cow, bullet, game);
        }
      }
    });
  }
  collideWithBullet(cow, bullet, game) {
    bullet.isDead = true;

    this.#points++;
    cow.life--;

    this.killCow(cow, game);
  }
  killCow(cow, game) {
    if (cow.life <= 0) {
      cow.isDead = true;
      this.#points += 10;

      game.sound.playSoundEffect(game.content.kaboom);
    }
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

    const collisionDistance = 40;

    if (distance(oniisanMiddle, cowMiddle) < collisionDistance) {
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
    const spawnChance = 1 + Math.floor(this.#points / 200);
    const maxCows = 2 + Math.floor(this.#points / 100);

    if (this.#cows.length < maxCows && passPercentileRoll(spawnChance)) {
      this.addCow(game);
    }
  }
  addCow(game) {
    const side = randomNumber(0, 1);

    const posX = !side ? -100 : game.canvas.width;
    const posY = randomNumber(0, game.canvas.height);

    this.#cows.push(new Cow(posX, posY, this.#cowSpritesheet));

    game.sound.playSoundEffect(game.content.cowmoo);
  }
  draw(context) {
    this.map.draw(context);
    this.drawSprites(context);
    this.drawLife(context);
    this.drawPoints(context);
    this.drawGameOverText(context);
  }
  drawSprites(context) {
    const toDraw = this.#cows.concat(this.bullets);
    toDraw.push(this.oniisan);
    toDraw.sort((a, b) => a.positionY - b.positionY);

    toDraw.forEach((sprite) => {
      sprite.draw(context);
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
