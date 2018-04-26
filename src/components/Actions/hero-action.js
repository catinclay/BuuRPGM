import Action from '../action';
import HeroStatus from '../Status/hero-status';
import CONSTANTS from '../../constants';
import {
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../../utils';

function cast(currentStatus, delta) {
  switch (currentStatus.usingSkill.targetType) {
    case CONSTANTS.SKILL_TARGET_TYPE.SINGLE:
    default:
      return currentStatus.usingSkill.updateStatus(currentStatus, delta);
  }
}

function attack(currentStatus, delta, effectFactory) {
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
        effectFactory.createEffect({
          sender: currentStatus,
          damage: currentStatus.batk + getRandomIntUtil(currentStatus.fatk),
          aggro: true,
          color: 0xdddddd,
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

function move(currentStatus, delta) {
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
  static updateStatus(args) {
    let nextStatus = args.status;
    switch (args.action) {
      case CONSTANTS.HERO_STATUS.SKILLING:
        nextStatus = cast(args.status, args.delta, args.effectFactory);
        break;
      case CONSTANTS.HERO_STATUS.ATTACKING:
        nextStatus = attack(args.status, args.delta, args.effectFactory);
        break;
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        nextStatus = move(args.status, args.delta, args.effectFactory);
        break;
    }
    return nextStatus;
  }
}
