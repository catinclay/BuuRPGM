import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';
import Effect from './effect';
import SkillBash from './Skills/skill-bash';
import {
  getDistUtil,
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../utils';
import HeroStatus from './Status/hero-status';

export default class Hero {
  constructor(args) {
    this.consoleLog = args.consoleLog;
    this.status = Object.assing({}, args.status || initStatus);
    this.action = CONSTANTS.HERO_STATUS.WALKING;
    //temporary init status
    function initStatus(){
      var status = Oject.create(null);
      status.x = args.x;
      status.y = args.y;
      status.dir = args.dir;

      status.textures = PIXI.loader.resources['assets/images/link.json'].textures;
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
      //status.status = CONSTANTS.HERO_STATUS.WALKING;
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
      status.goToTargetMarkSprite.displayGroup = args.battleLayer;
      status.sprite.displayGroup = args.battleLayer;
      status.status.clickTargetMarkSprite.displayGroup = args.upperUiLayer;

      // Skills
      status.skillsSet = {};
      status.skillsSet.bash = new SkillBash({
        layer: args.upperUiLayer,
        hero: status,
      });

      // Items
      status.itemList = {};

      return status;
    }
  }

  addToContainer(container) {
    this.status.container.addChild(this.goToTargetMarkSprite);
    this.status.container.addChild(this.status.clickTargetMarkSprite);
    this.status.container.addChild(this.sprite);
    container.addChild(this.container);
  }

  onClickGround(args) {
    if (this.action!== CONSTANTS.HERO_STATUS.SKILLING) {
      this.status.usingSkill = undefined;
      this.status.target.x = args.x;
      this.status.target.y = args.y;
      this.status.targetMonster = undefined;
      this.status.action = CONSTANTS.HERO_STATUS.WALKING;
    }
  }

  taretMarkOnMouseClick(e) {
    this.status.targetMonster.onMouseClick(e);
  }

  calculateEffects() {
    for (let i = 0; i < this.effects.length; i += 1) {
      this.status.effects[i].onEffect(this);
    }
    this.status.effects = [];
  }

  checkAlive() {
    if (this.hp <= 0) {
      this.status.alive = false;
      this.status.sprite.texture = this.textures[`link_dead.png`];
      this.status.sprite.x = this.x;
      this.status.sprite.y = this.y;
      this.status.sprite.anchor.set(0.5, 0.8);
    }
  }

  updateTargetMark() {
    if (this.status.targetMonster !== undefined) {
      this.status.clickTargetMarkSprite.x = this.status.targetMonster.sprite.x;
      this.status.clickTargetMarkSprite.y = this.status.targetMonster.sprite.y;
      this.status.clickTargetMarkSprite.scale.x =
        this.status.targetMonster.sprite.width / CONSTANTS.TARGET_MARK_PROP.WIDTH;
      this.status.clickTargetMarkSprite.scale.y =
        this.status.targetMonster.sprite.height /
        CONSTANTS.TARGET_MARK_PROP.HEIGHT *
        0.8;
      this.status.clickTargetMarkSprite.on(
        'pointerdown',
        this.taretMarkOnMouseClick.bind(this)
      );
      this.status.clickTargetMarkSprite.visible = true;
    } else {
      this.status.clickTargetMarkSprite.visible = false;
    }
  }

  getPreUseSkillResult(){
    if (this.status.usingSkill !== undefined) {
      switch (this.status.usingSkill.targetType) {
        case CONSTANTS.SKILL_TARGET_TYPE.SINGLE:
        default:
          return this.status.usingSkill.beforeUse(
            this,
            this.status.targetMonster
          );
          break;
      }
    }
    return null;
  }

  setUsingSkill(preUseSkillResult){
    if (this.action!== CONSTANTS.HERO_STATUS.SKILLING) {
      switch (preUseSkillResult) {
        case CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOM:
          this.consoleLog.text = 'Out of mana.';
          this.status.usingSkill = undefined;
          break;
        case CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOR:
          this.consoleLog.text = 'Out of range.';
          break;
        case CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOT:
          this.consoleLog.text = 'Out of target.';
          this.status.usingSkill = undefined;
          break;
        case CONSTANTS.SKILL_CHECK_RESULT_TYPE.IN_COOL:
          this.consoleLog.text = 'Skill in cooldown.';
          this.status.usingSkill = undefined;
          break;
        case CONSTANTS.SKILL_CHECK_RESULT_TYPE.SUCCESS:
          this.consoleLog.text = '';
          break;
        default:
          break;
      }
    }
  }

  getNextAction(preUseSkillResult){
    if (
      this.status.usingSkill &&
      (this.action === CONSTANTS.HERO_STATUS.SKILLING ||
        preUseSkillResult === CONSTANTS.SKILL_CHECK_RESULT_TYPE.SUCCESS)
    ) {
      return CONSTANTS.HERO_STATUS.SKILLING;
    } else if (!this.status.targetMonster) {
      // Check should attack or walk.
      return CONSTANTS.HERO_STATUS.WALKING;
    } else if (
      this.status.targetMonster &&
      getDistUtil(this, this.status.targetMonster) > this.attackRange
    ) {
      
      this.target.x = this.status.targetMonster.x;
      this.target.y = this.status.targetMonster.y;
      return CONSTANTS.HERO_STATUS.WALKING;   
    } else {
      return CONSTANTS.HERO_STATUS.ATTACKING;
    }
    return null;
  }

  update(delta) {
    this.mp += this.mpgen * delta;
    if (this.mp > this.maxMp) {
      this.mp = this.maxMp;
    }
    this.calculateEffects();
    this.checkAlive();
    if (!this.alive) {
      this.updateTargetMark();
      return;
    }

    const skillsArray = Object.values(this.skillsSet);
    skillsArray.forEach(sk => sk.update(delta));

    let preUseSkillResult = this.getPreUseSkillResult();
    this.setUsingSkill();
    let action = this.getNextAction(preUseSkillResult);
    this.status= new HeroAction().filter(action, status, delta);
    this.updateImage();
  }

  updateImage() {
    switch (this.action {
      case CONSTANTS.HERO_STATUS.SKILLING:
        break;
      case CONSTANTS.HERO_STATUS.ATTACKING: {
        this.sprite.texture = this.textures[
          `link_attack_${this.dir}_${this.nowAttackFrame}.png`
        ];

        // TODO: make this cleaner
        if (this.nowAttackFrame === 0) {
          this.sprite.anchor.set(0.5, 0.8);
          // this.sprite.x = this.x;
          // this.sprite.y = this.y;
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          this.sprite.anchor.set(0.5, 0.4);
          // this.sprite.x = this.x;
          // this.sprite.y = this.y + this.sprite.height / 4;
        } else if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          this.sprite.anchor.set(0.75, 0.8);
          // this.sprite.x = this.x - this.sprite.width / 4;
          // this.sprite.y = this.y;
        } else if (this.dir === CONSTANTS.DIRECTION.UP) {
          this.sprite.anchor.set(0.5, 0.9);
          // this.sprite.x = this.x;
          // this.sprite.y = this.y - this.sprite.height / 4 ;
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          this.sprite.anchor.set(0.25, 0.8);
          // this.sprite.x = this.x + this.sprite.width / 4;
          // this.sprite.y = this.y;
        }
        break;
      }
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.sprite.texture = this.textures[
          `link_face_${this.dir}_${this.nowStepFrame}.png`
        ];
        this.sprite.anchor.set(0.5, 0.8);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.goToTargetMarkSprite.x = this.target.x;
        this.goToTargetMarkSprite.y = this.target.y;
        break;
    }
    this.updateTargetMark();

    this.sprite.zOrder = -this.sprite.y - this.sprite.height / 2;
  }

  getAttackDuration() {
    return this.attackDuration / this.atkSpeedAmp;
  }
}
