function isNumeric(val){
	return val && typeof val === 'number';
}
function Item(proto){

	function _Item(){
		this.onload = false;
	}

	_Item.prototype = Object.create(proto);

	_Item.prototype.constructor = _Item;

	_Item.prototype.on = function(target){
		if(!this.onload){
			for(var prop in target){
				if(target.hasOwnProperty(prop) && isNumeric(target[prop])){
					target[prop] += _Item[prop];
				}
			}
			this.onload = true;
		}
		
	};

	_Item.prototype.off = function(target){
		if(this.onload){
			for(var prop in target){
				if(target.hasOwnProperty(prop) && isNumeric(target[prop])){
					target[prop] -= _Item[prop];
				}
			}
			this.onload = false;
		}
	};

	_Item.prototype.use = function(sender, target, canUseCallback){
		if(!canUseCallback || typeof canUseCallback !== 'function'){
			canUseCallback = function(){return true;};
		}
		let canUse = canUseCallback(this) && this.remain;
		let canExec = this.exec && typeof this.exec === 'function';
		if(this.onload && canUse && canExec){
			this.exec(target);
			this.remain--;
		}
	};

	return new _Item();
}


export default Item;