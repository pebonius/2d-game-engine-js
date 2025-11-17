export default class nekotanPhysics {
  #forceOfGravity = 0.8;
  #damping = 0.95;
  #minDelta = 0.1;
  #groundHeight;

  constructor(scene) {
    this.canvas = scene.game.canvas;
    this.#groundHeight = this.canvas.height - 64;
  }
  objectiveVelocity(delta) {
    const pow = Math.pow(delta, 2);
    const sqrt = Math.sqrt(pow);
    return sqrt;
  }
  applyGravity(physicalObject, canvas) {
    if (physicalObject.positionY + physicalObject.height >= this.#groundHeight) {
      physicalObject.positionY = this.#groundHeight - physicalObject.height;
      physicalObject.deltaY = 0;
      return;
    }

    physicalObject.deltaY += this.#forceOfGravity;
  }
  applyDamping(physicalObject) {
    physicalObject.deltaX *= this.#damping;
    physicalObject.deltaY *= this.#damping;
  }
  floorDelta(physicalObject) {
    if (this.objectiveVelocity(physicalObject.deltaY) < this.#minDelta) {
      physicalObject.deltaY = 0;
    }
    if (this.objectiveVelocity(physicalObject.deltaX) < this.#minDelta) {
      physicalObject.deltaX = 0;
    }
  }
}
