import * as PIXI from 'pixi.js';
import Status from '../status';
import SkillBash from '../Skills/skill-bash';

export default class HeroStatus extends Status {
  constructor(args) {
    super(args);
    function initStatus(initArgs) {
      const status = Object.create(null);
      status.x = initArgs.x;
      status.y = initArgs.y;
      status.dir = initArgs.dir;

      status.textures =
        PIXI.loader.resources['assets/images/link.json'].textures;
      status.sprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/link.json'].textures[
          `link_face_${status.dir}_0.png`
        ]
      );
      status.sprite.anchor.set(0.5, 0.8);
      status.sprite.interactive = false;
      status.goToTargetMarkSprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/control_unit.json'].textures[
          `go_to_target_mark.png`
        ]
      );
      status.goToTargetMarkSprite.visible = false;
      status.goToTargetMarkSprite.anchor.set(0.5);
      status.status.clickTargetMarkSprite = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/control_unit.json'].textures[
          `click_target_mark.png`
        ]
      );
      status.status.clickTargetMarkSprite.visible = false;
      status.status.clickTargetMarkSprite.anchor.set(0.5);
      status.status.clickTargetMarkSprite.interactive = true;
      status.container = new PIXI.Container();
      status.container.interactive = false;

      status.stepCounter = 0;
      status.nowStepFrame = 0;
      status.target = { x: status.x, y: status.y };
      status.moveSpeed = 2;
      status.attackRange = 30;
      // status.status = CONSTANTS.HERO_STATUS.WALKING;
      status.nowAttackFrame = 0;
      status.nowAttackTiming = 0;

      // Battle variable
      status.attackDuration = 60; // 1 sec per attack
      status.atkSpeedAmp = 10;
      status.batk = 5;
      status.fatk = 8;
      status.alive = true;
      status.effects = [];
      status.maxHp = 150;
      status.maxMp = 50;
      status.hp = status.maxHp;
      status.mp = status.maxMp;
      status.armor = 0;
      status.mpgen = 1.5 / 60;

      // Layers
      status.goToTargetMarkSprite.displayGroup = initArgs.battleLayer;
      status.sprite.displayGroup = initArgs.battleLayer;
      status.status.clickTargetMarkSprite.displayGroup = initArgs.upperUiLayer;

      // Skills
      status.skillsSet = {};
      status.skillsSet.bash = new SkillBash({
        layer: initArgs.upperUiLayer,
        hero: status,
      });

      // Items
      status.itemList = {};

      return status;
    }
    Object.assign(this, initStatus(args));
  }
}
