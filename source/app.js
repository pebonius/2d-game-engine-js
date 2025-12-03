import Game from "./game.js";
import MoldyMeadowsScene from "./moldy-meadows/moldyMeadows.js";

function init() {
  const game = new Game(new MoldyMeadowsScene());
}

init();
