import Body from "../body.js";
import Sprite from "../sprite.js";

export default class Food {
  constructor(scene, positionX, positionY) {
    this.body = new Body();
    this.sprite = new Sprite(scene.fruitsSpritesheet, 12);
    this.positionX = positionX;
    this.positionY = positionY;
    const scale = 4;
    this.width = this.sprite.spriteSheet.tileSize * scale;
    this.height = this.sprite.spriteSheet.tileSize * scale;
    this.sprite.scaleX = scale;
    this.sprite.scaleY = scale;
  }
  get positionX() {
    return this.body.positionX;
  }
  set positionX(value) {
    this.body.positionX = value;
    this.sprite.positionX = value;
  }
  get positionY() {
    return this.body.positionY;
  }
  set positionY(value) {
    this.body.positionY = value;
    this.sprite.positionY = value;
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
    this.sprite.positionX = this.body.positionX;
    this.sprite.positionY = this.body.positionY;
  }
  draw(context) {
    this.sprite.draw(context);
  }
}
