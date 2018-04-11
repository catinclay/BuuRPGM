import * as PIXI from 'pixi.js';
import Monster from './monster';
import MONSTER_PROFILES from '../monsterProfiles';

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
    this.hp = this.maxHp;
    this.alive = true;
  }

  update(delta) {
    for (let i = 0; i < this.effects.length; i += 1) {
      this.effects[i].onEffect(this);
      this.isShowingHp = true;
    }
    this.effects = [];
    if (this.hp <= 0) {
      this.alive = false;
      this.isShowingHp = false;
      super.destructor();
      return;
    }
    this.jumpCounter += delta;
    if (this.jumpCounter >= 20) {
      this.jumpCounter -= 20;
      this.nowJump = this.nowJump === 0 ? 1 : 0;
    }
    if (this.isShowingHp) {
      super.updateHp();
    }
    this.updateImage();
  }

  updateImage() {
    this.sprite.texture = this.textures[
      `${this.monsterName}_face_${this.dir}_${this.nowJump}.png`
    ];
    this.sprite.x = this.x - this.sprite.width / 2;
    this.sprite.y = this.y - this.sprite.height / 2;
  }
}
