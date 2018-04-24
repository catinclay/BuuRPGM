import ITEMS from './itemProfiles';

const SLIME = {
  NAME: 'slime',
  MAXHP: 65,
  BATK: 4,
  FATK: 5,
  ATKDUR: 60,
  ATKRANGE: 30,
  MVSPD: 1,
  ARMOR: 0,
  AGGRORANGE: 130,
  DROP_ITEM_LIST: [
    { item: ITEMS.RED_POTION, prop: 3500 },
    { item: ITEMS.BLUE_POTION, prop: 2500 },
  ],
};

//
const release = {
  SLIME: Object.freeze(SLIME),
};
export default Object.freeze(release);
