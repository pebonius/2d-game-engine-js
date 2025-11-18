import Game from "./game.js";
import SurvivingKanjiScene from "./surviving-kanji/survivingKanjiScene.js";

function init() {
  const game = new Game((game) => { return new SurvivingKanjiScene(game)});
}

init();
