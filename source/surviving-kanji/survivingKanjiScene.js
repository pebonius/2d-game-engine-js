import { drawText } from "../graphics.js";

export default class SurvivingKanjiScene {
  constructor(game) {
    this.game = game;
  }
  update(game) {}
  draw(context) {
    drawText(context, "surviving kanji", 20, "white", 30, 30);
  }
}
