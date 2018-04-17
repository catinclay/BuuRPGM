import Item from './item';
import Hero from '../components/hero';
import Monster from '../components/monster';

export default class Scroll extends Item {
  constructor(args) {
    super(args);
    this.remain = args.remain || 3;
    this.caster = null;
  }

  from(caster) {
    if (caster instanceof Hero || caster instanceof Monster) {
      this.caster = caster;
    }
    return this;
  }

  to(target) {
    if (target instanceof Hero || target instanceof Monster) {
      this.target = target;
    }
    return this;
  }

  cast(effectCb) {
    if (!this.caster) {
      throw Error('CastableItem: caster is not set.');
    }
    if (!this.target) {
      throw Error('CastableItem: target is not set.');
    }
    if (!this.onload) {
      throw Error('CastableItem: item is not onload.');
    }
    if (this.remain) {
      if (effectCb && typeof effectCb === 'function') {
        this.remain -= 1;
        return effectCb();
      }
    }
    return null;
  }
}
