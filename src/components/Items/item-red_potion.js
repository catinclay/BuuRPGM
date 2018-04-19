// import * as PIXI from 'pixi.js';
import Item from '../item';
import ITEMS from '../../itemProfiles';
import CONSTANTS from '../../constants';
import Effect from '../effect';

export default class RedPotion extends Item {
  constructor(args) {
    super(args);
    this.name = ITEMS.RED_POTION.NAME;
    this.itemTargetType = CONSTANTS.ITEM_TARGET_TYPE.SELF;
    this.capacity = 0;
  }

  charge(number) {
    this.capacity += number;
  }

  isValid() {
    return this.capacity > 0;
  }

  onUse(user) {
    user.effects.push(
      new Effect({
        target: user,
        heal: ITEMS.RED_POTION.HEAL,
      })
    );
    this.capacity -= 1;
  }
}
