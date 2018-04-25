import * as PIXI from 'pixi.js';
import CONSTANTS from '../../constants';
import Skill from '../skill';
import { getDistUtil, getRandomIntUtil } from '../../utils';
import HeroStatus from '../Status/hero-status';

export default class SkillBash extends Skill {
  constructor(args) {
    super(args);
    this.targetType = CONSTANTS.SKILL_TARGET_TYPE.SINGLE;
    this.attack = 15;
    this.range = 30;
    this.manaCost = 22;
    this.cooldownFrame = 90;
    this.cdCounterFrame = 0;

    this.skillAnimationDuration = 60;
    this.nowSkillTiming = 0;
    this.nowHeroFrame = 0;
    this.nowSkillFrame = 0;

    this.heroTextures =
      PIXI.loader.resources['assets/images/link.json'].textures;
    this.textures =
      PIXI.loader.resources['assets/images/skill_1.json'].textures;
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.skillIconSprite.texture = this.textures[`bash_icon.png`];

    this.sprite.displayGroup = args.layer;
  }

  beforeUse(senderStatus, target) {
    if (target === undefined) {
      return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOT;
    }

    if (getDistUtil(senderStatus, target) > this.range) {
      return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOR;
    }

    return super.beforeUse(senderStatus);
  }

  // updateUse(delta, sender, target) {
  //   if (this.nowSkillTiming === 0) {
  //     sender.container.addChild(this.sprite);
  //     this.sprite.visible = false;
  //   }
  //   this.nowSkillTiming += delta;
  //   if (this.nowSkillTiming < this.skillAnimationDuration * 0.1) {
  //     this.nowHeroFrame = 0;
  //   } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.2) {
  //     this.nowHeroFrame = 1;
  //   } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.25) {
  //     this.nowHeroFrame = 2;
  //   } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.3) {
  //     this.nowHeroFrame = 0;
  //   } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.7) {
  //     this.sprite.visible = true;
  //     this.nowSkillFrame = 0;
  //   } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.8) {
  //     this.nowSkillFrame = 1;
  //   } else if (this.nowSkillTiming < this.skillAnimationDuration) {
  //     if (this.nowSkillFrame === 1) {
  //       sender.mp -= this.manaCost;
  //       this.cdCounterFrame = this.cooldownFrame;
  //       target.effects.push(
  //         new Effect({
  //           sender,
  //           damage: this.attack,
  //           aggro: true,
  //         })
  //       );
  //     }
  //     this.nowSkillFrame = 2;
  //   } else if (this.nowSkillTiming >= this.skillAnimationDuration) {
  //     this.nowSkillTiming = 0;
  //     sender.container.removeChild(this.sprite);
  //     return true;
  //   }
  //   this.updateImage(sender, target);
  //   return false;
  // }
  updateStatus(currentStatus, delta) {
    return this.updateImage(this.updateAnimation(currentStatus, delta));
  }

  updateAnimation(currentStatus, delta) {
    const nextStatus = new HeroStatus(currentStatus);
    if (this.nowSkillTiming === 0) {
      nextStatus.container.addChild(this.sprite);
      this.sprite.visible = false;
    }
    this.nowSkillTiming += nextStatus.atkSpeedAmp * delta;
    if (this.nowSkillTiming < this.skillAnimationDuration * 0.1) {
      this.nowHeroFrame = 0;
    } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.2) {
      this.nowHeroFrame = 1;
    } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.25) {
      this.nowHeroFrame = 2;
    } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.3) {
      this.nowHeroFrame = 0;
    } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.7) {
      this.sprite.visible = true;
      this.nowSkillFrame = 0;
    } else if (this.nowSkillTiming < this.skillAnimationDuration * 0.8) {
      this.nowSkillFrame = 1;
    } else if (this.nowSkillTiming < this.skillAnimationDuration) {
      if (this.nowSkillFrame <= 1) {
        nextStatus.mp -= this.manaCost;
        this.cdCounterFrame = this.cooldownFrame;
        nextStatus.targetMonster.effects.push(
          this.effectFactory.createEffect({
            nextStatus,
            damage:
              this.attack +
              2 * nextStatus.batk +
              getRandomIntUtil(2 * nextStatus.fatk),
            aggro: true,
            color: 0xffff33,
          })
        );
      }
      this.nowSkillFrame = 2;
    } else if (this.nowSkillTiming >= this.skillAnimationDuration) {
      this.nowSkillTiming = 0;
      nextStatus.container.removeChild(this.sprite);
      nextStatus.usingSkill = undefined;
    }
    return nextStatus;
  }

  updateImage(currentStatus) {
    const nextStatus = new HeroStatus(currentStatus);
    nextStatus.sprite.texture = this.heroTextures[
      `link_attack_${currentStatus.dir}_${this.nowHeroFrame}.png`
    ];
    this.sprite.x = nextStatus.target.x;
    this.sprite.y = nextStatus.target.y;
    this.sprite.texture = this.textures[
      `bash_animation_${this.nowSkillFrame}.png`
    ];
    // TODO: make this cleaner
    if (this.nowHeroFrame === 0) {
      nextStatus.sprite.anchor.set(0.5, 0.8);
    } else if (nextStatus.dir === CONSTANTS.DIRECTION.DOWN) {
      nextStatus.sprite.anchor.set(0.5, 0.4);
    } else if (nextStatus.dir === CONSTANTS.DIRECTION.LEFT) {
      nextStatus.sprite.anchor.set(0.75, 0.8);
    } else if (nextStatus.dir === CONSTANTS.DIRECTION.UP) {
      nextStatus.sprite.anchor.set(0.5, 0.9);
    } else if (nextStatus.dir === CONSTANTS.DIRECTION.RIGHT) {
      nextStatus.sprite.anchor.set(0.25, 0.8);
    }
    return nextStatus;
  }

  // Move to skill-bash.js
  // onSkillClick(e) {
  //   this.heroStatus.usingSkill = this;
  //   e.stopPropagation();
  // }

  updateIcon() {
    super.updateIcon();
  }
}
