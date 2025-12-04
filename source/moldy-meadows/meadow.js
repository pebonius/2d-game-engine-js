import { drawSprite, drawText } from "../graphics.js";

export default class Meadow {
  #moldBackground;

  constructor(scene) {
    this.#moldBackground = scene.game.content.mold;
    this.backgroundStartPosY = -this.#moldBackground.height * 2;
    this.backgroundPositionsY = [
      this.backgroundStartPosY,
      -4,
      this.#moldBackground.height * 2 - 8,
      this.#moldBackground.height * 4 - 12,
    ];
  }
  update(scene) {
    const newPositions = [];
    this.backgroundPositionsY.forEach((positionY) => {
      if (positionY < scene.game.canvas.height) {
        newPositions.push(positionY + scene.speed * 0.1);
      } else {
        newPositions.push(this.backgroundStartPosY);
      }
    });
    this.backgroundPositionsY = newPositions;
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
