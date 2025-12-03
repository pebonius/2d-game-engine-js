import { drawText } from "../graphics.js";
import { msToTimeString } from "../utilities.js";

export default class MoldyMeadowsScene {
  #dataFilePath = "";
  #imagesPath = "./source/harajuku-oniichan/assets/";
  #images = ["cow", "explosion", "oniichan", "tileset"];
  #soundsPath = "./source/harajuku-oniichan/assets/";
  #sounds = ["cowmoo", "kaboom", "hurt", "dash", "blaster"];
  #musicTracksPath = "./source/harajuku-oniichan/assets/";
  #musicTracks = ["crazycow", "loop"];
  #timeElapsed;

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
  }
  update(game) {
    this.#timeElapsed = Date.now() - this.sceneStartedTime;
  }
  draw(context) {
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
