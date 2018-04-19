import ITEMS from './itemProfiles';

const SLIME = {
  NAME: 'slime',
  MAXHP: 65,
  BATK: 6,
  FATK: 10,
  ATKDUR: 80,
  ATKRANGE: 30,
  MVSPD: 1,
  ARMOR: 0,
  AGGRORANGE: 130,
  DROP_ITEM_LIST: [{ item: ITEMS.RED_POTION, prop: 10000 }],
};
//
const release = {
  SLIME: Object.freeze(SLIME),
};
export default Object.freeze(release);
