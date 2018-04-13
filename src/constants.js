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

const TARGET_MARK_PROP = {
  WIDTH: 32,
  HEIGHT: 32,
};

const BATTLE_CONSTANTS = {
  ARMOR_BASE: 100,
};

//
const release = {
  DIRECTION: Object.freeze(DIRECTION),
  MONSTER_STATUS: Object.freeze(MONSTER_STATUS),
  HERO_STATUS: Object.freeze(HERO_STATUS),
  TARGET_MARK_PROP: Object.freeze(TARGET_MARK_PROP),
  BATTLE_CONSTANTS: Object.freeze(BATTLE_CONSTANTS),
};
export default Object.freeze(release);
