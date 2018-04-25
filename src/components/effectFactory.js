import * as PIXI from 'pixi.js';
import Effect from './effect';

export default class EffectFactory {
  constructor(args) {
    // Setup
    Object.assign(this, args);
    this.effectStrings = [];
  }

  createEffect(args) {
    const e = new Effect(args);
    e.popEffectString = this.popEffectString.bind(this);
    return e;
  }

  popEffectString(args) {
    const es = new EffectFactory.EffectString(args, this.upperUiLayer);
    this.container.addChild(es.textSprite);
    this.effectStrings.push(es);
  }

  update(delta) {
    for (let i = this.effectStrings.length - 1; i >= 0; i -= 1) {
      this.effectStrings[i].update(delta);
      if (this.effectStrings[i].existFrame <= 0) {
        this.container.removeChild(this.effectStrings[i].textSprite);
        this.effectStrings.splice(i, 1);
      }
    }
  }
}

EffectFactory.EffectString = class {
  constructor(args, upperUiLayer) {
    this.existFrame = 60;
    this.textSprite = new PIXI.Text(args.text, {
      fontFamily: 'Press Start 2P',
      fontSize: 8,
      fill: args.color,
      align: 'center',
    });
    this.textSprite.displayGroup = upperUiLayer;
    this.textSprite.x = args.x - this.textSprite.width / 2;
    this.textSprite.y = args.y - this.textSprite.height / 2;
  }

  update(delta) {
    this.textSprite.y -= delta / 2;
    this.existFrame -= delta;
  }
};
