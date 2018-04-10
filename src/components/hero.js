import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';
import getDist from '../utils';

export default class Hero {
  constructor(args) {
    // Setup
    this.x = args.x;
    this.y = args.y;
    this.dir = args.dir;
    this.textures = PIXI.loader.resources['assets/images/link.json'].textures;
    this.sprite = new PIXI.Sprite(this.textures[`link_face_${this.dir}_0.png`]);
    this.stepCounter = 0;
    this.nowStepFrame = 0;
    this.updateImage();
    this.target = { x: this.x, y: this.y };
    this.moveSpeed = 2;
    this.attackRange = 30;
    this.stats = CONSTANTS.HERO_STATUS.WALKING;
    this.nowAttackFrame = 0;
    this.nowAttackTiming = 0;
    this.attackDuration = 60; // 1 sec per attack
  }

  onClickGround(args) {
    this.target.x = args.x;
    this.target.y = args.y;
    this.targetMonster = undefined;
    this.status = CONSTANTS.HERO_STATUS.WALKING;
  }

  faceToTarget(target) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        this.dir = CONSTANTS.DIRECTION.RIGHT;
      } else if (dx < 0) {
        this.dir = CONSTANTS.DIRECTION.LEFT;
      }
    } else if (dy > 0) {
      this.dir = CONSTANTS.DIRECTION.DOWN;
    } else if (dy < 0) {
      this.dir = CONSTANTS.DIRECTION.UP;
    }
  }

  goToTarget(delta) {
    // Reset attack timer.
    this.nowAttackTiming = 0;

    this.stepCounter += delta;
    if (this.stepCounter >= 10) {
      this.stepCounter -= 10;
      this.nowStepFrame = this.nowStepFrame === 0 ? 1 : 0;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) {
      return;
    }

    if (dist < this.moveSpeed * delta) {
      this.x = this.target.x;
      this.y = this.target.y;
      return;
    }

    this.faceToTarget(this.target);
    const rx = dx / dist;
    const ry = dy / dist;
    this.x += this.moveSpeed * rx * delta;
    this.y += this.moveSpeed * ry * delta;
  }

  attackMonster(delta) {
    this.faceToTarget(this.targetMonster);
    this.nowAttackTiming += delta;
    if (this.nowAttackTiming < this.attackDuration * 0.4) {
      this.nowAttackFrame = 0;
    } else if (this.nowAttackTiming < this.attackDuration * 0.7) {
      this.nowAttackFrame = 1;
    } else {
      this.nowAttackFrame = 2;
    }
    if (this.nowAttackTiming >= this.attackDuration) {
      this.nowAttackTiming -= this.attackDuration;
    }
  }

  update(delta) {
    if (this.targetMonster === undefined) {
      this.status = CONSTANTS.HERO_STATUS.WALKING;
    } else if (
      this.targetMonster !== undefined &&
      getDist(this, this.targetMonster) > this.attackRange
    ) {
      this.status = CONSTANTS.HERO_STATUS.WALKING;
      this.target.x = this.targetMonster.x;
      this.target.y = this.targetMonster.y;
    } else if (
      this.targetMonster !== undefined &&
      getDist(this, this.targetMonster) <= this.attackRange
    ) {
      this.status = CONSTANTS.HERO_STATUS.ATTACKING;
    }

    switch (this.status) {
      case CONSTANTS.HERO_STATUS.ATTACKING:
        this.attackMonster(delta);
        break;
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.goToTarget(delta);
    }
    this.updateImage();
  }

  updateImage() {
    switch (this.status) {
      case CONSTANTS.HERO_STATUS.ATTACKING:
        this.sprite.texture = this.textures[
          `link_attack_${this.dir}_${this.nowAttackFrame}.png`
        ];

        // TODO: make this cleaner
        if (this.nowAttackFrame === 0) {
          this.sprite.x = this.x - this.sprite.width / 2;
          this.sprite.y = this.y - this.sprite.height / 2;
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          this.sprite.x = this.x - this.sprite.width / 2;
          this.sprite.y = this.y - this.sprite.height / 4;
        } else if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          this.sprite.x = this.x - this.sprite.width / 4 * 3;
          this.sprite.y = this.y - this.sprite.height / 2;
        } else if (this.dir === CONSTANTS.DIRECTION.UP) {
          this.sprite.x = this.x - this.sprite.width / 2;
          this.sprite.y = this.y - this.sprite.height / 4 * 3;
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          this.sprite.x = this.x - this.sprite.width / 4;
          this.sprite.y = this.y - this.sprite.height / 2;
        }
        break;
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.sprite.texture = this.textures[
          `link_face_${this.dir}_${this.nowStepFrame}.png`
        ];
        this.sprite.x = this.x - this.sprite.width / 2;
        this.sprite.y = this.y - this.sprite.height / 2;
        break;
    }
  }
}
