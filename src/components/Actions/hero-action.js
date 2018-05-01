import Action from '../action';
import HeroStatus from '../Status/hero-status';
import CONSTANTS from '../../constants';
import {
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../../utils';

function cast(propStatus, animationStatus, delta) {
  switch (propStatus.usingSkill.targetType) {
    case CONSTANTS.SKILL_TARGET_TYPE.SINGLE:
    default:
      return propStatus.usingSkill.updateStatus(
        propStatus,
        animationStatus,
        delta
      );
  }
}

function attack(propStatus, animationStatus, delta, effectFactory) {
  const nextStatus = new HeroStatus(propStatus);
  if (!nextStatus.targetMonster.alive) {
    nextStatus.targetMonster = undefined;
    animationStatus.setMoveAnchorCoord(nextStatus.x, nextStatus.y);
    return nextStatus;
  }
  faceToTargetUtil(nextStatus, nextStatus.targetMonster);
  animationStatus.updateAttackingTiming(
    delta,
    nextStatus.attackDuration,
    nowAttackFrame => {
      if (nowAttackFrame <= 1) {
        nextStatus.targetMonster.effects.push(
          effectFactory.createEffect({
            sender: propStatus,
            damage: propStatus.batk + getRandomIntUtil(propStatus.fatk),
            aggro: true,
            color: 0xdddddd,
          })
        );
      }
    }
  );
  return nextStatus;
}

function move(propStatus, animationStatus, delta) {
  const nextStatus = new HeroStatus(propStatus);
  // Reset attack timer.
  animationStatus.resetAttackTiming();
  animationStatus.updateStepCounter(delta, 10);

  if (
    goToTargetUtil(
      nextStatus,
      animationStatus.getMoveAnchorCoord(),
      nextStatus.moveSpeed * delta
    ) ||
    nextStatus.targetMonster !== undefined
  ) {
    animationStatus.hideMoveAnchor();
  } else {
    animationStatus.showMoveAnchor();
  }

  faceToTargetUtil(nextStatus, animationStatus.getMoveAnchorCoord());

  return nextStatus;
}

export default class HeroAction extends Action {
  static updateStatus(args) {
    let nextStatus = args.status;
    switch (args.action) {
      case CONSTANTS.HERO_STATUS.SKILLING:
        nextStatus = cast(
          args.status,
          args.animationStatus,
          args.delta,
          args.effectFactory
        );
        break;
      case CONSTANTS.HERO_STATUS.ATTACKING:
        nextStatus = attack(
          args.status,
          args.animationStatus,
          args.delta,
          args.effectFactory
        );
        break;
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        nextStatus = move(
          args.status,
          args.animationStatus,
          args.delta,
          args.effectFactory
        );
        break;
    }
    return nextStatus;
  }
}
