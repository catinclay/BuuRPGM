import * as PIXI from 'pixi.js';

export default class Monster {
  constructor(args) {
    this.sprite = new PIXI.Sprite();
    // Opt-in to interactivity
    this.sprite.interactive = true;

    this.sprite.interactiveChildren = true;
    // Shows hand cursor
    this.sprite.buttonMode = true;

    // Pointers normalize touch and mouse
    this.sprite.on('pointerdown', this.onMouseClick.bind(this));

    this.x = args.x;
    this.y = args.y;
    this.dir = args.dir;
    this.hero = args.hero;
  }

  onMouseClick(e) {
    e.stopPropagation();
    this.hero.targetMonster = this;
  }
}
