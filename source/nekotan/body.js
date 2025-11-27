export default class Body {
  #positionX = 0;
  #positionY = 0;
  #deltaX = 0;
  #deltaY = 0;
  #width = 0;
  #height = 0;

  constructor() {}
  get positionX() {
    return this.#positionX;
  }
  set positionX(value) {
    this.#positionX = Math.round(value);
  }
  get positionY() {
    return this.#positionY;
  }
  set positionY(value) {
    this.#positionY = Math.round(value);
  }
  get deltaX() {
    return this.#deltaX;
  }
  set deltaX(value) {
    this.#deltaX = value;
  }
  get deltaY() {
    return this.#deltaY;
  }
  set deltaY(value) {
    this.#deltaY = value;
  }
  get width() {
    return this.#width;
  }
  set width(value) {
    if (!Number.isSafeInteger(value)) {
      throw new Error("value must be a safe integer");
    }

    this.#width = value;
  }
  get height() {
    return this.#height;
  }
  set height(value) {
    if (!Number.isSafeInteger(value)) {
      throw new Error("value must be a safe integer");
    }

    this.#height = value;
  }
  update(scene) {
    this.applyDelta();
  }
  applyDelta() {
    this.positionX += this.deltaX;
    this.positionY += this.deltaY;
  }
}
