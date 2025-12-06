import { distance, drawRectangle, drawText } from "../graphics.js";
import { randomNumber, removeDead } from "../utilities.js";

export default class Spores {
  #spores = [];
  #maxSpores = 100;
  #sporeLifespan = 500;
  #sporeColor = "rgba(100, 225, 255, 0.9)";
  #sporeMinSize = 4;
  #sporeMaxSize = 5;

  constructor(scene) {}
  get sporeDensity() {
    return Math.round((this.#spores.length / this.#maxSpores) * 100);
  }
  update(scene) {
    removeDead(this.#spores);
    this.spawnSpores(scene);

    this.#spores.forEach((spore) => {
      spore.life++;
      this.updateSporePosition(spore, scene);

      if (
        spore.life >= this.#sporeLifespan ||
        spore.posY > scene.game.canvas.height
      ) {
        spore.isDead = true;
      }
    });
  }
  spawnSpores(scene) {
    const spawnChancePercent = 10;
    if (randomNumber(1, 100) < spawnChancePercent * scene.speed * 0.05) {
      const toSpawn = randomNumber(1, 3);

      for (let index = 0; index < toSpawn; index++) {
        this.createSpore(scene);
      }
    }
  }
  createSpore(scene) {
    if (this.#spores.length >= this.#maxSpores) {
      return;
    }

    const posX = randomNumber(0, scene.game.canvas.width);
    const posY = 0;
    const size = randomNumber(this.#sporeMinSize, this.#sporeMaxSize);

    this.#spores.push({
      life: 0,
      posX: posX,
      posY: posY,
      deltaX: 0.1 * size,
      deltaY: 1 / size,
      size: size,
      isDead: false,
    });
  }
  updateSporePosition(spore, scene) {
    spore.posX += spore.deltaX;
    spore.posY += spore.deltaY;
    spore.posY += scene.speed * 0.1;
  }
  draw(context) {
    const randomColor = `rgba(${randomNumber(100, 255)}, ${randomNumber(
      100,
      255
    )}, ${randomNumber(100, 255)}, 0.9)`;

    this.#spores.forEach((spore) => {
      drawRectangle(
        context,
        spore.posX,
        spore.posY,
        spore.size,
        spore.size,
        0,
        randomColor
      );
    });
  }
}
