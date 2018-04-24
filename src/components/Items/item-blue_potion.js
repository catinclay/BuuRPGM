import Item from '../item';
import ITEMS from '../../itemProfiles';
import CONSTANTS from '../../constants';

export default class BluePotion extends Item {
  constructor(args) {
    super(args);
    this.name = ITEMS.BLUE_POTION.NAME;
    this.itemTargetType = CONSTANTS.ITEM_TARGET_TYPE.SELF;
    this.capacity = 0;
    this.itemIconSprite.texture = this.textures[`item_${this.name}_icon.png`];
    this.itemIconSprite.anchor.set(0.5);
    this.itemIconSprite.on('pointerdown', this.onIconClick.bind(this));
  }

  onIconClick(e) {
    if (!this.owner.alive) {
      return;
    }
    e.stopPropagation();
    this.owner.effects.push(
      this.effectFactory.createEffect({
        sender: this.owner,
        target: this.owner,
        mpRestore: ITEMS.BLUE_POTION.MP_RESTORE,
      })
    );
    this.owner.consumeItem(this.name);
  }

  setOwner(owner) {
    this.owner = owner;
  }

  update() {
    super.update();
  }
}
