import {
  arrayContains,
  isBool,
  isFunction,
  isNonEmptyString,
  noCacheInit,
  removeFromArray,
} from "./utilities.js";
import Debug from "./debug.js";

export default class ContentManager {
  #assetsCurrentlyLoading = [];
  #loadingAllAssetsWasTriggered = false;
  #onFinishedLoading;
  #dataFilePath = "";
  #imagesPath = "./source/harajuku-oniichan/assets/";
  #images = ["cow", "explosion", "oniichan", "tileset"];
  #soundsPath = "./source/harajuku-oniichan/assets/";
  #sounds = ["cowmoo", "kaboom", "hurt", "dash", "blaster"];
  #musicTracksPath = "./source/harajuku-oniichan/assets/";
  #musicTracks = ["crazycow", "loop"];

  constructor() {}
  get assetsCurrentlyLoading() {
    return this.#assetsCurrentlyLoading;
  }
  get loadingAllAssetsWasTriggered() {
    return this.#loadingAllAssetsWasTriggered;
  }
  set loadingAllAssetsWasTriggered(value) {
    if (!isBool(value)) {
      throw new TypeError("value must be a bool");
    }
    this.#loadingAllAssetsWasTriggered = value;
  }
  get finishedLoadingAssets() {
    return (
      this.loadingAllAssetsWasTriggered &&
      this.assetsCurrentlyLoading.length == 0
    );
  }
  get onFinishedLoading() {
    return this.#onFinishedLoading;
  }
  set onFinishedLoading(value) {
    if (!isFunction(value)) {
      throw new TypeError("onFinishedLoading must be a function");
    }
    this.#onFinishedLoading = value;
  }
  get loadingId() {
    return this.assetsCurrentlyLoading.length;
  }
  loadContent() {
    this.loadData();
    this.loadImages();
    this.loadSounds();
    this.loadMusic();

    this.loadingAllAssetsWasTriggered = true;
    this.checkIfLoadingFinished();
  }
  loadData() {
    if (!this.#dataFilePath) {
      return;
    }

    this.loadJsonObject((json) => {
      this.data = json;
    }, this.#dataFilePath);
  }
  loadJsonObject(assetInjection, filePath) {
    this.debugLogAssetLoading(filePath);
    this.addToLoadingArray(filePath);

    const request = new Request(filePath);
    const init = noCacheInit();

    fetch(request, init)
      .then((response) => response.json())
      .then((json) => {
        assetInjection(json);
        this.removeFromLoadingArray(filePath);
      });
  }
  loadImages() {
    if (!this.#imagesPath) {
      Debug.log("path for images not defined, image content not loaded");
      return;
    }

    const images = this.#images;

    if (images.length === 0) {
      Debug.log("no images defined, image content not loaded");
      return;
    }

    images.forEach((imageName) => {
      this.loadImage((image) => {
        this[imageName] = image;
      }, `${this.#imagesPath}${imageName}.png`);
    });
  }
  loadImage(assetInjection, filePath) {
    this.debugLogAssetLoading(filePath);
    this.addToLoadingArray(filePath);

    const image = new Image();
    image.src = filePath;
    assetInjection(image);

    const onLoad = () => {
      this.removeFromLoadingArray(filePath);
    };

    image.onload = (e) => {
      onLoad();

      image.onload = (e) => {};
    };

    if (image.complete) {
      onLoad();
    }
  }
  loadSounds() {
    if (!this.#soundsPath) {
      Debug.log("path for sounds not defined, sound content not loaded");
      return;
    }

    const sounds = this.#sounds;

    if (sounds.length === 0) {
      Debug.log("no sounds defined, sound content not loaded");
      return;
    }

    sounds.forEach((soundName) => {
      this.loadAudio((audio) => {
        this[soundName] = audio;
      }, `${this.#soundsPath}${soundName}.ogg`);
    });
  }
  loadAudio(assetInjection, filePath) {
    this.debugLogAssetLoading(filePath);
    this.addToLoadingArray(filePath);

    const audio = new Audio(filePath);

    audio.oncanplay = (e) => {
      assetInjection(audio);
      this.removeFromLoadingArray(filePath);

      audio.oncanplay = (e) => {};
    };
  }
  loadMusic() {
    if (!this.#musicTracksPath) {
      Debug.log("path for music not defined, music content not loaded");
      return;
    }

    const tracks = this.#musicTracks;

    if (tracks.length === 0) {
      Debug.log("no tracks defined, music content not loaded");
      return;
    }

    tracks.forEach((trackName) => {
      this.loadAudio((audio) => {
        this[trackName] = audio;
      }, `${this.#musicTracksPath}${trackName}.ogg`);
    });
  }
  debugLogAssetLoading(filePath) {
    if (!isNonEmptyString(filePath)) {
      throw new TypeError("path must be a non-empty string");
    }
    Debug.log("loading: " + filePath);
  }
  debugLogAssetLoaded(filePath) {
    if (!isNonEmptyString(filePath)) {
      throw new TypeError("path must be a non-empty string");
    }
    Debug.log(`${filePath} ...LOADED`);
  }
  addToLoadingArray(filePath) {
    this.assetsCurrentlyLoading.push(filePath);
  }
  removeFromLoadingArray(filePath) {
    if (arrayContains(this.assetsCurrentlyLoading, filePath)) {
      removeFromArray(this.assetsCurrentlyLoading, filePath);
      this.debugLogAssetLoaded(filePath);
    }

    this.checkIfLoadingFinished();
  }
  checkIfLoadingFinished() {
    if (!this.finishedLoadingAssets) {
      return;
    }

    Debug.log("finished loading assets");

    if (isFunction(this.onFinishedLoading)) {
      this.onFinishedLoading();
    }
  }
  debugLogLoadingStatus() {
    Debug.log(
      `assets currently loading:  ${this.assetsCurrentlyLoading.length}`
    );
    Debug.log(
      `loading all assets triggered: ${this.loadingAllAssetsWasTriggered}`
    );
  }
  getAsset(assetName) {
    if (!assetName) {
      throw new Error("property name was not defined");
    }
    if (typeof assetName !== "string") {
      throw new Error("property name must be a string");
    }
    if (!this[assetName]) {
      throw new Error(`property <<${assetName}>> not found`);
    }

    return this[assetName];
  }
}
