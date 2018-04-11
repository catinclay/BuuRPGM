const DIRECTION = {
  RIGHT: 'right',
  LEFT: 'left',
  DOWN: 'down',
  UP: 'up',
};
const HERO_STATUS = {
  WALKING: 0,
  ATTACKING: 1,
};

const BATTLE_CONSTANTS = {
  ARMOR_BASE: 100,
};

//
const release = {
  DIRECTION: Object.freeze(DIRECTION),
  HERO_STATUS: Object.freeze(HERO_STATUS),
  BATTLE_CONSTANTS: Object.freeze(BATTLE_CONSTANTS),
};
export default Object.freeze(release);
