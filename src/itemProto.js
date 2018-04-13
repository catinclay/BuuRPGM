const SWORD = {
  maxHp: 50,
  batk: 6,
  fatk: 6,
  attackDuration: 90,
  attackRange: 30,
  moveSpeed: 1,
  armor: 0,
  exec: null
};
const BOMB = {
  exec: function(target){
  	if(target.hp){
  		target.hp -= 50;
  	}
  },
  remain: 5
};
//
const release = {
  SWORD: Object.freeze(SWORD),
  BOMB: Object.freeze(BOMB),
};
export default Object.freeze(release);