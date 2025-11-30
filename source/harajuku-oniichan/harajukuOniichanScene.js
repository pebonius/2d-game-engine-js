import { distance, drawRectangle, drawText } from "../graphics.js";
import SpriteSheet from "../spriteSheet.js";
import { passPercentileRoll, randomNumber, removeDead } from "../utilities.js";
import Cow from "./cow.js";
import Explosion from "./explosion.js";
import Oniichan from "./oniichan.js";
import TileMap from "./tileMap.js";

export default class HarajukuOniichanScene {
  #dataFilePath = "";
  #imagesPath = "./source/harajuku-oniichan/assets/";
  #images = ["cow", "explosion", "oniichan", "tileset"];
  #soundsPath = "./source/harajuku-oniichan/assets/";
  #sounds = ["cowmoo", "kaboom", "hurt", "dash", "blaster"];
  #musicTracksPath = "./source/harajuku-oniichan/assets/";
  #musicTracks = ["crazycow", "loop"];
  #points;
  #oniichanSpritesheet;
  #cowSpritesheet;
  #explosionSpritesheet;
  #tileset;
  #cows;
  #lastLifeDecreaseTime;
  #lifeDecreaseDelay = 1000;
  #gameOver;
  #gameOverTime;
  #restartDelay = 2000;
  #musicDelay = 2000;
  #musicStarted = false;
  #explosions;
  #cowKilledTime;
  #cowKilledShakeDuration = 200;
  #shakeForce = 4;

