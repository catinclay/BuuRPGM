import CONSTANTS from '../constants';
import Skill from './skill';
import {
  getDistUtil
} from '../utils';

export default class SkillBash extends Skill {
	constructor(args) {
		super(args);
		this.targetType = CONSTANTS.SKILL_TARGET_TYPE.SINGLE;
		this.attack = 100;
		this.range = 30;
		this.manaCost = 15;
		this.cooldownFrame = 360;
		this.cdCounterFrame = 0;

		this.skillAnimationDuration = 60;
		this.nowSkillTiming = 0;
		this.nowSkillFrame = 0;

		this.heroTextures = PIXI.loader.resources['assets/images/link.json'].textures;
		this.textures = PIXI.loader.resources['assets/images/skill_1.json'].textures;
		this.sprite = new PIXI.Sprite();
		this.sprite.anchor.set(0.5, 0.5);
	    this.skillIconSprite.texture = this.textures[`bash_icon.png`];
	}

	beforeUse(sender, target) {
		super.use(sender);
		if (target === undefined) {
			return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOT;
		}

		if(getDistUtil(sender, target) > this.range) {
			return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOR;
		}

		return CONSTANTS.SKILL_CHECK_RESULT_TYPE.SUCCESS;
	}

	updateUse(delta, sender, target) {
		if (this.nowSkillTiming === 0) {
			this.sender.container.addChild(this.sprite);
		}
		this.nowSkillTiming += delta;
		if (this.nowSkillTiming < this.skillAnimationDuration * 0.3) {
			this.nowSkillFrame = 0;
		} else if (this.nowSkillTiming < this.skillAnimationDuration * 0.6) {
			this.nowSkillFrame = 1;
		} else if (this.nowSkillTiming < this.skillAnimationDuration){
			this.nowSkillFrame = 2;
		} else if (this.nowSkillFrame >= this.skillAnimationDuration){
			sender.mp -= this.manaCost;
			this.cdCounterFrame = this.cooldownFrame;
			target.effects.push(new Effect {
				sender: sender,
				damage: this.attack,
				aggro: true,
			});
			this.nowSkillTiming = 0;
			this.sender.container.removeChild(this.sprite);
			return true;
		}
		this.updateImage(sender, target);
		return false;
	}

	updateImage(sender, target) {
        sender.sprite.texture = this.heroTextures[
          `link_attack_${sender.dir}_${this.nowSkillFrame}.png`
        ];
        this.sprite.x = this.target.x;
		this.sprite.y = this.target.y;
        sender.sprite.texture = this.textures[
          `bash_animation_${this.nowSkillFrame}.png`
        ];
        // TODO: make this cleaner
        if (this.nowAttackFrame === 0) {
          this.sprite.anchor.set(0.5, 0.8);
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          this.sprite.anchor.set(0.5, 0.4);
        } else if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          this.sprite.anchor.set(0.75, 0.8);
        } else if (this.dir === CONSTANTS.DIRECTION.UP) {
          this.sprite.anchor.set(0.5, 0.9);
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          this.sprite.anchor.set(0.25, 0.8);
        }
	}

	updateIcon() {
		super.updateIcon();
	}
}