import RedPotion from './components/Items/item-red_potion';
import BluePotion from './components/Items/item-blue_potion';

const RED_POTION = {
  NAME: 'red_potion',
  HEAL: 30,
  GET_OBJ(args) {
    return new RedPotion(args);
  },
};

const BLUE_POTION = {
  NAME: 'blue_potion',
  MP_RESTORE: 20,
  GET_OBJ(args) {
    return new BluePotion(args);
  },
};

//
const release = {
  RED_POTION: Object.freeze(RED_POTION),
  BLUE_POTION: Object.freeze(BLUE_POTION),
};
export default Object.freeze(release);
