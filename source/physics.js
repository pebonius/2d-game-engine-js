export default class Physics {
  #forceOfGravity = 1;

  constructor() {}
  applyGravity(body, canvas) {
    if (body.position.y + body.height > canvas.height) {
      return;
    }

    body.delta.y += this.#forceOfGravity;
  }
}
