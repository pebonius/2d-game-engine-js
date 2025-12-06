import { drawSprite, drawText } from "../graphics.js";
import { msToTimeString } from "../utilities.js";
import Meadow from "./infiniteBackground.js";

export default class MoldyMeadowsScene {
  #dataFilePath = "";
  #imagesPath = "./source/moldy-meadows/assets/";
  #images = ["mold"];
  #soundsPath = "./source/moldy-meadows/assets/";
  #sounds = [];
  #musicTracksPath = "./source/moldy-meadows/assets/";
  #musicTracks = [];
  #lastUpdateTime;
  #sceneStartTime;
  #timeSinceLastUpdate;
  #speed;
  #baseSpeed = 10;
  #acceleration = 0.5;
  #speedThrottle = 0.1;
  #minSpeed = 1;
  #maxSpeed = 32;

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
    this.speed = 3;
    this.distanceTraveled = 0;
    this.meadow = new Meadow(this);
  }
  update(game) {
    this.#timeSinceLastUpdate = Date.now() - this.#lastUpdateTime;
    this.timeElapsed = Date.now() - this.#sceneStartTime;
    this.distanceTraveled += (this.#timeSinceLastUpdate * this.#speed) / 1000;
    this.#lastUpdateTime = Date.now();
    this.meadow.update(this);
    this.handleInput(game);
  }
  handleInput(game) {
    if (game.input.isKeyDown(game.input.keys.UP)) {
      this.speed += this.#acceleration;
    } else if (game.input.isKeyDown(game.input.keys.DOWN)) {
      this.speed -= this.#acceleration;
    } else {
      this.restoreBaseSpeed();
    }
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

    const topMargin = 10;
    const leftMargin = 10;
    const fontSize = 28;
    const fontColor = "paleturquoise";
    const font = "Calibri";

    drawText(
      context,
      `speed: ${Math.floor(this.speed)} m/s`,
      fontSize,
      fontColor,
      leftMargin,
      topMargin,
      font
    );
    drawText(
      context,
      `distance traveled: ${Math.round(this.distanceTraveled)} m`,
      fontSize,
      fontColor,
      leftMargin,
      topMargin + fontSize,
      font
    );
    drawText(
      context,
      `time elapsed: ${msToTimeString(this.timeElapsed)}`,
      fontSize,
      fontColor,
      leftMargin,
      topMargin + fontSize * 2,
      font
    );
  }
}
