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

const MONSTER_NAME = {
  SLIME: 'slime',
};

//
const release = {
  DIRECTION: Object.freeze(DIRECTION),
  HERO_STATUS: Object.freeze(HERO_STATUS),
  MONSTER_NAME: Object.freeze(MONSTER_NAME),
};
export default Object.freeze(release);
