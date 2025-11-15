import { drawSpriteFromSheet } from "./graphics.js";

export default class Sprite {
  #spriteSheet;
  #spriteIndex = 0;
  #positionX;
  #positionY;
  #flipX;
  #flipY;
  #scaleX;
  #scaleY;
  #rotateDeg;

  constructor(
    spriteSheet,
    spriteIndex,
    positionX,
    positionY,
    flipX,
    flipY,
    scaleX,
    scaleY,
    rotateDeg
  ) {
    this.#spriteSheet = spriteSheet;
    this.#spriteIndex = spriteIndex;
    this.#positionX = positionX;
    this.#positionY = positionY;
    this.#flipX = flipX;
    this.#flipY = flipY;
    this.#scaleX = scaleX;
    this.#scaleY = scaleY;
    this.#rotateDeg = rotateDeg;
  }
  draw(context) {
    drawSpriteFromSheet(
      context,
      this.#spriteSheet,
      this.#spriteIndex,
      { x: this.#positionX, y: this.#positionY },
      this.#flipX,
      this.#flipY,
      this.#scaleX,
      this.#scaleY,
      this.#rotateDeg
    );
  }
}
