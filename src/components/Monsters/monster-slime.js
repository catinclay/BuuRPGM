import * as PIXI from 'pixi.js';
import Monster from '../monster';
import MONSTER_PROFILES from '../../monsterProfiles';
import CONSTANTS from '../../constants';
import {
  getDistUtil,
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../../utils';

export default class Slime extends Monster {
  constructor(args) {
    super(args);
    // Setup
    this.jumpCounter = 0;
    this.nowJump = 0;
    this.textures = PIXI.loader.resources['assets/images/slime.json'].textures;
    this.sprite.scale.x = 1.5;
    this.sprite.scale.y = 1.5;

    this.monsterName = MONSTER_PROFILES.SLIME.NAME;
    this.maxHp = MONSTER_PROFILES.SLIME.MAXHP;
    this.armor = MONSTER_PROFILES.SLIME.ARMOR;
    this.attackRange = MONSTER_PROFILES.SLIME.ATKRANGE;
    this.attackDuration = MONSTER_PROFILES.SLIME.ATKDUR;
    this.batk = MONSTER_PROFILES.SLIME.BATK;
    this.fatk = MONSTER_PROFILES.SLIME.FATK;
    this.moveSpeed = MONSTER_PROFILES.SLIME.MVSPD;
    this.armor = MONSTER_PROFILES.SLIME.ARMOR;
    this.aggroRange = MONSTER_PROFILES.SLIME.AGGRORANGE;
    this.dropItemList = MONSTER_PROFILES.SLIME.DROP_ITEM_LIST;

    this.status = CONSTANTS.MONSTER_STATUS.WALKING;
    this.nowAttackTiming = 0;
    this.nowAttackFrame = 0;
    this.aggro = false;
    this.hp = this.maxHp;
    this.alive = true;
    this.targetObject = this.hero;
  }

  attackTargetObject(delta) {
    // console.log(this.targetObject);
    if (!this.targetObject.status.alive) {
      this.targetObject = undefined;
      return;
    }
    faceToTargetUtil(this, this.targetObject.status);
    this.nowAttackTiming += delta;
    if (this.nowAttackTiming < this.attackDuration * 0.4) {
      this.nowAttackFrame = 0;
    } else if (this.nowAttackTiming < this.attackDuration * 0.7) {
      this.nowAttackFrame = 1;
    } else {
      if (this.nowAttackFrame <= 1) {
        this.targetObject.effectStatus.push(
          this.effectFactory.createEffect({
            sender: this,
            damage: this.batk + getRandomIntUtil(this.fatk),
          })
        );
      }
      this.nowAttackFrame = 2;
    }
    if (this.nowAttackTiming >= this.attackDuration) {
      this.nowAttackTiming -= this.attackDuration;
      this.nowAttackFrame = 0;
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
    } else if (getDistUtil(this, this.targetObject.status) > this.aggroRange) {
      this.status = CONSTANTS.MONSTER_STATUS.WALKING;
      this.aggro = false;
    } else if (getDistUtil(this, this.targetObject.status) > this.attackRange) {
      this.status = CONSTANTS.MONSTER_STATUS.WALKING;
      goToTargetUtil(this, this.targetObject.status, this.moveSpeed * delta);
    } else {
      this.status = CONSTANTS.MONSTER_STATUS.ATTACKING;
    }
    // console.log(this.status);

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
    const attackOffset = 6;
    switch (this.status) {
      case CONSTANTS.MONSTER_STATUS.ATTACKING: {
        this.sprite.texture = this.textures[
          `${this.monsterName}_attack_${this.dir}_${this.nowAttackFrame}.png`
        ];
        let dx = 0;
        let dy = 0;
        if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          dx = -1 * attackOffset * this.nowAttackTiming / this.attackDuration;
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          dx = attackOffset * this.nowAttackTiming / this.attackDuration;
        }
        if (this.dir === CONSTANTS.DIRECTION.UP) {
          dy = -1 * attackOffset * this.nowAttackTiming / this.attackDuration;
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          dy = attackOffset * this.nowAttackTiming / this.attackDuration;
        }
        this.sprite.x = this.x + dx * this.nowAttackFrame;
        this.sprite.y = this.y + dy * this.nowAttackFrame;
        break;
      }
      case CONSTANTS.MONSTER_STATUS.WALKING:
      default:
        this.sprite.texture = this.textures[
          `${this.monsterName}_face_down_${this.nowJump}.png`
        ];
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        break;
    }
    super.updateZOder();
  }
}
