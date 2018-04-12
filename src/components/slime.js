import * as PIXI from 'pixi.js';
import Monster from './monster';
import MONSTER_PROFILES from '../monsterProfiles';
import CONSTANTS from '../constants';
import Effect from './effect';
import {
  getDistUtil,
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../utils';

export default class Slime extends Monster {
  constructor(args) {
    super(args);
    // Setup
    this.jumpCounter = 0;
    this.nowJump = 0;
    this.textures = PIXI.loader.resources['assets/images/slime.json'].textures;

    this.monsterName = MONSTER_PROFILES.SLIME.NAME;
    this.maxHp = MONSTER_PROFILES.SLIME.MAXHP;
    this.armor = MONSTER_PROFILES.SLIME.ARMOR;
    this.attackRange = MONSTER_PROFILES.SLIME.ATKRANGE;
    this.attackDuration = MONSTER_PROFILES.SLIME.ATKDUR;
    this.batk = MONSTER_PROFILES.SLIME.BATK;
    this.fatk = MONSTER_PROFILES.SLIME.FATK;
    this.moveSpeed = MONSTER_PROFILES.SLIME.MVSPD;
    this.armor = MONSTER_PROFILES.SLIME.ARMOR;

    this.status = CONSTANTS.MONSTER_STATUS.WALKING;
    this.nowAttackTiming = 0;
    this.nowAttackFrame = 0;
    this.aggro = false;
    this.hp = this.maxHp;
    this.alive = true;
    this.targetObject = this.hero;
  }

  attackTargetObject(delta) {
    if (!this.targetObject.alive) {
      this.targetObject = undefined;
      return;
    }
    faceToTargetUtil(this, this.targetObject);
    this.nowAttackTiming += delta;
    if (this.nowAttackTiming < this.attackDuration * 0.4) {
      this.nowAttackFrame = 0;
    } else if (this.nowAttackTiming < this.attackDuration * 0.7) {
      this.nowAttackFrame = 1;
    } else {
      if (this.nowAttackFrame === 1) {
        this.targetObject.effects.push(
          new Effect({
            sender: this,
            damage: this.batk + getRandomIntUtil(this.fatk),
          })
        );
      }
      this.nowAttackFrame = 2;
    }
    if (this.nowAttackTiming >= this.attackDuration) {
      this.nowAttackTiming -= this.attackDuration;
    }
  }

  update(delta) {
    super.calculateEffects();
    super.checkAlive();
    if (!this.alive) {
      return;
    }
    if (this.aggro === false || this.targetObject === undefined) {
      this.status = CONSTANTS.MONSTER_STATUS.WALKING;
    } else if (getDistUtil(this, this.targetObject) > this.attackRange) {
      this.status = CONSTANTS.MONSTER_STATUS.WALKING;
      goToTargetUtil(this, this.targetObject, this.moveSpeed * delta);
    } else {
      this.status = CONSTANTS.MONSTER_STATUS.ATTACKING;
    }

    switch (this.status) {
      case CONSTANTS.MONSTER_STATUS.ATTACKING:
        this.attackTargetObject(delta);
        break;
      case CONSTANTS.MONSTER_STATUS.WALKING:
      default:
        this.nowAttackTiming = 0;
        this.jumpCounter += delta;
        if (this.jumpCounter >= 20) {
          this.jumpCounter -= 20;
          this.nowJump = this.nowJump === 0 ? 1 : 0;
        }
        break;
    }
    this.updateImage();
  }

  updateImage() {
    if (this.isShowingHp) {
      super.updateHp();
    }
    switch (this.status) {
      case CONSTANTS.MONSTER_STATUS.ATTACKING: {
        this.sprite.texture = this.textures[
          `${this.monsterName}_attack_${this.dir}_${this.nowAttackFrame}.png`
        ];
        let dx = 0;
        let dy = 0;
        if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          dx = -8;
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          dx = 8;
        }
        if (this.dir === CONSTANTS.DIRECTION.UP) {
          dy = -8;
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          dy = 8;
        }
        this.sprite.x =
          this.x - this.sprite.width / 2 + dx * this.nowAttackFrame;
        this.sprite.y =
          this.y - this.sprite.height / 2 + dy * this.nowAttackFrame;
        break;
      }
      case CONSTANTS.MONSTER_STATUS.WALKING:
      default:
        this.sprite.texture = this.textures[
          `${this.monsterName}_face_down_${this.nowJump}.png`
        ];
        this.sprite.x = this.x - this.sprite.width / 2;
        this.sprite.y = this.y - this.sprite.height / 2;
        break;
    }
  }
}
