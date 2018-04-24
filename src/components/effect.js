import CONSTANTS from '../constants';

export default class Effect {
  constructor(args) {
    // Setup
    Object.assign(this, args);
  }

  onEffect(target) {
    // Normal Attack
    if (this.damage !== undefined) {
      const actualDamage =
        this.damage *
        (CONSTANTS.BATTLE_CONSTANTS.ARMOR_BASE /
          (target.armor + CONSTANTS.BATTLE_CONSTANTS.ARMOR_BASE));
      target.hp -= actualDamage;
      const color = this.color === undefined ? 0x993333 : this.color;
      this.popEffectString({
        text: actualDamage,
        x: target.x,
        y: target.y,
        color,
      });
    }

    if (this.heal !== undefined) {
      const actualHeal = Math.min(this.heal, target.maxHp - target.hp);
      target.hp += actualHeal;
      this.popEffectString({
        text: Math.floor(actualHeal),
        x: target.x,
        y: target.y,
        color: '0x33DD33',
      });
    }

    if (this.mpRestore !== undefined) {
      const actualMpRestore = Math.min(
        this.mpRestore,
        target.maxMp - target.mp
      );
      target.mp += actualMpRestore;
      this.popEffectString({
        text: Math.floor(actualMpRestore),
        x: target.x,
        y: target.y,
        color: '0x333399',
      });
    }

    // Aggro
    if (this.aggro === true) {
      target.aggro = true;
    } else if (this.aggro === false) {
      target.aggro = false;
    }
  }
}
