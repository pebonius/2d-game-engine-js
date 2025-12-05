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
  #maxSpeed = 33;

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
    this.restoreBaseSpeed();
  }
  restoreBaseSpeed() {
    const speedDifference = this.#baseSpeed - this.speed;

    this.speed += speedDifference * 0.01;
  }
  handleInput(game) {
    if (game.input.isKeyDown(game.input.keys.UP)) {
      this.speed += this.#acceleration;
    }
    if (game.input.isKeyDown(game.input.keys.DOWN)) {
      this.speed -= this.#acceleration;
    }
  }
  draw(context) {
    this.meadow.draw(context);
    drawText(
      context,
      `speed: ${Math.floor(this.speed)} m/s`,
      32,
      "paleturquoise",
      10,
      10,
      "Calibri"
    );
    drawText(
      context,
      `distance traveled: ${Math.floor(this.distanceTraveled)} m`,
      32,
      "paleturquoise",
      10,
      42,
      "Calibri"
    );
    drawText(
      context,
      `time elapsed: ${msToTimeString(this.timeElapsed)}`,
      32,
      "paleturquoise",
      10,
      74,
      "Calibri"
    );
  }
}
