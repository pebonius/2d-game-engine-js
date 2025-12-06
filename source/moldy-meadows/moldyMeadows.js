import { drawSprite, drawText } from "../graphics.js";
import { msToTimeString } from "../utilities.js";
import Meadow from "./infiniteBackground.js";
import Ship from "./ship.js";

export default class MoldyMeadowsScene {
  #dataFilePath = "";
  #imagesPath = "./source/moldy-meadows/assets/";
  #images = ["mold", "ship", "thruster", "shadow"];
  #soundsPath = "./source/moldy-meadows/assets/";
  #sounds = [];
  #musicTracksPath = "./source/moldy-meadows/assets/";
  #musicTracks = [];
  #lastUpdateTime;
  #sceneStartTime;
  #timeSinceLastUpdate;
  #speed;
  #baseSpeed = 25;
  #acceleration = 0.5;
  #speedThrottle = 0.1;
  #minSpeed = 5;
  #maxSpeed = 50;

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
  }
  update(game) {
    this.#timeSinceLastUpdate = Date.now() - this.#lastUpdateTime;
    this.timeElapsed = Date.now() - this.#sceneStartTime;
    this.distanceTraveled += (this.#timeSinceLastUpdate * this.#speed) / 1000;
    this.#lastUpdateTime = Date.now();
    this.meadow.update(this);
    this.ship.update(this);
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

    const topMargin = 10;
    const leftMargin = 10;
    const fontSize = 28;
    const unitFontSize = 18;
    const unitTopOffset = fontSize - unitFontSize - 2;
    const fontColor = "paleturquoise";
    const font = "Calibri";

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
    const posY = topMargin + fontSize * 2;
    drawText(context, timeString, fontSize, fontColor, leftMargin, posY, font);
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
    const distanceString = `${Math.round(this.distanceTraveled)} `;

    drawText(
      context,
      distanceString,
      fontSize,
      fontColor,
      leftMargin,
      topMargin + fontSize,
      font
    );
    drawText(
      context,
      `m`,
      unitFontSize,
      fontColor,
      leftMargin + context.measureText(distanceString).width,
      topMargin + fontSize + unitTopOffset,
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
    const speedString = `${Math.floor((this.speed / this.#maxSpeed) * 100)} `;
    const posY = topMargin;
    drawText(context, speedString, fontSize, fontColor, leftMargin, posY, font);
    drawText(
      context,
      `%`,
      unitFontSize,
      fontColor,
      leftMargin + context.measureText(speedString).width,
      posY + unitTopOffset,
      font
    );
  }
}
