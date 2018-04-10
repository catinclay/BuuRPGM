import * as PIXI from 'pixi.js';
import Hero from './components/hero';
import Slime from './components/slime';
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
const monsters = [];
document.body.appendChild(app.view);

function setupHero() {
  hero = new Hero({
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    dir: CONSTANTS.DIRECTION.DOWN, // down
  });
}

function setupMonster() {
  monsters.push(
    new Slime({
      x: 200,
      y: 200,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );
  monsters.push(
    new Slime({
      x: 600,
      y: 200,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );
  monsters.push(
    new Slime({
      x: 200,
      y: 400,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );
  monsters.push(
    new Slime({
      x: 600,
      y: 400,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );

  for (let i = monsters.length - 1; i >= 0; i -= 1) {
    app.stage.addChild(monsters[i].sprite);
  }
}

function mousedown(e) {
  hero.onClickGround({
    x: parseInt(e.data.global.x, 10),
    y: parseInt(e.data.global.y, 10),
  });
}

function setupStage() {
  const background = new PIXI.Graphics();
  background.beginFill(0x1099bb);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  app.stage.addChild(background);
  app.stage.interactive = true;
  app.stage.on('pointerdown', mousedown);
}

function gameLoop(delta) {
  hero.update(delta);
  for (let i = monsters.length - 1; i >= 0; i -= 1) {
    monsters[i].update(delta);
  }
}

function setup() {
  setupStage();
  setupHero();
  setupMonster();
  app.stage.addChild(hero.sprite);
  app.ticker.add(delta => {
    gameLoop(delta);
  });
}

loader.add(['assets/images/slime.json', 'assets/images/link.json']).load(setup);
