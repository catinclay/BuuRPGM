import Status from '../status';

export default class HeroStatus extends Status {
  constructor(args) {
    super(args);
    if (!(args instanceof Status)) {
      this.x = args.x;
      this.y = args.y;
      this.dir = args.dir;
      // Battle variable
      this.moveSpeed = 2;
      this.attackRange = 30;
      this.attackDuration = 60; // 1 sec per attack
      this.atkSpeedAmp = 10;
      this.batk = 5;
      this.fatk = 8;
      this.alive = true;
      this.maxHp = 150;
      this.maxMp = 50;
      this.hp = this.maxHp;
      this.mp = this.maxMp;
      this.armor = 0;
      this.mpgen = 1.5 / 60;
      // Skill
      this.usingSkill = undefined;
      //
      this.targetMonster = undefined;
    }
  }

  setTarget(target) {
    this.targetMonster = target;
  }
}
