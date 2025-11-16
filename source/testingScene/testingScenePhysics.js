export default class TestingScenePhysics {
  #forceOfGravity = 1;
  #damping = 0.95;

  constructor() {}
  applyGravity(physicalObject, canvas) {
    if (physicalObject.positionY + physicalObject.height >= canvas.height) {
      physicalObject.deltaY = 0;
      return;
    }

    physicalObject.deltaY += this.#forceOfGravity;
  }
  applyDamping(physicalObject) {
    physicalObject.deltaX *= this.#damping;
    physicalObject.deltaY *= this.#damping;
  }
}
