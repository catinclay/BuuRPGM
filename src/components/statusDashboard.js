import * as PIXI from 'pixi.js';

export default class StatusDashboard {
  constructor(args) {
    Object.assign(this, args);
    this.container = new PIXI.Container();
    this.itemContainer = new PIXI.Container();
    const background = new PIXI.Graphics();
    background.lineStyle(2, 0x000000, 1);
    background.beginFill(0xffffff, 1);
    background.drawRect(
      this.x + 1,
      this.y + 1,
      this.width - 2,
      this.height - 2
    );
    this.container.addChild(background);
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.container.interactive = true;
    this.margin = 20;

    this.hero.statusDashboard = this;
    this.updateItemsCallBack();

    const skillsArray = Object.values(this.hero.skillsSet);
    this.skillIndex = 0;
    skillsArray.forEach(function(sk) {
      const indexX = this.skillIndex % 5;
      const indexY = Math.floor(this.skillIndex / 5);
      this.container.addChild(sk.skillIconSprite);
      sk.skillIconSprite.x = this.x + 220 + indexX * 35;
      sk.skillIconSprite.y = this.y + 30 + indexY * 35;
      this.skillIndex += 1;
    }, this);

    this.container.addChild(this.consoleLog);
    this.consoleLog.displayGroup = args.upperUILayer;
    this.consoleLog.x = this.x + 20;
    this.consoleLog.y = this.y + 70;

    this.itemContainer.interactive = true;
    this.container.addChild(this.itemContainer);
  }

  update() {
    this.updateHpMp();
  }

  updateHpMp() {
    this.graphics.clear();
    // HP
    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.beginFill(0xffffff, 1);
    this.graphics.drawRect(
      this.x + this.margin - 1,
      this.y + this.margin,
      this.hero.maxHp + 2,
      (this.height = 15)
    );
    this.graphics.lineStyle(0, 0x000000, 1);
    this.graphics.beginFill(0xff3300, 1);
    this.graphics.drawRect(
      this.x + this.margin,
      this.y + 1 + this.margin,
      Math.max(0, this.hero.hp),
      (this.height = 13)
    );

    // MP
    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.beginFill(0xffffff, 1);
    this.graphics.drawRect(
      this.x + this.margin - 1,
      this.y + this.margin * 2,
      this.hero.maxMp * 2 + 2,
      (this.height = 15)
    );
    this.graphics.lineStyle(0, 0x000000, 1);
    this.graphics.beginFill(0x0033ff, 1);
    this.graphics.drawRect(
      this.x + this.margin,
      this.y + 1 + this.margin * 2,
      Math.max(0, this.hero.mp * 2),
      (this.height = 13)
    );
  }

  updateItemsCallBack() {
    this.itemContainer.removeChildren();
    const itemsArray = Object.values(this.hero.itemsList);
    let itemIndex = 0;
    itemsArray.forEach(function(item) {
      const indexX = itemIndex % 5;
      const indexY = Math.floor(itemIndex / 5);
      this.itemContainer.addChild(item.itemIconContainer);
      item.setXY(this.x + 420 + indexX * 35, this.y + 30 + indexY * 35);
      item.update();
      itemIndex += 1;
    }, this);
  }
}
