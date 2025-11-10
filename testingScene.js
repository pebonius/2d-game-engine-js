import { getCanvasCenter, drawRectangle } from "./graphics.js";

export default class TestingScene {
  constructor() {
    this.rotation = 0;
    this.rotationSpeed = 10;
    this.animationSize = { x: 50, y: 50 };
    this.animationColor = "green";
    this.animations = [
      { x: -100, y: 0 },
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ];
  }
  update() {
    this.rotation += this.rotationSpeed;
  }
  draw(context) {
    for (let index = 0; index < this.animations.length; index++) {
      const element = this.animations[index];

      drawRectangle(
        context,
        getCanvasCenter(context.canvas).x -
          this.animationSize.x * 0.5 +
          element.x,
        getCanvasCenter(context.canvas).y -
          this.animationSize.y * 0.5 +
          element.y,
        this.animationSize.x,
        this.animationSize.y,
        this.rotation,
        this.animationColor
      );
    }
  }
}
