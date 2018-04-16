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
  SKILLING: 2,
};

const TARGET_MARK_PROP = {
  WIDTH: 32,
  HEIGHT: 32,
};

const BATTLE_CONSTANTS = {
  ARMOR_BASE: 100,
};

const SKILL_TARGET_TYPE = {
  SELF: 0,
  SINGLE: 1,
  AREA: 2,
};

const SKILL_CHECK_RESULT_TYPE = {
  SUCCESS: 0,
  OOM: 1,
  OOR: 2,
  OOT: 3,
  IN_COOL: 4,
};

//
const release = {
  DIRECTION: Object.freeze(DIRECTION),
  MONSTER_STATUS: Object.freeze(MONSTER_STATUS),
  HERO_STATUS: Object.freeze(HERO_STATUS),
  TARGET_MARK_PROP: Object.freeze(TARGET_MARK_PROP),
  BATTLE_CONSTANTS: Object.freeze(BATTLE_CONSTANTS),
  SKILL_TARGET_TYPE: Object.freeze(SKILL_TARGET_TYPE),
};
export default Object.freeze(release);


