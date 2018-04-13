const DIRECTION = {
  RIGHT: 'right',
  LEFT: 'left',
  DOWN: 'down',
  UP: 'up',
};

const MONSTER_STATUS = {
  WALKING: 0,
  ATTACKING: 1,
};

const HERO_STATUS = {
  WALKING: 0,
  ATTACKING: 1,
};

const BATTLE_CONSTANTS = {
  ARMOR_BASE: 100,
};

const MAX_ITEM_NUM = 6;
//
const release = {
  DIRECTION: Object.freeze(DIRECTION),
  MONSTER_STATUS: Object.freeze(MONSTER_STATUS),
  HERO_STATUS: Object.freeze(HERO_STATUS),
  BATTLE_CONSTANTS: Object.freeze(BATTLE_CONSTANTS),
  MAX_ITEM_NUM : MAX_ITEM_NUM,
};
export default Object.freeze(release);
