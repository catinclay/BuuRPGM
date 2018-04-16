import * as PIXI from 'pixi.js';

export default class StatusDashboard {
  constructor(args) {
    Object.assign(this, args);
    this.container = new PIXI.Container();
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

    // DEMO
    this.bashSkill = this.hero.skillsSet.bash;
    this.container.addChild(this.bashSkill.skillIconSprite);
    this.bashSkill.skillIconSprite.x = this.x + 220;
    this.bashSkill.skillIconSprite.y = this.y + 40;

    // Move to skill-bash.js?
    this.bashSkill.skillIconSprite.on(
      'pointerdown',
      this.onBashSkillClick.bind(this)
    );

    this.container.addChild(this.consoleLog);
    this.consoleLog.x = this.x + 300;
    this.consoleLog.y = this.y + 20;
  }

  // Move to skill-bash.js
  onBashSkillClick(e) {
    this.hero.usingSkill = this.bashSkill;
    e.stopPropagation();
  }

  update() {
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

    // DEMO
    this.bashSkill.updateIcon();
  }
}
