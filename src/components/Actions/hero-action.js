import Action from '../action';
import HeroStatus from '../Status/hero-status';
import CONSTANTS from '../../constants';

export default class HeroAction extends Action{
	constructor(args) {
		super(args);
  	}

  	filter(action, currentStatus, delta){
  		var nextStatus = currentStatus;
  		switch(action){
  			case CONSTANTS.HERO_STATUS.SKILLING:
  				nextStatus = useSkill(currentStatus, delta);
  				break;
  			case CONSTANTS.HERO_STATUS.ATTACKING:
  				nextStatus = attackMonster(currentStatus, delta);
  				break;
  			case CONSTANTS.HERO_STATUS.WALKING:
  			default:
  				nextStatus = goToTarget(currentStatus, delta);
  				break;
  		}
  		nextStatus = executeEffects(nextStatus,delta);
  		return nextStatus;
  	}

	useSkill(currentStatus, delta) {
		switch (this.hero.usingSkill.targetType) {
			case CONSTANTS.SKILL_TARGET_TYPE.SINGLE:
			default:
				if (currentStatus.usingSkill.updateUse(delta, this.hero, this.targetMonster)) {
					return Object.assign(currentStatus,{ 
						usingSkill: null,
						mp: currentStatus.mp - currentStatus.usingSkill.manaCost
					});
				} else {
					this.hero.usingSkill.updateImage(this, this.targetMonster);
				}
				break;
		}
	}

	attackMonster(currentStatus, delta) {
		if (!this.targetMonster.alive) {
			this.targetMonster = undefined;
			this.target.x = this.x;
			this.target.y = this.y;
			return;
		}
		faceToTargetUtil(this, this.targetMonster);
		this.nowAttackTiming += delta;
		if (this.nowAttackTiming < this.getAttackDuration() * 0.4) {
			this.nowAttackFrame = 0;
		} else if (this.nowAttackTiming < this.getAttackDuration() * 0.7) {
			this.nowAttackFrame = 1;
		} else {
			if (this.nowAttackFrame === 1) {
				this.targetMonster.effects.push(
					new Effect({
						sender: this,
						damage: this.batk + getRandomIntUtil(this.fatk),
						aggro: true,
					})
				);
			}
			this.nowAttackFrame = 2;
		}
		if (this.nowAttackTiming >= this.getAttackDuration()) {
			this.nowAttackTiming -= this.getAttackDuration();
		}
	}

	goToTarget(currentStatus, delta) {
		// Reset attack timer.
		this.nowAttackTiming = 0;

		this.stepCounter += delta;
		if (this.stepCounter >= 10) {
			this.stepCounter -= 10;
			this.nowStepFrame = this.nowStepFrame === 0 ? 1 : 0;
		}

		if (goToTargetUtil(this, this.target, this.moveSpeed * delta) ||
			this.targetMonster !== undefined
		){
			this.goToTargetMarkSprite.visible = false;
		} else {
			this.goToTargetMarkSprite.visible = true;
		}

		faceToTargetUtil(this, this.target);
	}

	executeEffects(status, delta){
		return status;
	}
}