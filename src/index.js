import * as PIXI from 'pixi.js';
import 'pixi-display';
import Hero from './components/hero';
import StatusDashboard from './components/statusDashboard';
import Slime from './components/Monsters/monster-slime';
import EffectFactory from './components/effectFactory';
import CONSTANTS from './constants';
import ProgressBar from './progressBar';
import { getRandomIntUtil } from './utils';

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
battleScene.displayList = new PIXI.DisplayList();
let statusDashboard;
let hero;
const monsters = [];
const drops = [];
document.body.appendChild(app.view);
const battleGround = new Container();
battleGround.displayList = new PIXI.DisplayList();
const bottomUiLayer = new PIXI.DisplayGroup(0, true);
const battleLayer = new PIXI.DisplayGroup(1, true);
const upperUiLayer = new PIXI.DisplayGroup(2, true);
const consoleLog = new PIXI.Text('', {
  fontFamily: 'Press Start 2P',
  fontSize: 12,
  fill: 0xff1010,
  align: 'center',
  resolution: 2,
});
const effectFactory = new EffectFactory({
  container: battleGround,
  upperUiLayer,
});

function setupHero() {
  hero = new Hero({
    x: 400,
    y: battleGroundHeight / 2,
    dir: CONSTANTS.DIRECTION.DOWN, // down
    bottomUiLayer,
    battleLayer,
    upperUiLayer,
    consoleLog,
    effectFactory,
  });
  hero.addToContainer(battleGround);
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
    consoleLog,
    upperUiLayer,
  });
  battleScene.addChild(statusDashboard.container);
}

function dropToBattleGroudCallBack(drop) {
  drop.addToBattleGround(battleGround, battleLayer);
  drops.push(drop);
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

  for (let i = drops.length - 1; i >= 0; i -= 1) {
    drops[i].update(delta);
    if (drops[i].shouldDelete) {
      battleGround.removeChild(drops[i].sprite);
      drops.splice(i, 1);
    }
  }

  if (monsters.length < 5) {
    monsters.push(
      new Slime({
        x: 50 + getRandomIntUtil(700),
        y: 50 + getRandomIntUtil(400),
        dir: CONSTANTS.DIRECTION.DOWN,
        hero,
        dropToBattleGroudCallBack,
        effectFactory,
      })
    );
    monsters[monsters.length - 1].setLayer(battleLayer);
    battleGround.addChild(monsters[monsters.length - 1].container);
  }
  statusDashboard.update();
  effectFactory.update(delta);
}

function setupGame() {
  setupBattleGround();
  setupHero();
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
    'assets/images/skill_1.json',
    'assets/images/item_1.json',
  ])
  .load(setupGame);
