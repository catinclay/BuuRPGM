import Status from '../status';
// import Item from '../item';

const items = Symbol('HeroItemStatus: private : Object');
export default class HeroItemStatus extends Status {
  constructor(args) {
    super(args);
    if (!(args instanceof Status)) {
      this[items] = {};
    }
  }

  hasItem(itemName) {
    return itemName in this[items];
  }

  addItem(item, owner, effectFactory) {
    // need to make item an instance of Item
    // if(item instanceof Item){
    if (!this.hasItem(item.NAME)) {
      this[items][item.NAME] = item.GET_OBJ({
        effectFactory,
      });
      this[items][item.NAME].setOwner(owner);
    }
    this[items][item.NAME].charge(1);
    // }
  }

  consume(itemName) {
    if (this.hasItem(itemName)) {
      if (this[items][itemName].consume(1)) {
        this.removeZeroCapacityItem(itemName);
        return true;
      }
    }
    return false;
  }

  removeZeroCapacityItem(itemName) {
    if (this[items][itemName].capacity <= 0) {
      delete this[items][itemName];
    }
  }

  getItems() {
    return this[items];
  }
}
