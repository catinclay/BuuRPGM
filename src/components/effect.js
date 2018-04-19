import CONSTANTS from '../constants';

export default class Effect {
  constructor(args) {
    // Setup
    Object.assign(this, args);
  }

  onEffect(target) {
    // Normal Attack
    if (this.damage !== undefined) {
      target.hp -=
        this.damage *
        (CONSTANTS.BATTLE_CONSTANTS.ARMOR_BASE /
          (target.armor + CONSTANTS.BATTLE_CONSTANTS.ARMOR_BASE));
    }

    if (this.heal !== undefined) {
      target.hp = Math.min(target.hp + this.heal, target.maxHp);
    }

    // Aggro
    if (this.aggro === true) {
      target.aggro = true;
    } else if (this.aggro === false) {
      target.aggro = false;
    }
  }
}
