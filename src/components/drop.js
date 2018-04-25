import * as PIXI from 'pixi.js';
import { getDistUtil } from '../utils';

export default class Drop {
  constructor(args) {
    this.item = args.item;
    this.x = args.x;
    this.y = args.y;
    this.textures = PIXI.loader.resources['assets/images/item_1.json'].textures;
    this.sprite = new PIXI.Sprite(this.textures[`item_${this.item.NAME}.png`]);
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.anchor.set(0.5);
    this.hero = args.hero;
    this.isPicked = false;
    this.shouldDelete = false;
    this.disappearTimer = 0;
  }

  addToBattleGround(container, layer) {
    this.sprite.displayGroup = layer;
    container.addChild(this.sprite);
  }

  update(delta) {
    if (!this.shouldDelete && !this.isPicked) {
      if (getDistUtil(this, this.hero.status) < 15) {
        this.isPicked = true;
        this.hero.getItem(this.item);
      }
    }
    if (!this.shouldDelete && this.isPicked) {
      this.disappearTimer += delta;
      if (this.y - this.sprite.y <= 45) {
        this.sprite.y -= 2;
      }
      if (this.disappearTimer >= 60) {
        this.shouldDelete = true;
      }
    }
  }
}
