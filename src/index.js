import * as PIXI from 'pixi.js';
import Hero from './components/hero';
import CONSTANTS from './constants';

const { Application } = PIXI;
const { loader } = PIXI;

const app = new Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: 1,
});

let hero;
document.body.appendChild(app.view);

function setupHero() {
  hero = new Hero({
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    dir: CONSTANTS.DIRECTION.DOWN, // down
    textures: PIXI.loader.resources['assets/images/link.json'].textures,
  });
  app.stage.addChild(hero.sprite);
}

function mousedown(e) {
  hero.setTarget({
    x: e.data.global.x,
    y: e.data.global.y,
  });
}

function setupStage() {
  const background = new PIXI.Graphics();
  background.beginFill(0x1099bb);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  app.stage.addChild(background);
  app.stage.interactive = true;
  app.stage.on('mousedown', mousedown);
}

function gameLoop(delta) {
  hero.update(delta);
}

function setup() {
  setupStage();
  setupHero();
  app.ticker.add(delta => {
    gameLoop(delta);
  });
}

loader.add(['assets/images/link.json', 'assets/images/slime.json']).load(setup);
