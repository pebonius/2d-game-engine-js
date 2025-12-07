import { drawText, stringWidth } from "../graphics.js";
import { randomNumber, msToTimeString } from "../utilities.js";
import Meadow from "./infiniteBackground.js";
import Ship from "./ship.js";
import Spores from "./spores.js";

export default class MoldyMeadowsScene {
  #dataFilePath = "";
  #imagesPath = "./source/moldy-meadows/assets/";
  #images = ["mold", "ship", "thruster", "shadow"];
  #soundsPath = "./source/moldy-meadows/assets/";
  #sounds = ["thrustersound"];
  #musicTracksPath = "./source/moldy-meadows/assets/";
  #musicTracks = ["anotheraugust"];
  #lastUpdateTime;
  #sceneStartTime;
  #timeSinceLastUpdate;
  #speed;
  #baseSpeed = 25;
  #acceleration = 0.5;
  #minSpeed = 5;
  #maxSpeed = 50;
  #musicDelay = 3000;
  #musicPlaying;
  #thrusterSoundDelay = 200;
  #thrusterSoundTime;

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
  get speed() {
    return this.#speed;
  }
  set speed(value) {
    if (!Number.isSafeInteger) {
      throw new Error("speed needs to be a safe integer");
    }

    if (value >= this.#minSpeed && value <= this.#maxSpeed) {
      this.#speed = value;
    } else if (value > this.#maxSpeed) {
      this.#speed = this.#maxSpeed;
    } else if (value < this.#minSpeed) {
      this.#speed = this.#minSpeed;
    }
  }
  start(game) {
    this.game = game;
    this.#lastUpdateTime = Date.now();
    this.#sceneStartTime = Date.now();
    this.speed = 5;
    this.distanceTraveled = 0;
    this.meadow = new Meadow(this);
    this.ship = new Ship(this);
    this.spores = new Spores(this);
    this.#musicPlaying = false;
    this.#thrusterSoundTime = Date.now();
  }
  update(game) {
    const now = Date.now();
    this.startMusic(now, game);
    this.playThrusterSound(now, game);
    this.#timeSinceLastUpdate = Date.now() - this.#lastUpdateTime;
    this.timeElapsed = Date.now() - this.#sceneStartTime;
    this.distanceTraveled += (this.#timeSinceLastUpdate * this.#speed) / 1000;
    this.#lastUpdateTime = Date.now();
    this.meadow.update(this);
    this.ship.update(this);
    this.spores.update(this);
  }
  startMusic(now, game) {
    if (!this.#musicPlaying && now - this.#sceneStartTime >= this.#musicDelay) {
      game.sound.playMusic(game.content.anotheraugust, true);
    }
  }
  playThrusterSound(now, game) {
    if (now - this.#thrusterSoundTime >
      this.#thrusterSoundDelay - randomNumber(0, this.#thrusterSoundDelay * 0.5) - this.#speed * 2) {
      game.sound.playSoundEffect(game.content.thrustersound, ((this.speed) / this.#maxSpeed));
      this.#thrusterSoundTime = Date.now();
    }
  }

  increaseSpeed() {
    this.speed += this.#acceleration;
  }
  decreaseSpeed() {
    this.speed -= this.#acceleration;
  }
  restoreBaseSpeed() {
    const speedDifference = this.#baseSpeed - this.speed;

    this.speed += speedDifference * 0.01;

    const minDifference = 0.3;
    if (speedDifference >= -minDifference && speedDifference <= minDifference) {
      this.speed = this.#baseSpeed;
    }
  }
  draw(context) {
    this.meadow.draw(context);
    this.ship.draw(context);
    this.spores.draw(context);
    this.drawHud(context);
  }
  drawHud(context) {
    const topMargin = 10;
    const leftMargin = 10;
    const fontSize = 28;
    const unitFontSize = 18;
    const unitTopOffset = fontSize - unitFontSize - 2;
    const fontColor = "paleturquoise";
    const font = "Calibri";

    this.drawTime(
      context,
      fontSize,
      fontColor,
      leftMargin,
      topMargin,
      font,
      unitFontSize,
      unitTopOffset
    );

    this.drawSpeed(
      context,
      fontSize,
      fontColor,
      leftMargin,
      topMargin,
      font,
      unitFontSize,
      unitTopOffset
    );

    this.drawDistance(
      context,
      fontSize,
      fontColor,
      leftMargin,
      topMargin,
      font,
      unitFontSize,
      unitTopOffset
    );
  }

  drawTime(
    context,
    fontSize,
    fontColor,
    leftMargin,
    topMargin,
    font,
    unitFontSize,
    unitTopOffset
  ) {
    const timeString = `${msToTimeString(this.timeElapsed)}`;
    const timeStringWidth = stringWidth(context, timeString, fontSize);
    const posY = topMargin;
    const posX = context.canvas.width - timeStringWidth - leftMargin + 4;
    drawText(context, timeString, fontSize, fontColor, posX, posY, font);
  }
  drawDistance(
    context,
    fontSize,
    fontColor,
    leftMargin,
    topMargin,
    font,
    unitFontSize,
    unitTopOffset
  ) {
    const distanceString = `${Math.round(this.distanceTraveled)}`;
    const distanceStringWidth = stringWidth(context, distanceString, fontSize);
    const posX = context.canvas.width * 0.5 - distanceStringWidth * 0.5;

    drawText(
      context,
      distanceString,
      fontSize,
      fontColor,
      posX,
      topMargin,
      font
    );
    drawText(
      context,
      `m`,
      unitFontSize,
      fontColor,
      posX + distanceStringWidth,
      topMargin + unitTopOffset,
      font
    );
  }
  drawSpeed(
    context,
    fontSize,
    fontColor,
    leftMargin,
    topMargin,
    font,
    unitFontSize,
    unitTopOffset
  ) {
    const speedPercent = Math.floor((this.speed / this.#maxSpeed) * 100);
    const speedString = `${speedPercent}`;
    const speedStringWidth = stringWidth(context, speedString, fontSize);
    const posY = topMargin;
    const randomColor = `rgba(${randomNumber(100, 255)}, ${randomNumber(
      100,
      255
    )}, ${randomNumber(100, 255)}, 1)`;
    const color = speedPercent > 90 ? randomColor : fontColor;
    drawText(context, speedString, fontSize, color, leftMargin, posY, font);
    drawText(
      context,
      `%`,
      unitFontSize,
      color,
      leftMargin + speedStringWidth,
      posY + unitTopOffset,
      font
    );
  }
}
