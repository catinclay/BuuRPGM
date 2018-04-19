import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';

export default class Skill {
  constructor(args) {
    Object.assign(this, args);
    this.skillIconSprite = new PIXI.Sprite();
    this.skillIconSprite.interactive = true;
    this.skillIconSprite.anchor.set(0.5, 0.5);
    this.hero = args.hero;
    // Move to skill-bash.js?
    this.skillIconSprite.on('pointerdown', this.onSkillClick.bind(this));
  }

  update(delta) {
    this.updateCD(delta);
    this.updateIcon();
  }

  updateCD(delta) {
    if (this.cdCounterFrame > delta) {
      this.cdCounterFrame -= delta;
    } else {
      this.cdCounterFrame = 0;
    }
  }

  updateIcon() {
    if (this.cooldownFrame !== 0) {
      this.skillIconSprite.scale.y =
        1 - this.cdCounterFrame / this.cooldownFrame;
    }
  }

  beforeUse(sender) {
    if (sender.mp < this.manaCost) {
      return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOM;
    }
    if (this.cdCounterFrame > 0) {
      return CONSTANTS.SKILL_CHECK_RESULT_TYPE.IN_COOL;
    }
    return CONSTANTS.SKILL_CHECK_RESULT_TYPE.SUCCESS;
  }
}
