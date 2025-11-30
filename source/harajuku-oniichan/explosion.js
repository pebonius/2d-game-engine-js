import { drawSpriteFromSheet } from "../graphics.js";

export default class Explosion {
  #createdTime = Date.now();
  #lifeSpan = 300;
  #positionX;
  #positionY;
  #frames = 6;
  #currentSprite = 0;

  constructor(positionX, positionY, spriteSheet) {
    this.spriteSheet = spriteSheet;
    this.isDead = false;
    this.#positionX = positionX;
    this.#positionY = positionY;
  }
  update(game) {
    if (Date.now() - this.#createdTime > this.#lifeSpan) {
      this.isDead = true;
    }

    const frameInterval = this.#lifeSpan / this.#frames;

    this.#currentSprite = Math.floor(
      (Date.now() - this.#createdTime) / frameInterval
    );
  }
  draw(context) {
    drawSpriteFromSheet(
      context,
      this.spriteSheet,
      this.#currentSprite,
      this.#positionX,
      this.#positionY,
      false,
      false,
      2,
      2,
      0
    );
  }
}
