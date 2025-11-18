import NekotanScene from "./nekotan/nekotanScene.js";
import Game from "./game.js";

function init() {
  const game = new Game((game) => { return new NekotanScene(game)});
}

init();
