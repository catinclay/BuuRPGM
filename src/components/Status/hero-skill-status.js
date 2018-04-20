import State from '../status';

export default class HeroSkillStatus extends Status {
	constructor(args){
		super(args);
	    this.usingSkill = null;
	}

	filter(state, previous)
}