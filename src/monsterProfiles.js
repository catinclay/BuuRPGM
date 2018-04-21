import ITEMS from './itemProfiles';

const SLIME = {
  NAME: 'slime',
  MAXHP: 65,
  BATK: 2,
  FATK: 5,
  ATKDUR: 45,
  ATKRANGE: 30,
  MVSPD: 1,
  ARMOR: 0,
  AGGRORANGE: 130,
  DROP_ITEM_LIST: [
    { item: ITEMS.RED_POTION, prop: 3500 },
    { item: ITEMS.BLUE_POTION, prop: 2000 },
  ],
};

//
const release = {
  SLIME: Object.freeze(SLIME),
};
export default Object.freeze(release);
