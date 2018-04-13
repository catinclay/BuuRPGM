import CONSTANTS from './constants';

function getDistUtil(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function goToTargetUtil(o, t, movedis) {
  const dx = t.x - o.x;
  const dy = t.y - o.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) {
    return true;
  }

  if (dist < movedis) {
    o.x = t.x;
    o.y = t.y;
    return true;
  }

  const rx = dx / dist;
  const ry = dy / dist;
  o.x += movedis * rx;
  o.y += movedis * ry;
  return false;
}

function faceToTargetUtil(o, t) {
  const dx = t.x - o.x;
  const dy = t.y - o.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      o.dir = CONSTANTS.DIRECTION.RIGHT;
    } else if (dx < 0) {
      o.dir = CONSTANTS.DIRECTION.LEFT;
    }
  } else if (dy > 0) {
    o.dir = CONSTANTS.DIRECTION.DOWN;
  } else if (dy < 0) {
    o.dir = CONSTANTS.DIRECTION.UP;
  }
}

function getRandomIntUtil(max) {
  return Math.floor(Math.random() * Math.floor(max + 1));
}

export { getDistUtil, goToTargetUtil, faceToTargetUtil, getRandomIntUtil };
