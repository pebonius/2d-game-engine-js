import Game from "./game.js";
import HarajukuOniichanScene from "./harajuku-oniichan/harajukuOniichanScene.js";

function init() {
  const game = new Game((game) => {
    return new HarajukuOniichanScene(game);
  });
}

init();
