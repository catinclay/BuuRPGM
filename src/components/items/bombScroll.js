import Scroll from './scroll';

export default class BombScroll extends Scroll {
  constructor(args) {
    super(args);
    //
    this.damage = 50;
  }

  cast(beforeCb, afterCb) {
    if (beforeCb && typeof beforeCb === 'function') {
      beforeCb(this.caster, this.target, this);
    }

    super.cast(() => {
      this.target.Hp -= this.damage;
      return true;
    });

    if (afterCb && typeof afterCb === 'function') {
      afterCb(this.caster, this.target, this);
    }
    return null;
  }
}
