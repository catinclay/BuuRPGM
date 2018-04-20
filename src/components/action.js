export default class Action {
	constructor(args) {
		this.delta = null;
  	}
  	
  	filter(action, previousStatus){
  		return previousStatus;
  	}

}