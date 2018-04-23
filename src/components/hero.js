// import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';
// import Effect from './effect';
// import SkillBash from './Skills/skill-bash';
import {
  getDistUtil,
  // goToTargetUtil,
  // faceToTargetUtil,
  // getRandomIntUtil,
} from '../utils';
import HeroStatus from './Status/hero-status';
import HeroAction from './Actions/hero-action';

export default class Hero {
  constructor(args) {
    this.consoleLog = args.consoleLog;
    this.status = new HeroStatus(args);
    this.action = CONSTANTS.HERO_STATUS.WALKING;

  }

  addToContainer(container) {
    this.status.container.addChild(this.goToTargetMarkSprite);
    this.status.container.addChild(this.status.clickTargetMarkSprite);
    this.status.container.addChild(this.status.sprite);
    container.addChild(this.container);
  }

  onClickGround(args) {
    if (this.action !== CONSTANTS.HERO_STATUS.SKILLING) {
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
        this.status.targetMonster.sprite.width /
        CONSTANTS.TARGET_MARK_PROP.WIDTH;
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

  getPreUseSkillResult() {
    if (this.status.usingSkill !== undefined) {
      switch (this.status.usingSkill.targetType) {
        case CONSTANTS.SKILL_TARGET_TYPE.SINGLE:
        default:
          return this.status.usingSkill.beforeUse(
            this,
            this.status.targetMonster
          );
      }
    }
    return null;
  }

  setUsingSkill(preUseSkillResult) {
    if (this.action !== CONSTANTS.HERO_STATUS.SKILLING) {
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

  getNextAction(preUseSkillResult) {
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
    }
    return CONSTANTS.HERO_STATUS.ATTACKING;
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

    const preUseSkillResult = this.getPreUseSkillResult();
    this.setUsingSkill();

    const action = this.getNextAction(preUseSkillResult);
    this.status = new HeroAction().filter(action, this.status, delta);

    this.updateImage();
  }

  updateImage() {
    switch (this.action) {
      case CONSTANTS.HERO_STATUS.SKILLING:
        break;
      case CONSTANTS.HERO_STATUS.ATTACKING: {
        this.status.sprite.texture = this.textures[
          `link_attack_${this.dir}_${this.nowAttackFrame}.png`
        ];

        // TODO: make this cleaner
        if (this.nowAttackFrame === 0) {
          this.status.sprite.anchor.set(0.5, 0.8);
          // this.status.sprite.x = this.x;
          // this.status.sprite.y = this.y;
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          this.status.sprite.anchor.set(0.5, 0.4);
          // this.status.sprite.x = this.x;
          // this.status.sprite.y = this.y + this.status.sprite.height / 4;
        } else if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          this.status.sprite.anchor.set(0.75, 0.8);
          // this.status.sprite.x = this.x - this.status.sprite.width / 4;
          // this.status.sprite.y = this.y;
        } else if (this.dir === CONSTANTS.DIRECTION.UP) {
          this.status.sprite.anchor.set(0.5, 0.9);
          // this.status.sprite.x = this.x;
          // this.status.sprite.y = this.y - this.status.sprite.height / 4 ;
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          this.status.sprite.anchor.set(0.25, 0.8);
          // this.status.sprite.x = this.x + this.status.sprite.width / 4;
          // this.status.sprite.y = this.y;
        }
        break;
      }
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.status.sprite.texture = this.textures[
          `link_face_${this.dir}_${this.nowStepFrame}.png`
        ];
        this.status.sprite.anchor.set(0.5, 0.8);
        this.status.sprite.x = this.x;
        this.status.sprite.y = this.y;
        this.goToTargetMarkSprite.x = this.target.x;
        this.goToTargetMarkSprite.y = this.target.y;
        break;
    }
    this.updateTargetMark();

    this.status.sprite.zOrder =
      -this.status.sprite.y - this.status.sprite.height / 2;
  }

  getAttackDuration() {
    return this.attackDuration;
  }
  getAttackTimingDelta(delta) {
    return this.atkSpeedAmp * delta;
  }

  getItem(item) {
    if (!(item.NAME in this.itemsList)) {
      this.itemsList[item.NAME] = item.GET_OBJ();
      this.itemsList[item.NAME].setOwner(this);
    }
    this.itemsList[item.NAME].charge(1);
    this.statusDashboard.updateItemsCallBack();
  }

  consumeItem(itemName) {
    if (itemName in this.itemsList) {
      this.itemsList[itemName].consume(1);
      if (this.itemsList[itemName].capacity <= 0) {
        delete this.itemsList[itemName];
      }
    }
    this.statusDashboard.updateItemsCallBack();
  }
}
