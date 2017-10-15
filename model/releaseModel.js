var daoModel = function(model){
	
	this.model = model;
	
	this.insert = function(data){

	}

	this.update = function(data, newData){

	}

	this.delete = function(data){

	}

	this.select = function(){
		return Lockr.get(model.name);
	}
}