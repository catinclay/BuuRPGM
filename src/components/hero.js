import CONSTANTS from '../constants';
import { getDistUtil } from '../utils';
import HeroStatus from './Status/hero-status';
import HeroSkillStatus from './Status/hero-skill-status';
import HeroAnimationStatus from './Status/hero-animation-status';
import HeroEffectStatus from './Status/hero-effect-status';
import HeroItemStatus from './Status/hero-item-status';
import HeroAction from './Actions/hero-action';
import SkillBash from './Skills/skill-bash';

export default class Hero {
  constructor(args) {
    const thisHero = this;
    this.consoleLog = args.consoleLog;
    //
    this.status = new HeroStatus(args);
    this.skillStatus = new HeroSkillStatus({
      defaultSkills: [
        {
          id: 'bash',
          skill: new SkillBash({
            layer: args.upperUiLayer,
            effectFactory: args.effectFactory,
            onClick(skill, e) {
              thisHero.status.usingSkill = skill;
              e.stopPropagation();
            },
          }),
        },
      ],
    });
    this.effectStatus = new HeroEffectStatus();
    this.animationStatus = new HeroAnimationStatus({
      battleLayer: args.battleLayer,
      upperUiLayer: args.upperUiLayer,
      x: this.status.x,
      y: this.status.y,
    });
    //
    this.action = CONSTANTS.HERO_STATUS.WALKING;
    this.effectFactory = args.effectFactory;
    //
    this.itemStatus = new HeroItemStatus();
  }
  /* GETTER */
  getAttackDuration() {
    return this.status.attackDuration;
  }
  getAttackTimingDelta(delta) {
    return this.status.atkSpeedAmp * delta;
  }
  getStatus(type) {
    switch (type) {
      case CONSTANTS.STATUS_TYPE.SKILL:
        return this.skillStatus;
      case CONSTANTS.STATUS_TYPE.EFFECT:
        return this.effectStatus;
      case CONSTANTS.STATUS_TYPE.ITEM:
        return this.itemStatus;
      case CONSTANTS.STATUS_TYPE.PROP:
      default:
        return this.status;
    }
  }
  /* ANIMATION */

  addToContainer(container) {
    this.animationStatus.appendToContainer(container);
  }

  updateTargetMark(propStatus) {
    if (propStatus.targetMonster !== undefined) {
      this.animationStatus.setTargetMark(this.status.targetMonster.sprite, {
        name: 'pointerdown',
        listener: this.taretMarkOnMouseClick.bind(this),
      });
    } else {
      this.animationStatus.hideTargetMark();
    }
  }

  updateSprite() {
    switch (this.action) {
      case CONSTANTS.HERO_STATUS.SKILLING:
        break;
      case CONSTANTS.HERO_STATUS.ATTACKING:
        this.animationStatus.updateAttackingSprite(this.status.dir);
        break;
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.animationStatus.updateWalkingSprite(
          this.status.x,
          this.status.y,
          this.status.dir
        );
        break;
    }
  }

  updateImage() {
    this.updateSprite();
    this.updateTargetMark(this.status);
    this.animationStatus.updateSpriteZOrder();
  }
  /* EVENT */
  onClickGround(args) {
    if (this.action !== CONSTANTS.HERO_STATUS.SKILLING) {
      this.status.usingSkill = undefined;
      this.animationStatus.setMoveAnchorCoord(args.x, args.y);
      this.status.targetMonster = undefined;
      this.action = CONSTANTS.HERO_STATUS.WALKING;
    }
  }

  taretMarkOnMouseClick(e) {
    this.status.targetMonster.onMouseClick(e);
  }
  /* EFFECT */
  /* TODO: move to private */
  calculateEffects() {
    this.effectStatus.forEach(effect => effect.onEffect(this.status));
  }

  /* TODO: move to private */
  resetEffects() {
    this.effectStatus = new HeroEffectStatus([
      this.effectFactory.createEffect({
        sender: this.status,
        target: this.status,
        mpRestore: this.status.mpgen,
        popString: false,
      }),
    ]);
  }

  /* SKILL */
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

  /* ACTION */
  /* TODO: move to private */
  isAlive() {
    if (this.status.hp <= 0) {
      const nextStatus = new HeroStatus(this.status);
      nextStatus.alive = false;
      this.animationStatus.setDeadSprite(nextStatus.x, nextStatus.y);
      this.updateTargetMark(nextStatus);
      this.status = nextStatus;
      return false;
    }
    return true;
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
      this.animationStatus.setMoveAnchorCoord(
        this.status.targetMonster.x,
        this.status.targetMonster.y
      );
      return CONSTANTS.HERO_STATUS.WALKING;
    }
    return CONSTANTS.HERO_STATUS.ATTACKING;
  }

  update(delta) {
    this.calculateEffects();
    this.resetEffects();

    if (!this.isAlive()) {
      return;
    }

    Object.values(this.skillStatus.getSkills()).forEach(sk => sk.update(delta));

    const preUseSkillResult = this.getPreUseSkillResult();
    this.setUsingSkill(preUseSkillResult);
    this.action = this.getNextAction(preUseSkillResult);
    this.status = HeroAction.updateStatus({
      action: this.action,
      status: this.status,
      animationStatus: this.animationStatus,
      delta,
      effectFactory: this.effectFactory,
    });
    this.updateImage();
  }

  /* ITEM */
  getItem(item) {
    if (!this.itemStatus.hasItem(item.name)) {
      this.itemStatus.addItem(item, this, this.effectFactory);
    }
    this.statusDashboard.updateItemsCallBack();
  }

  consumeItem(itemName, effect) {
    if (this.itemStatus.consume(itemName)) {
      this.effectStatus.push(effect);
    }
    this.statusDashboard.updateItemsCallBack();
  }
}
