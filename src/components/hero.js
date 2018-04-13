import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';
import Effect from './effect';
import Item from '../item';
import {
  getDistUtil,
  goToTargetUtil,
  faceToTargetUtil,
  getRandomIntUtil,
} from '../utils';

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
    this.status = CONSTANTS.HERO_STATUS.WALKING;
    this.nowAttackFrame = 0;
    this.nowAttackTiming = 0;
    this.attackDuration = 60; // 1 sec per attack
    this.batk = 8;
    this.fatk = 8;
    this.alive = true;
    this.effects = [];
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.armor = 0;
    this.itemList = new Array(CONSTANTS.MAX_ITEM_NUM);
  }

  loadItem(item){
    if(!item || !item instanceof Item){
      return;
    }
    if(itemList.length < CONSTANTS.MAX_ITEM_NUM-1){
      itemList.push(item);
      item.on(this);
    }
  }

  unloadItem(index){
    if(index<itemList.length){
      let deletedItem = item.splice(index,1);
      deletedItem.off(this);
    }
  }

  useItem(index,target,canUseCallback){
    if(index<itemList.length){
      itemList[iindex].use(this,target,canUseCallback);
    }
  }


  onClickGround(args) {
    this.target.x = args.x;
    this.target.y = args.y;
    this.targetMonster = undefined;
    this.status = CONSTANTS.HERO_STATUS.WALKING;
  }

  goToTarget(delta) {
    // Reset attack timer.
    this.nowAttackTiming = 0;

    this.stepCounter += delta;
    if (this.stepCounter >= 10) {
      this.stepCounter -= 10;
      this.nowStepFrame = this.nowStepFrame === 0 ? 1 : 0;
    }

    goToTargetUtil(this, this.target, this.moveSpeed * delta);

    faceToTargetUtil(this, this.target);
  }

  attackMonster(delta) {
    if (!this.targetMonster.alive) {
      this.targetMonster = undefined;
      this.target.x = this.x;
      this.target.y = this.y;
      return;
    }
    this.targetMonster.isShowingHp = true;
    faceToTargetUtil(this, this.targetMonster);
    this.nowAttackTiming += delta;
    if (this.nowAttackTiming < this.attackDuration * 0.4) {
      this.nowAttackFrame = 0;
    } else if (this.nowAttackTiming < this.attackDuration * 0.7) {
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
    if (this.nowAttackTiming >= this.attackDuration) {
      this.nowAttackTiming -= this.attackDuration;
    }
  }

  calculateEffects() {
    for (let i = 0; i < this.effects.length; i += 1) {
      this.effects[i].onEffect(this);
    }
    this.effects = [];
  }

  checkAlive() {
    if (this.hp <= 0) {
      this.alive = false;
      this.sprite.texture = this.textures[`link_dead.png`];
      this.sprite.x = this.x - this.sprite.width / 2;
      this.sprite.y = this.y - this.sprite.height / 2;
    }
  }

  update(delta) {
    this.calculateEffects();
    this.checkAlive();
    if (!this.alive) {
      return;
    }

    if (this.targetMonster === undefined) {
      this.status = CONSTANTS.HERO_STATUS.WALKING;
    } else if (
      this.targetMonster !== undefined &&
      getDistUtil(this, this.targetMonster) > this.attackRange
    ) {
      this.status = CONSTANTS.HERO_STATUS.WALKING;
      this.target.x = this.targetMonster.x;
      this.target.y = this.targetMonster.y;
    } else {
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
      case CONSTANTS.HERO_STATUS.ATTACKING: {
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
      }
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
