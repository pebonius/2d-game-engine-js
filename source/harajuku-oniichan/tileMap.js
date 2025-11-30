import { drawSpriteFromSheet } from "../graphics.js";
import { randomNumber } from "../utilities.js";

export default class TileMap {
  #spriteSheet;
  #mapArray;
  #width = 20;
  #height = 15;
  #scale = 2;

  constructor(spriteSheet) {
    this.#spriteSheet = spriteSheet;
    this.randomTiles = [200, 240, 611];
    this.createMap();
  }
  createMap() {
    this.#mapArray = [];

    for (let y = 0; y < this.#height; y++) {
      const newRow = [];

      for (let x = 0; x < this.#width; x++) {
        newRow[x] =
          this.randomTiles[randomNumber(0, this.randomTiles.length - 1)];
      }

      this.#mapArray[y] = newRow;
    }
  }
  update(game) {}
  draw(context, shakeOffset) {
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        const tile = this.#mapArray[y][x];

        this.drawTile(context, tile, x, y, shakeOffset);
      }
    }
  }
  drawTile(context, tile, x, y, shakeOffset = 0) {
    const posX = x * this.#spriteSheet.tileSize * this.#scale + shakeOffset;
    const posY = y * this.#spriteSheet.tileSize * this.#scale;

    drawSpriteFromSheet(
      context,
      this.#spriteSheet,
      tile,
      posX,
      posY,
      false,
      false,
      this.#scale,
      this.#scale,
      0
    );
  }
}
