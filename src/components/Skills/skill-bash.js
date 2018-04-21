import * as PIXI from 'pixi.js';
import CONSTANTS from '../../constants';
import Skill from '../skill';
import Effect from '../effect';
import { getDistUtil } from '../../utils';

export default class SkillBash extends Skill {
  constructor(args) {
    super(args);
    this.targetType = CONSTANTS.SKILL_TARGET_TYPE.SINGLE;
    this.attack = 30;
    this.range = 30;
    this.manaCost = 18;
    this.cooldownFrame = 180;
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

  beforeUse(sender, target) {
    if (target === undefined) {
      return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOT;
    }

    if (getDistUtil(sender, target) > this.range) {
      return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOR;
    }

    return super.beforeUse(sender);
  }

  updateUse(delta, sender, target) {
    if (this.nowSkillTiming === 0) {
      sender.container.addChild(this.sprite);
      this.sprite.visible = false;
    }
    this.nowSkillTiming += sender.getAttackTimingDelta(delta);
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
      if (this.nowSkillFrame === 1) {
        sender.mp -= this.manaCost;
        this.cdCounterFrame = this.cooldownFrame;
        target.effects.push(
          new Effect({
            sender,
            damage: this.attack,
            aggro: true,
          })
        );
      }
      this.nowSkillFrame = 2;
    } else if (this.nowSkillTiming >= this.skillAnimationDuration) {
      this.nowSkillTiming = 0;
      sender.container.removeChild(this.sprite);
      return true;
    }
    this.updateImage(sender, target);
    return false;
  }

  updateImage(sender, target) {
    sender.sprite.texture = this.heroTextures[
      `link_attack_${sender.dir}_${this.nowHeroFrame}.png`
    ];
    this.sprite.x = target.x;
    this.sprite.y = target.y;
    this.sprite.texture = this.textures[
      `bash_animation_${this.nowSkillFrame}.png`
    ];
    // TODO: make this cleaner
    if (this.nowHeroFrame === 0) {
      sender.sprite.anchor.set(0.5, 0.8);
    } else if (sender.dir === CONSTANTS.DIRECTION.DOWN) {
      sender.sprite.anchor.set(0.5, 0.4);
    } else if (sender.dir === CONSTANTS.DIRECTION.LEFT) {
      sender.sprite.anchor.set(0.75, 0.8);
    } else if (sender.dir === CONSTANTS.DIRECTION.UP) {
      sender.sprite.anchor.set(0.5, 0.9);
    } else if (sender.dir === CONSTANTS.DIRECTION.RIGHT) {
      sender.sprite.anchor.set(0.25, 0.8);
    }
  }

  // Move to skill-bash.js
  onSkillClick(e) {
    this.hero.usingSkill = this;
    e.stopPropagation();
  }

  updateIcon() {
    super.updateIcon();
  }
}
