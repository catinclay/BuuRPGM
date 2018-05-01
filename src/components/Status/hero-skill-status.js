import Status from '../status';
import Skill from '../skill';

const skills = Symbol('private : Object');
export default class HeroSkillStatus extends Status {
  constructor(args) {
    super(args);
    if (!(args instanceof Status)) {
      this[skills] = {};
      if (args.defaultSkills && Array.isArray(args.defaultSkills)) {
        args.defaultSkills.forEach(item => {
          this.addSkill(item.id, item.skill);
        });
      }
    }
  }

  addSkill(id, skill) {
    if (typeof id === 'string' && skill instanceof Skill) {
      this[skills][id] = skill;
    }
  }

  getSkills() {
    return this[skills];
  }
}
