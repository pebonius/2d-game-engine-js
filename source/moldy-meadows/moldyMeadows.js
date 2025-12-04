import { drawSprite, drawText } from "../graphics.js";
import { msToTimeString } from "../utilities.js";

export default class MoldyMeadowsScene {
  #dataFilePath = "";
  #imagesPath = "./source/moldy-meadows/assets/";
  #images = ["mold"];
  #soundsPath = "./source/moldy-meadows/assets/";
  #sounds = [];
  #musicTracksPath = "./source/moldy-meadows/assets/";
  #musicTracks = [];
  #timeElapsed;
  #moldBackground;

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
    this.sceneStartedTime = Date.now();
    this.#moldBackground = game.content.mold;
  }
  update(game) {
    this.#timeElapsed = Date.now() - this.sceneStartedTime;
  }
  draw(context) {
    drawSprite(
      context,
      this.#moldBackground,
      1,
      1,
      this.#moldBackground.width,
      this.#moldBackground.height,
      false,
      false,
      2,
      2,
      0
    );
    drawText(
      context,
      `time elapsed: ${msToTimeString(this.#timeElapsed)}`,
      20,
      "white",
      10,
      10
    );
  }
}
