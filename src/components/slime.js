import * as PIXI from 'pixi.js';
import CONSTANTS from '../constants';
import Monster from './monster';

export default class Slime extends Monster {
  constructor(args) {
    super(args);
    // Setup
    this.jumpCounter = 0;
    this.nowJump = 0;
    this.textures = PIXI.loader.resources['assets/images/slime.json'].textures;
    this.monsterName = CONSTANTS.MONSTER_NAME.SLIME;
  }

  update(delta) {
    this.jumpCounter += delta;
    if (this.jumpCounter >= 20) {
      this.jumpCounter -= 20;
      this.nowJump = this.nowJump === 0 ? 1 : 0;
    }
    this.updateImage();
  }

  updateImage() {
    this.sprite.texture = this.textures[
      `${CONSTANTS.MONSTER_NAME.SLIME}_face_${this.dir}_${this.nowJump}.png`
    ];
    this.sprite.x = this.x - this.sprite.width / 2;
    this.sprite.y = this.y - this.sprite.height / 2;
  }
}
