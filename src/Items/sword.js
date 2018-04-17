import Equipment from './equipment';

export default class Sword extends Equipment {
  constructor(args) {
    super(args);
    //
    this.maxHp = 50;
    this.batk = 6;
    this.fatk = 6;
    this.attackDuration = 90;
    this.attackRange = 30;
    this.moveSpeed = 1;
    this.armor = 0;
  }

  on(cb) {
    super.on(() => {
      Object.keys(this).forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(this.user, prop)) {
          this.user[prop] += this.prop;
        }
      });
      return true;
    });
    if (cb && typeof cb === 'function') {
      return cb(this);
    }
    return null;
  }

  off(cb) {
    super.off(() => {
      Object.keys(this).forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(this.user, prop)) {
          this.user[prop] -= this.prop;
        }
      });
      return true;
    });
    if (cb && typeof cb === 'function') {
      return cb(this);
    }
    return null;
  }
}
