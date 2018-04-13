import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';
import Effect from './effect';
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
    this.sprite = new PIXI.Sprite(
      PIXI.loader.resources['assets/images/link.json'].textures[
        `link_face_${this.dir}_0.png`
      ]
    );
    this.sprite.anchor.set(0.5, 0.8);
    this.sprite.interactive = false;
    this.goToTargetMarkSprite = new PIXI.Sprite(
      PIXI.loader.resources['assets/images/control_unit.json'].textures[
        `go_to_target_mark.png`
      ]
    );
    this.goToTargetMarkSprite.visible = false;
    this.goToTargetMarkSprite.anchor.set(0.5);
    this.clickTargetMarkSprite = new PIXI.Sprite(
      PIXI.loader.resources['assets/images/control_unit.json'].textures[
        `click_target_mark.png`
      ]
    );
    this.clickTargetMarkSprite.visible = false;
    this.clickTargetMarkSprite.anchor.set(0.5);
    this.clickTargetMarkSprite.interactive = true;
    this.container = new PIXI.Container();
    this.container.interactive = false;

    this.stepCounter = 0;
    this.nowStepFrame = 0;
    this.target = { x: this.x, y: this.y };
    this.moveSpeed = 2;
    this.attackRange = 30;
    this.status = CONSTANTS.HERO_STATUS.WALKING;
    this.nowAttackFrame = 0;
    this.nowAttackTiming = 0;

    // Battle variable
    this.attackDuration = 60; // 1 sec per attack
    this.batk = 5;
    this.fatk = 8;
    this.alive = true;
    this.effects = [];
    this.maxHp = 150;
    this.hp = this.maxHp;
    this.armor = 0;
  }

  addToContainer(container) {
    this.container.addChild(this.goToTargetMarkSprite);
    this.container.addChild(this.clickTargetMarkSprite);
    this.container.addChild(this.sprite);
    container.addChild(this.container);
  }

  setLayer(bottomUiLayer, battleLayer, upperUiLayer) {
    this.goToTargetMarkSprite.displayGroup = battleLayer;
    this.sprite.displayGroup = battleLayer;
    this.clickTargetMarkSprite.displayGroup = upperUiLayer;
  }

  onClickGround(args) {
    this.target.x = args.x;
    this.target.y = args.y;
    this.targetMonster = undefined;
    this.status = CONSTANTS.HERO_STATUS.WALKING;
  }

  taretMarkOnMouseClick(e) {
    this.targetMonster.onMouseClick(e);
  }

  goToTarget(delta) {
    // Reset attack timer.
    this.nowAttackTiming = 0;

    this.stepCounter += delta;
    if (this.stepCounter >= 10) {
      this.stepCounter -= 10;
      this.nowStepFrame = this.nowStepFrame === 0 ? 1 : 0;
    }

    if (
      goToTargetUtil(this, this.target, this.moveSpeed * delta) ||
      this.targetMonster !== undefined
    ) {
      this.goToTargetMarkSprite.visible = false;
    } else {
      this.goToTargetMarkSprite.visible = true;
    }

    faceToTargetUtil(this, this.target);
  }

  attackMonster(delta) {
    if (!this.targetMonster.alive) {
      this.targetMonster = undefined;
      this.target.x = this.x;
      this.target.y = this.y;
      return;
    }
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
      this.sprite.x = this.x;
      this.sprite.y = this.y;
      this.sprite.anchor.set(0.5, 0.8);
    }
  }

  updateTargetMark() {
    if (this.targetMonster !== undefined) {
      this.clickTargetMarkSprite.x = this.targetMonster.sprite.x;
      this.clickTargetMarkSprite.y = this.targetMonster.sprite.y;
      this.clickTargetMarkSprite.scale.x =
        this.targetMonster.sprite.width / CONSTANTS.TARGET_MARK_PROP.WIDTH;
      this.clickTargetMarkSprite.scale.y =
        this.targetMonster.sprite.height /
        CONSTANTS.TARGET_MARK_PROP.HEIGHT *
        0.8;
      this.clickTargetMarkSprite.on(
        'pointerdown',
        this.taretMarkOnMouseClick.bind(this)
      );
      this.clickTargetMarkSprite.visible = true;
    } else {
      this.clickTargetMarkSprite.visible = false;
    }
  }

  update(delta) {
    this.calculateEffects();
    this.checkAlive();
    if (!this.alive) {
      this.updateTargetMark();
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
          this.sprite.anchor.set(0.5, 0.8);
          // this.sprite.x = this.x;
          // this.sprite.y = this.y;
        } else if (this.dir === CONSTANTS.DIRECTION.DOWN) {
          this.sprite.anchor.set(0.5, 0.4);
          // this.sprite.x = this.x;
          // this.sprite.y = this.y + this.sprite.height / 4;
        } else if (this.dir === CONSTANTS.DIRECTION.LEFT) {
          this.sprite.anchor.set(0.75, 0.8);
          // this.sprite.x = this.x - this.sprite.width / 4;
          // this.sprite.y = this.y;
        } else if (this.dir === CONSTANTS.DIRECTION.UP) {
          this.sprite.anchor.set(0.5, 0.9);
          // this.sprite.x = this.x;
          // this.sprite.y = this.y - this.sprite.height / 4 ;
        } else if (this.dir === CONSTANTS.DIRECTION.RIGHT) {
          this.sprite.anchor.set(0.25, 0.8);
          // this.sprite.x = this.x + this.sprite.width / 4;
          // this.sprite.y = this.y;
        }
        break;
      }
      case CONSTANTS.HERO_STATUS.WALKING:
      default:
        this.sprite.texture = this.textures[
          `link_face_${this.dir}_${this.nowStepFrame}.png`
        ];
        this.sprite.anchor.set(0.5, 0.8);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.goToTargetMarkSprite.x = this.target.x;
        this.goToTargetMarkSprite.y = this.target.y;
        break;
    }
    this.updateTargetMark();

    this.sprite.zOrder = -this.sprite.y - this.sprite.height / 2;
  }
}
