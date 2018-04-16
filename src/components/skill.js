import CONSTANTS from '../constants';
export default class Skill {
	
	constructor(args) {
		Object.assign(this, args);
		this.skillIconSprite = new PIXI.Sprite();
	}

	updateCD(delta) {
		if (this.cdCounterFrame > delta) {
			this.cdCounterFrame -= delta;	
		} else {
			this.cdCounterFrame = 0;
		} 
		 
	}

	updateIcon(delta) {
		if (this.cdCounterFrame === 0) {
			this.skillIconSprite.visible = true;
		} else {
			this.skillIconSprite.visible = false;
		}
	}

	beforeUse(sender) {
		if (target === undefined) {
			return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOT;
		}
		if (sender.mp < this.manaCost) {
			return CONSTANTS.SKILL_CHECK_RESULT_TYPE.OOM;
		}
		if (this.cdCounterFrame > 0) {
			return CONSTANTS.SKILL_CHECK_RESULT_TYPE.IN_COOL;	
		}
	}

	use(sender) {
		sender.mp -= this.manaCost;
		this.cdCounterFrame = this.cooldownFrame;
	}

}