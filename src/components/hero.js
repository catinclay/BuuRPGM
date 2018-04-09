import * as PIXI from 'pixi.js';

export default class Hero {
  constructor(args) {
    // Static util
    this.dirmap = ['down', 'left', 'up', 'right'];

    // Setup
    this.x = args.x;
    this.y = args.y;
    this.dir = args.dir;
    this.textures = args.textures;
    this.sprite = new PIXI.Sprite(
      this.textures[`link_face_${this.dirmap[this.dir]}_0.png`]
    );
    this.stepCounter = 0;
    this.nowStep = 0;
    this.updateImage();
    this.target = { x: this.x, y: this.y };
    this.speed = 2;
  }

  setTarget(args) {
    this.target.x = args.x;
    this.target.y = args.y;
  }

  goToTarget() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    if (dx > 1) {
      this.dir = 3; // right
      this.x += this.speed;
    } else if (dx < -1) {
      this.dir = 1; // left
      this.x -= this.speed;
    } else if (dy > 1) {
      this.dir = 0; // down
      this.y += this.speed;
    } else if (dy < -1) {
      this.dir = 2; // up
      this.y -= this.speed;
    }
  }

  update(delta) {
    this.goToTarget();
    this.stepCounter += delta;
    if (this.stepCounter >= 10) {
      this.stepCounter = 0;
      this.nowStep = this.nowStep === 0 ? 1 : 0;
    }
    this.updateImage();
  }

  updateImage() {
    this.sprite.texture = this.textures[
      `link_face_${this.dirmap[this.dir]}_${this.nowStep}.png`
    ];
    this.sprite.x = this.x - this.sprite.width / 2;
    this.sprite.y = this.y - this.sprite.height / 2;
  }
}
