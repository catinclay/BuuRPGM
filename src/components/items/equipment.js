import Item from './item';
import Hero from '../components/hero';
import Monster from '../components/monster';

export default class Equipment extends Item {
  constructor(args) {
    super(args);
    this.user = args.user || null;
  }

  set(user) {
    if (user instanceof Hero || user instanceof Monster) {
      this.user = user;
    }
    return this;
  }

  on(effectCb) {
    if (!this.user) {
      throw Error('EquipItem: user is not set.');
    }
    if (!this.onload) {
      this.onload = true;
      if (effectCb && typeof effectCb === 'function') {
        return effectCb();
      }
    }
    return null;
  }

  off(effectCb) {
    if (!this.onload) {
      throw Error('EquipItem: user is not set.');
    }
    this.onload = false;
    if (effectCb && typeof effectCb === 'function') {
      return effectCb();
    }
    return null;
  }
}
