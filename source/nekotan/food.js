import Body from "../body.js";
import Sprite from "../sprite.js";

export default class Food {
  constructor(scene, positionX, positionY) {
    this.body = new Body();
    this.positionX = positionX;
    this.positionY = positionY;
    this.height = 64;
    this.width = 64;
    this.sprite = new Sprite(scene.fruitsSpritesheet, 12);
    this.sprite.positionX = positionX;
    this.sprite.positionY = positionY;
    this.sprite.scaleX = 4;
    this.sprite.scaleY = 4;
  }
  get positionX() {
    return this.body.positionX;
  }
  set positionX(value) {
    this.body.positionX = value;
  }
  get positionY() {
    return this.body.positionY;
  }
  set positionY(value) {
    this.body.positionY = value;
  }
  get deltaX() {
    return this.body.deltaX;
  }
  set deltaX(value) {
    this.body.deltaX = value;
  }
  get deltaY() {
    return this.body.deltaY;
  }
  set deltaY(value) {
    this.body.deltaY = value;
  }
  get width() {
    return this.body.width;
  }
  set width(value) {
    this.body.width = value;
  }
  get height() {
    return this.body.height;
  }
  set height(value) {
    this.body.height = value;
  }
  update(scene) {
    scene.physics.applyGravity(this, scene.game.canvas);
    scene.physics.applyDamping(this);
    scene.physics.floorDelta(this);
    this.body.update(scene);
    this.sprite.positionX = this.positionX;
    this.sprite.positionY = this.positionY;
  }
  draw(context) {
    this.sprite.draw(context);
  }
}
