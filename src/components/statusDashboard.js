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
    this.margin = 20;


    // DEMO
    this.textures = PIXI.loader.resources['assets/images/skill_1.json'].textures;
    this.skillSprite = new PIXI.Sprite(this.textures[
          `bash_icon.png`
        ]);
    this.bashSkill = this.skillsSet['bash'];
    this.container.addChild(this.bashSkill.skillIconSprite);
    this.bashSkill.skillIconSprite.x = this.x + 200;
    this.bashSkill.skillIconSprite.y = this.y + 100;
    this.bashSkill.skillIconSprite.on('pointerdown', this.onBashSkillClick.bind(this));
  }

  onBashSkillClick(e) {
    this.hero.usingSkill = this.bashSkill;
  }

  update() {
    this.graphics.clear();

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
    //DEMO
    this.bashSkill.updateIcon();
  }
}
