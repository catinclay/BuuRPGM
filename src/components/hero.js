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
    // args.hero = this;
    this.status = new HeroStatus(args);
    this.action = CONSTANTS.HERO_STATUS.WALKING;
  }

  addToContainer(container) {
    this.status.container.addChild(this.status.goToTargetMarkSprite);
    this.status.container.addChild(this.status.clickTargetMarkSprite);
    this.status.container.addChild(this.status.sprite);
    container.addChild(this.status.container);
  }

  onClickGround(args) {
    if (this.action !== CONSTANTS.HERO_STATUS.SKILLING) {
      this.status.usingSkill = undefined;
      this.status.target.x = args.x;
      this.status.target.y = args.y;
      this.status.targetMonster = undefined;
      this.action = CONSTANTS.HERO_STATUS.WALKING;
    }
  }

  taretMarkOnMouseClick(e) {
    this.status.targetMonster.onMouseClick(e);
  }

  calculateEffects() {
    for (let i = 0; i < this.status.effects.length; i += 1) {
      this.status.effects[i].onEffect(this.status);
    }
    this.status.effects = [];
  }

  checkAlive() {
    if (this.status.hp <= 0) {
      this.status.alive = false;
      this.status.sprite.texture = this.status.textures[`link_dead.png`];
      this.status.sprite.x = this.status.x;
      this.status.sprite.y = this.status.y;
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
            this.status,
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
      this.status.usingSkill !== undefined &&
      (this.action === CONSTANTS.HERO_STATUS.SKILLING ||
        preUseSkillResult === CONSTANTS.SKILL_CHECK_RESULT_TYPE.SUCCESS)
    ) {
      return CONSTANTS.HERO_STATUS.SKILLING;
    } else if (this.status.targetMonster === undefined) {
      // Check should attack or walk.
      return CONSTANTS.HERO_STATUS.WALKING;
    } else if (
      this.status.targetMonster !== undefined &&
      getDistUtil(this.status, this.status.targetMonster) >
        this.status.attackRange
    ) {
      this.status.target.x = this.status.targetMonster.x;
      this.status.target.y = this.status.targetMonster.y;
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
    if (!this.status.alive) {
      this.updateTargetMark();
      return;
    }

    const skillsArray = Object.values(this.status.skillsSet);
    skillsArray.forEach(sk => sk.update(delta));

    const preUseSkillResult = this.getPreUseSkillResult();
    this.setUsingSkill(preUseSkillResult);

    this.action = this.getNextAction(preUseSkillResult);
    this.status = HeroAction.filter(this.action, this.status, delta);
    this.updateImage();
  }

  updateImage() {
    switch (this.action) {
      case CONSTANTS.HERO_STATUS.SKILLING:
        break;
      case CONSTANTS.HERO_STATUS.ATTACKING: {
        this.status.sprite.texture = this.status.textures[
          `link_attack_${this.status.dir}_${this.status.nowAttackFrame}.png`
        ];

        // TODO: make this cleaner
        if (this.status.nowAttackFrame === 0) {
          this.status.sprite.anchor.set(0.5, 0.8);
          // this.status.sprite.x = this.x;
          // this.status.sprite.y = this.y;
        } else if (this.status.dir === CONSTANTS.DIRECTION.DOWN) {
          this.status.sprite.anchor.set(0.5, 0.4);
          // this.status.sprite.x = this.x;
          // this.status.sprite.y = this.y + this.status.sprite.height / 4;
        } else if (this.status.dir === CONSTANTS.DIRECTION.LEFT) {
          this.status.sprite.anchor.set(0.75, 0.8);
          // this.status.sprite.x = this.x - this.status.sprite.width / 4;
          // this.status.sprite.y = this.y;
        } else if (this.status.dir === CONSTANTS.DIRECTION.UP) {
          this.status.sprite.anchor.set(0.5, 0.9);
          // this.status.sprite.x = this.x;
          // this.status.sprite.y = this.y - this.status.sprite.height / 4 ;
        } else if (this.status.dir === CONSTANTS.DIRECTION.RIGHT) {
          this.status.sprite.anchor.set(0.25, 0.8);
          // this.status.sprite.x = this.x + this.status.sprite.width / 4;
          // this.status.sprite.y = this.y;
        }
        break;
      }
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.status.sprite.texture = this.status.textures[
          `link_face_${this.status.dir}_${this.status.nowStepFrame}.png`
        ];
        this.status.sprite.anchor.set(0.5, 0.8);
        this.status.sprite.x = this.status.x;
        this.status.sprite.y = this.status.y;
        this.status.goToTargetMarkSprite.x = this.status.target.x;
        this.status.goToTargetMarkSprite.y = this.status.target.y;
        break;
    }
    this.updateTargetMark();

    this.status.sprite.zOrder =
      -this.status.sprite.y - this.status.sprite.height / 2;
  }

  getAttackDuration() {
    return this.status.attackDuration;
  }
  getAttackTimingDelta(delta) {
    return this.status.atkSpeedAmp * delta;
  }

  getItem(item) {
    if (!(item.NAME in this.status.itemsList)) {
      this.status.itemsList[item.NAME] = item.GET_OBJ({
        effectFactory: this.effectFactory,
      });
      this.status.itemsList[item.NAME].setOwner(this);
    }
    this.status.itemsList[item.NAME].charge(1);
    this.statusDashboard.updateItemsCallBack();
  }

  consumeItem(itemName) {
    if (itemName in this.status.itemsList) {
      this.status.itemsList[itemName].consume(1);
      if (this.status.itemsList[itemName].capacity <= 0) {
        delete this.status.itemsList[itemName];
      }
    }
    this.statusDashboard.updateItemsCallBack();
  }
}
