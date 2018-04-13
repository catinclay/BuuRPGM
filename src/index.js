import * as PIXI from 'pixi.js';
import 'pixi-display';
import Hero from './components/hero';
import StatusDashboard from './components/statusDashboard';
import Slime from './components/slime';
import CONSTANTS from './constants';
import ProgressBar from './progressBar';

const { Application } = PIXI;
const { loader } = PIXI;
const { Container } = PIXI;

const app = new Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: 1,
});

const battleGroundHeight = 500;
const battleScene = new Container();
let statusDashboard;
let hero;
const monsters = [];
document.body.appendChild(app.view);
const battleGround = new Container();
battleGround.displayList = new PIXI.DisplayList();
const bottomUiLayer = new PIXI.DisplayGroup(-1, true);
const battleLayer = new PIXI.DisplayGroup(0, true);
const upperUiLayer = new PIXI.DisplayGroup(1, true);

function setupHero() {
  hero = new Hero({
    x: 400,
    y: battleGroundHeight / 2,
    dir: CONSTANTS.DIRECTION.DOWN, // down
  });
  hero.addToContainer(battleGround);
  hero.setLayer(bottomUiLayer, battleLayer, upperUiLayer);
}

function setupMonster() {
  monsters.push(
    new Slime({
      x: 200,
      y: 175,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );
  monsters.push(
    new Slime({
      x: 600,
      y: 175,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );
  monsters.push(
    new Slime({
      x: 200,
      y: 350,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );
  monsters.push(
    new Slime({
      x: 600,
      y: 350,
      dir: CONSTANTS.DIRECTION.DOWN,
      hero,
    })
  );

  for (let i = monsters.length - 1; i >= 0; i -= 1) {
    monsters[i].setLayer(battleLayer);
    battleGround.addChild(monsters[i].container);
  }
}

function mousedown(e) {
  hero.onClickGround({
    x: parseInt(e.data.global.x, 10),
    y: parseInt(e.data.global.y, 10),
  });
}

function setupBattleGround() {
  const background = new PIXI.Graphics();
  background.beginFill(0x1099bb);
  background.drawRect(0, 0, app.screen.width, battleGroundHeight);
  background.endFill();
  battleGround.addChild(background);
  battleGround.interactive = true;
  battleGround.on('pointerdown', mousedown);
  battleScene.addChild(battleGround);
}

function setupStatusDashboard() {
  statusDashboard = new StatusDashboard({
    x: 0,
    y: battleGroundHeight,
    width: app.screen.width,
    height: app.screen.height - battleGroundHeight,
    hero,
  });
  battleScene.addChild(statusDashboard.container);
}

function gameLoop(delta) {
  hero.update(delta);
  for (let i = monsters.length - 1; i >= 0; i -= 1) {
    monsters[i].update(delta);
    if (!monsters[i].alive) {
      battleGround.removeChild(monsters[i].container);
      monsters.splice(i, 1);
    }
  }
  statusDashboard.update();
}

function setupGame() {
  setupBattleGround();
  setupHero();
  setupMonster();
  setupStatusDashboard();

  app.stage.addChild(battleScene);
  app.ticker.add(delta => {
    gameLoop(delta);
  });
}

ProgressBar.barAsync(loader, app.stage);

loader
  .add([
    'assets/images/slime.json',
    'assets/images/link.json',
    'assets/images/control_unit.json',
  ])
  .load(setupGame);