  constructor() {}
  get dataFilePath() {
    return this.#dataFilePath;
  }
  get imagesPath() {
    return this.#imagesPath;
  }
  get images() {
    return this.#images;
  }
  get soundsPath() {
    return this.#soundsPath;
  }
  get sounds() {
    return this.#sounds;
  }
  get musicTracksPath() {
    return this.#musicTracksPath;
  }
  get musicTracks() {
    return this.#musicTracks;
  }
  start(game) {
    this.game = game;
    this.gameStartTime = Date.now();
    this.#musicStarted = false;

    this.#oniichanSpritesheet = new SpriteSheet(game.content.oniichan, 28);
    this.#cowSpritesheet = new SpriteSheet(game.content.cow, 128);
    this.#explosionSpritesheet = new SpriteSheet(game.content.explosion, 20);
    this.#tileset = new SpriteSheet(game.content.tileset, 16);
    this.map = new TileMap(this.#tileset);

    const oniichanOffset = 28;
    const startingPosX = game.canvas.width * 0.5 - oniichanOffset;
    const startingPosY = game.canvas.height * 0.5 - oniichanOffset;

    this.oniichan = new Oniichan(
      startingPosX,
      startingPosY,
      this.#oniichanSpritesheet
    );

    this.#gameOver = false;

    this.#points = 0;

    this.#cows = [];

    this.bullets = [];
    this.maxBullets = 3;

    this.#explosions = [];

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
      this.oniichan.update(game, this);
      this.spawnCows(game);
      this.updateCows(game, this);
    }

    this.updateBullets(game);
    this.updateExplosions(game);

    if (!this.#gameOver && this.oniichan.life <= 0) {
      this.#gameOver = true;
      game.sound.playMusic(game.content.loop, true);
      this.#gameOverTime = Date.now();
    }

    this.checkForRestart(game);
  }
  updateExplosions(game) {
    removeDead(this.#explosions);
    this.#explosions.forEach((explosion) => {
      explosion.update(game);
    });
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
      game.sound.playMusic(game.content.crazycow, true);
    }
  }
  updateCows(game, scene) {
    removeDead(this.#cows);
    this.#cows.forEach((cow) => {
      cow.update(game, scene);
      this.checkCowlisionWithOniichan(cow);
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
    this.addExplosion(bullet);

    this.#points++;
    cow.life--;

    this.killCow(cow, game);
  }
  addExplosion(bullet) {
    this.#explosions.push(
      new Explosion(
        bullet.positionX - 10,
        bullet.positionY - 10,
        this.#explosionSpritesheet
      )
    );
  }
  killCow(cow, game) {
    if (cow.life <= 0) {
      cow.isDead = true;
      this.#points += 10;
      this.#cowKilledTime = Date.now();
      this.explodeCow(cow);

      game.sound.playSoundEffect(game.content.kaboom);
    }
  }
  explodeCow(cow) {
    const explosionNumber = 10;

    for (let index = 0; index < explosionNumber; index++) {
      const posX = randomNumber(cow.positionX, cow.positionX + cow.width);
      const posY = randomNumber(cow.positionY, cow.positionY + cow.height);

      this.#explosions.push(
        new Explosion(posX, posY, this.#explosionSpritesheet)
      );
    }
  }
  mapIsShaking() {
    if (!this.#cowKilledTime) {
      return false;
    }

    if (Date.now() - this.#cowKilledTime > this.#cowKilledShakeDuration) {
      return false;
    }

    return true;
  }
  checkCowlisionWithOniichan(cow) {
    if (!this.canHurtOniichan()) {
      return;
    }

    const oniichanMiddle = {
      x: this.oniichan.positionX + this.oniichan.width * 0.5,
      y: this.oniichan.positionY + this.oniichan.height * 0.5,
    };

    const cowMiddle = {
      x: cow.positionX + cow.width * 0.5,
      y: cow.positionY + cow.height * 0.5,
    };

    const collisionDistance = 40;

    if (distance(oniichanMiddle, cowMiddle) < collisionDistance) {
      this.hurtOniichan();
    }
  }
  canHurtOniichan() {
    return Date.now() - this.#lastLifeDecreaseTime > this.#lifeDecreaseDelay;
  }
  hurtOniichan() {
    if (this.canHurtOniichan()) {
      this.#lastLifeDecreaseTime = Date.now();
      this.oniichan.life--;
      this.game.sound.playSoundEffect(this.game.content.hurt);
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
    const shakeOffset = this.mapIsShaking()
      ? randomNumber(-this.#shakeForce, this.#shakeForce)
      : 0;
    this.map.draw(context, shakeOffset);
    this.drawSprites(context);
    this.drawExplosions(context);
    this.drawLife(context);
    this.drawPoints(context);
    this.drawGameOverText(context);
  }
  drawSprites(context) {
    const toDraw = this.#cows.concat(this.bullets);

    if (!this.canHurtOniichan()) {
      const blink = randomNumber(0, 1) === 1 ? true : false;
      if (blink) {
        toDraw.push(this.oniichan);
      }
    } else {
      toDraw.push(this.oniichan);
    }

    toDraw.sort((a, b) => a.positionY - b.positionY);

    toDraw.forEach((sprite) => {
      sprite.draw(context);
    });
  }
  drawExplosions(context) {
    this.#explosions.forEach((explosion) => {
      explosion.draw(context);
    });
  }
  drawLife(context) {
    drawText(context, `LIFE: ${this.oniichan.life}`, 32, "white", 30, 30);
  }
  drawPoints(context) {
    drawText(context, `POINTS: ${this.#points}`, 32, "white", 360, 30);
  }
  drawGameOverText(context) {
    if (!this.#gameOver) {
      return;
    }

    drawRectangle(
      context,
      0,
      0,
      context.canvas.width,
      context.canvas.height,
      0,
      "rgba(0, 0, 0, 0.5"
    );

    const gameOverMessage = "GOODNIGHT ONIICHAN";
    const gameOverMessageFontSize = 32;
    const gameOverMessageX = 160;
    const gameOverMessageY = 160;

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

    const scoreMessage = `YOUR SCORE: ${this.#points}`;
    const scoreMessageOffsetY = 50;

    drawText(
      context,
      scoreMessage,
      gameOverMessageFontSize,
      "black",
      gameOverMessageX + 1,
      gameOverMessageY + scoreMessageOffsetY + 1
    );
    drawText(
      context,
      scoreMessage,
      gameOverMessageFontSize,
      "red",
      gameOverMessageX,
      gameOverMessageY + scoreMessageOffsetY
    );

    const restartMessage = "PRESS Z TO RESTART";
    const restartMessageOffsetY = 100;
    drawText(
      context,
      restartMessage,
      gameOverMessageFontSize,
      "black",
      gameOverMessageX + 1,
      gameOverMessageY + 1 + restartMessageOffsetY
    );
    drawText(
      context,
      restartMessage,
      gameOverMessageFontSize,
      "red",
      gameOverMessageX,
      gameOverMessageY + restartMessageOffsetY
    );
  }
}
