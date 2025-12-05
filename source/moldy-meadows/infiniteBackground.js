import { drawSprite } from "../graphics.js";
import { removeFromArray } from "../utilities.js";

export default class InfiniteBackground {
  #moldBackground;

  constructor(scene) {
    this.#moldBackground = scene.game.content.mold;
    this.backgroundStartPosY = -this.#moldBackground.height * 2;
    this.backgroundPositionsY = [
      this.backgroundStartPosY,
      this.backgroundStartPosY + this.#moldBackground.height * 2,
      this.backgroundStartPosY + this.#moldBackground.height * 4,
    ];
  }
  update(scene) {
    this.backgroundPositionsY.forEach((posY, index) => {
      this.backgroundPositionsY[index] = posY + scene.speed * 0.1;
    });

    const topBackgroundPos = Math.min(...this.backgroundPositionsY);
    if (topBackgroundPos > -10) {
      this.backgroundPositionsY.unshift(this.backgroundStartPosY);
    }
    const bottomBackgroundPos = Math.max(...this.backgroundPositionsY);
    if (bottomBackgroundPos > scene.game.canvas.height) {
      removeFromArray(this.backgroundPositionsY, bottomBackgroundPos);
    }
  }
  draw(context) {
    this.backgroundPositionsY.forEach((positionY) => {
      drawSprite(
        context,
        this.#moldBackground,
        0,
        positionY,
        context.canvas.width,
        this.#moldBackground.height * 2
      );
    });
  }
}
