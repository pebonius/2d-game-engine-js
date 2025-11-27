import Game from "./game.js";
import HarajukuOniisanScene from "./harajuku-oniisan/harajukuOniisanScene.js";

function init() {
  const game = new Game((game) => {
    return new HarajukuOniisanScene(game);
  });
}

init();
