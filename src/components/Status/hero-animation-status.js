import * as PIXI from 'pixi.js';
import Status from '../status';
import CONSTANTS from '../../constants';

const textures = Symbol('HeroAnimationStatus: private: PIXI textures');
const sprite = Symbol('HeroAnimationStatus: private: PIXI Sprite');
const container = Symbol('HeroAnimationStatus: private: PIXI Container');
const moveAnchorSprite = Symbol('HeroAnimationStatus: private: PIXI Sprite');
const targetMarkSprite = Symbol('HeroAnimationStatus: private: PIXI Sprite');
const moveAnchorCoord = Symbol('HeroAnimationStatus: private: Object');
const stepCounter = Symbol('HeroAnimationStatus: private: Number');
const nowStepFrame = Symbol('HeroAnimationStatus: private: Number');
const nowAttackTiming = Symbol('HeroAnimationStatus: private: Number');
const nowAttackFrame = Symbol('nowAttackFrame: private: Number');

export default class HeroAnimationStatus extends Status {
  constructor(args) {
    super(args);
    if (!(args instanceof Status)) {
      // sprite
      this[textures] =
        PIXI.loader.resources['assets/images/link.json'].textures;
      this[sprite] = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/link.json'].textures[
          `link_face_${this.dir}_0.png`
        ]
      );
      this[sprite].anchor.set(0.5, 0.8);
      this[sprite].interactive = false;
      this[sprite].displayGroup = args.battleLayer;

      // goToTargetMarkSprite => moveAnchorSprite
      this[moveAnchorSprite] = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/control_unit.json'].textures[
          `go_to_target_mark.png`
        ]
      );
      this[moveAnchorSprite].visible = false;
      this[moveAnchorSprite].anchor.set(0.5);
      this[moveAnchorSprite].displayGroup = args.battleLayer;

      // clickTargetMarkSprite => targetMarkSprite
      this[targetMarkSprite] = new PIXI.Sprite(
        PIXI.loader.resources['assets/images/control_unit.json'].textures[
          `click_target_mark.png`
        ]
      );
      this[targetMarkSprite].visible = false;
      this[targetMarkSprite].anchor.set(0.5);
      this[targetMarkSprite].interactive = true;
      this[targetMarkSprite].displayGroup = args.upperUiLayer;

      // container
      this[container] = new PIXI.Container();
      this[container].interactive = false;

      // target => moveAnchorCoord
      this[moveAnchorCoord] = { x: args.x, y: args.y };

      //
      this[stepCounter] = 0;
      this[nowStepFrame] = 0;
      this[nowAttackFrame] = 0;
      this[nowAttackTiming] = 0;
    }
  }

  appendToContainer(parentContainer) {
    this[container].addChild(this[moveAnchorSprite]);
    this[container].addChild(this[targetMarkSprite]);
    this[container].addChild(this[sprite]);
    parentContainer.addChild(this[container]);
  }

  addContainerChild(child) {
    this[container].addChild(child);
  }

  removeContainerChild(child) {
    this[container].removeChild(child);
  }

  setTargetMark(targetSprite, eventListenerArgs) {
    this[targetMarkSprite].x = targetSprite.x;
    this[targetMarkSprite].y = targetSprite.y;
    this[targetMarkSprite].scale.x =
      targetSprite.width / CONSTANTS.TARGET_MARK_PROP.WIDTH;
    this[targetMarkSprite].scale.y =
      targetSprite.height / CONSTANTS.TARGET_MARK_PROP.HEIGHT * 0.8;
    this[targetMarkSprite].on(
      eventListenerArgs.name,
      eventListenerArgs.listener
    );
    this[targetMarkSprite].visible = true;
  }

  showTargetMark() {
    this[targetMarkSprite].visible = true;
  }

  hideTargetMark() {
    this[targetMarkSprite].visible = false;
  }

  showMoveAnchor() {
    this[moveAnchorSprite].visible = true;
  }

  hideMoveAnchor() {
    this[moveAnchorSprite].visible = false;
  }

  setSpriteTexture(texture) {
    this[sprite].texture = texture;
  }

  updateAttackingSprite(dir) {
    const textureKey = `link_attack_${dir}_${this[nowAttackFrame]}.png`;
    this[sprite].texture = this[textures][textureKey];

    if (this[nowAttackFrame] === 0) {
      this[sprite].anchor.set(0.5, 0.8);
      return;
    }

    switch (dir) {
      case CONSTANTS.DIRECTION.DOWN:
        this[sprite].anchor.set(0.5, 0.4);
        break;
      case CONSTANTS.DIRECTION.LEFT:
        this[sprite].anchor.set(0.75, 0.8);
        break;
      case CONSTANTS.DIRECTION.UP:
        this[sprite].anchor.set(0.5, 0.9);
        break;
      case CONSTANTS.DIRECTION.RIGHT:
        this[sprite].anchor.set(0.25, 0.8);
        break;
      default:
        break;
    }
  }

  updateWalkingSprite(x, y, dir) {
    const textureKey = `link_face_${dir}_${this[nowStepFrame]}.png`;

    this[sprite].texture = this[textures][textureKey];
    this[sprite].anchor.set(0.5, 0.8);
    this[sprite].x = x;
    this[sprite].y = y;

    this[moveAnchorSprite].x = this[moveAnchorCoord].x;
    this[moveAnchorSprite].y = this[moveAnchorCoord].y;
  }

  updateSpriteZOrder() {
    this[sprite].zOrder = -this[sprite].y - this[sprite].height / 2;
  }

  setDeadSprite(x, y) {
    this[sprite].texture = this[textures][`link_dead.png`];
    this[sprite].x = x;
    this[sprite].y = y;
    this[sprite].anchor.set(0.5, 0.8);
  }

  updateAttackingTiming(delta, attackDuration, onComplete) {
    this[nowAttackTiming] += delta;
    if (this[nowAttackTiming] < attackDuration * 0.4) {
      this[nowAttackFrame] = 0;
    } else if (this[nowAttackTiming] < attackDuration * 0.7) {
      this[nowAttackFrame] = 1;
    } else {
      onComplete(this[nowAttackFrame]);
      this[nowAttackFrame] = 2;
    }
    if (this[nowAttackTiming] >= attackDuration) {
      this[nowAttackTiming] -= attackDuration;
    }
  }

  resetAttackTiming() {
    this[nowAttackTiming] = 0;
  }

  updateStepCounter(delta, threshold) {
    this[stepCounter] += delta;
    if (this[stepCounter] >= threshold) {
      this[stepCounter] -= threshold;
      this[nowStepFrame] = this[nowStepFrame] === 0 ? 1 : 0;
    }
  }

  getMoveAnchorCoord() {
    return this[moveAnchorCoord];
  }

  setMoveAnchorCoord(x, y) {
    this[moveAnchorCoord].x = x;
    this[moveAnchorCoord].y = y;
  }

  getSprite() {
    return this[sprite];
  }
}
