import CONSTANTS from '../constants';
import { getDistUtil } from '../utils';
import HeroStatus from './Status/hero-status';
import HeroSkillStatus from './Status/hero-skill-status';
import HeroEffectStatus from './Status/hero-effect-status';
import HeroAction from './Actions/hero-action';
import SkillBash from './Skills/skill-bash';

export default class Hero {
  constructor(args) {
    const thisHero = this;
    this.consoleLog = args.consoleLog;
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
    this.action = CONSTANTS.HERO_STATUS.WALKING;
    this.effectFactory = args.effectFactory;
  }

  // getSkillStatus() {
  //   return this.skillStatus;
  // }

  getStatus(type) {
    switch (type) {
      case CONSTANTS.STATUS_TYPE.SKILL:
        return this.skillStatus;
      case CONSTANTS.STATUS_TYPE.EFFECT:
        return this.effectStatus;
      case CONSTANTS.STATUS_TYPE.PROP:
      default:
        return this.status;
    }
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

  /* TODO: move to private */
  isAlive() {
    if (this.status.hp <= 0) {
      const nextStatus = new HeroStatus(this.status);
      nextStatus.alive = false;
      nextStatus.sprite.texture = this.status.textures[`link_dead.png`];
      nextStatus.sprite.x = this.status.x;
      nextStatus.sprite.y = this.status.y;
      nextStatus.sprite.anchor.set(0.5, 0.8);
      this.updateTargetMark(nextStatus);
      this.status = nextStatus;
      return false;
    }
    return true;
  }

  updateTargetMark(status) {
    if (status.targetMonster !== undefined) {
      status.clickTargetMarkSprite.x = this.status.targetMonster.sprite.x;
      status.clickTargetMarkSprite.y = this.status.targetMonster.sprite.y;
      status.clickTargetMarkSprite.scale.x =
        status.targetMonster.sprite.width / CONSTANTS.TARGET_MARK_PROP.WIDTH;
      status.clickTargetMarkSprite.scale.y =
        status.targetMonster.sprite.height /
        CONSTANTS.TARGET_MARK_PROP.HEIGHT *
        0.8;
      status.clickTargetMarkSprite.on(
        'pointerdown',
        this.taretMarkOnMouseClick.bind(this)
      );
      status.clickTargetMarkSprite.visible = true;
    } else {
      status.clickTargetMarkSprite.visible = false;
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
      delta,
      effectFactory: this.effectFactory,
    });
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
    this.updateTargetMark(this.status);

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
