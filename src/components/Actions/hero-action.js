import Action from '../action';
import HeroStatus from '../Status/hero-status';
import CONSTANTS from '../../constants';
import Effect from '../effect';
import {
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../../utils';

function useSkill(currentStatus, delta) {
  switch (currentStatus.usingSkill.targetType) {
    case CONSTANTS.SKILL_TARGET_TYPE.SINGLE:
    default:
      return currentStatus.usingSkill.updateStatus(currentStatus, delta);
  }
}

function attackMonster(currentStatus, delta) {
  const nextStatus = new HeroStatus(currentStatus);
  if (!nextStatus.targetMonster.alive) {
    nextStatus.targetMonster = undefined;
    nextStatus.target.x = nextStatus.x;
    nextStatus.target.y = nextStatus.y;
    return nextStatus;
  }
  faceToTargetUtil(nextStatus, nextStatus.targetMonster);
  nextStatus.nowAttackTiming += delta;
  if (nextStatus.nowAttackTiming < nextStatus.attackDuration * 0.4) {
    nextStatus.nowAttackFrame = 0;
  } else if (nextStatus.nowAttackTiming < nextStatus.attackDuration * 0.7) {
    nextStatus.nowAttackFrame = 1;
  } else {
    if (nextStatus.nowAttackFrame === 1) {
      nextStatus.targetMonster.effects.push(
        new Effect({
          sender: currentStatus,
          damage: nextStatus.batk + getRandomIntUtil(nextStatus.fatk),
          aggro: true,
        })
      );
    }
    nextStatus.nowAttackFrame = 2;
  }
  if (nextStatus.nowAttackTiming >= nextStatus.attackDuration) {
    nextStatus.nowAttackTiming -= nextStatus.attackDuration;
  }
  return nextStatus;
}

function goToTarget(currentStatus, delta) {
  const nextStatus = new HeroStatus(currentStatus);
  // Reset attack timer.
  nextStatus.nowAttackTiming = 0;

  nextStatus.stepCounter += delta;
  if (nextStatus.stepCounter >= 10) {
    nextStatus.stepCounter -= 10;
    nextStatus.nowStepFrame = nextStatus.nowStepFrame === 0 ? 1 : 0;
  }

  if (
    goToTargetUtil(
      nextStatus,
      nextStatus.target,
      nextStatus.moveSpeed * delta
    ) ||
    nextStatus.targetMonster !== undefined
  ) {
    nextStatus.goToTargetMarkSprite.visible = false;
  } else {
    nextStatus.goToTargetMarkSprite.visible = true;
  }

  faceToTargetUtil(nextStatus, nextStatus.target);

  return nextStatus;
}

export default class HeroAction extends Action {
  static filter(action, currentStatus, delta) {
    let nextStatus = currentStatus;
    switch (action) {
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
    return nextStatus;
  }
}
