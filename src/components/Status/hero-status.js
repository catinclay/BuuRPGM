import * as PIXI from 'pixi.js';
import Status from '../status';

export default class HeroStatus extends Status {
  constructor(args) {
    super(args);
    if (!(args instanceof Status)) {
      this.x = args.x;
      this.y = args.y;
      this.dir = args.dir;
      //
      this.textures = PIXI.loader.resources['assets/images/link.json'].textures;
      this.sprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/link.json'].textures[
          `link_face_${this.dir}_0.png`
        ]
      );
      this.sprite.anchor.set(0.5, 0.8);
      this.sprite.interactive = false;
      this.goToTargetMarkSprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/control_unit.json'].textures[
          `go_to_target_mark.png`
        ]
      );
      this.goToTargetMarkSprite.visible = false;
      this.goToTargetMarkSprite.anchor.set(0.5);
      this.clickTargetMarkSprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/control_unit.json'].textures[
          `click_target_mark.png`
        ]
      );
      this.clickTargetMarkSprite.visible = false;
      this.clickTargetMarkSprite.anchor.set(0.5);
      this.clickTargetMarkSprite.interactive = true;
      this.container = new PIXI.Container();
      this.container.interactive = false;

      // Layers
      this.goToTargetMarkSprite.displayGroup = args.battleLayer;
      this.sprite.displayGroup = args.battleLayer;
      this.clickTargetMarkSprite.displayGroup = args.upperUiLayer;

      this.stepCounter = 0;
      this.nowStepFrame = 0;
      this.target = { x: this.x, y: this.y };
      this.moveSpeed = 2;
      this.attackRange = 30;
      // this.status = CONSTANTS.HERO_this.WALKING;
      this.nowAttackFrame = 0;
      this.nowAttackTiming = 0;

      // Battle variable
      this.attackDuration = 60; // 1 sec per attack
      this.atkSpeedAmp = 10;
      this.batk = 5;
      this.fatk = 8;
      this.alive = true;
      this.maxHp = 150;
      this.maxMp = 50;
      this.hp = this.maxHp;
      this.mp = this.maxMp;
      this.armor = 0;
      this.mpgen = 1.5 / 60;

      // Items
      this.itemsList = {};
      this.usingSkill = undefined;
      //
      // Skills
      // this.skillsSet = {};
      // this.skillsSet.bash = new SkillBash({
      //   layer: args.upperUiLayer,
      //   effectFactory: args.effectFactory,
      //   onClick(skill, e) {
      //     args.hero.status.usingSkill = skill;
      //     e.stopPropagation();
      //   },
      // });
    }
  }
}
