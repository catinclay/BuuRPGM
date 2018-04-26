import Status from '../status';
import Effect from '../effect';

const effects = Symbol('private : Array');
export default class HeroEffectStatus extends Status {
  constructor(args) {
    super();
    this[effects] = [];
    if (Array.isArray(args)) {
      args.forEach(e => {
        if (e instanceof Effect) {
          this.push(e);
        }
      });
    }
  }

  forEach(cb) {
    if (typeof cb === 'function') {
      this[effects].forEach(e => cb(e));
    }
  }

  push(effect) {
    this[effects].push(effect);
  }

  reset() {
    this[effects] = [];
  }
}
