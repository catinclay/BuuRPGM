import * as PIXI from 'pixi.js';

export default class Item {
  constructor(args) {
    this.textures = PIXI.loader.resources['assets/images/item_1.json'].textures;
    this.itemCountText = new PIXI.Text('1', {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0x101010,
      align: 'center',
    });
    this.itemIconContainer = new PIXI.Container();
    this.itemIconSprite = new PIXI.Sprite();
    this.itemIconSprite.interactive = true;
    this.itemIconContainer.addChild(this.itemIconSprite);
    this.itemIconContainer.addChild(this.itemCountText);
    this.effectFactory = args.effectFactory;
    this.capacity = 0;
  }

  isValid() {
    return this.capacity > 0;
  }

  charge(number) {
    this.capacity += number;
  }

  consume(number) {
    this.capacity -= number;
  }

  setXY(x, y) {
    this.itemIconSprite.x = x;
    this.itemIconSprite.y = y;
    this.itemCountText.x = x + 7;
    this.itemCountText.y = y + 3;
  }

  update() {
    this.itemCountText.text = this.capacity;
  }
}
