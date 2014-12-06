function TrackFactory(lanes, rows, numObstacles) {
	this.lanes = lanes;
	this.rows = rows;

	this.snowmanSpeed = 1/1000;

	this.entities = [];

	var retries = 0;

	var started = new Date();
	log("Creating a "+lanes+" by "+rows+" level with "+numObstacles+" obstacles");

	while(this.entities.length < numObstacles && retries < 10) {
		var newObstacle = this.makeObstacle();
		if(
			this.entities.any({x: newObstacle.x, y: newObstacle.y})
			|| this.levelIsNotPlayable(this.entities.concat(newObstacle))) {
			retries++;
		}
		else {
			this.entities.push(newObstacle);
			retries = 0;
		}
	}

	if(this.entities.length < numObstacles) {
		var skipped = numObstacles - this.entities.length;
		log("Warning: failed to place "+skipped+" obstacles");
	}

	var duration = new Date() - started;
	log("Level created in "+duration/1000+" ms");
}

TrackFactory.prototype.levelIsNotPlayable = function(obstacles) {
	return !this.findPathToFinish(obstacles);
};

TrackFactory.prototype.findPathToFinish = function(obstacles) {
	var open = [{x: 0, y: this.rows - 1, parent: null}];
	var closed = [];

	var self = this;

	while(open.length) {
		var thisNode = open.min('y');
		open.removeAt(open.indexOf(thisNode));

		var successors = getSuccessors(thisNode);
		closed.push(thisNode);

		for(var i = 0; i < successors.length; i++) {
			var s = successors[i];
			if(s.y === 0)
				return s;
			if(!open.concat(closed).any({x: s.x, y: s.y}))
				open.push(s);
		}
	}

	function nodeCost(node) {
		return node.y;
	}

	function getSuccessors(node) {
		var successors = [];
		if(positionIsFree(node.x, node.y - 1))
			successors.push({ x: node.x, y: node.y - 1, parent:node });

		if(positionIsFree(node.x - 1, node.y))
			successors.push({ x: node.x - 1, y: node.y, parent:node });

		if(positionIsFree(node.x + 1, node.y))
			successors.push({ x: node.x + 1, y: node.y, parent:node });

		return successors;
	}

	function positionIsFree(x, y) {
		if(x < 0 || x >= self.lanes)
			return false;
		if(y < 0)
			return false;
		return !obstacles.any({x: x, y: y});
	}

	return null;
};

TrackFactory.prototype.makeObstacle = function() {
	//TODO: weight these based on distance or something?
	
	var obstacle = new ([Rock].sample());
	obstacle.x = Math.floor(Math.random() * this.lanes);
	//don't put obstacles in the bottom row
	obstacle.y = Math.floor(Math.random() * (this.rows - 2));

	return obstacle;
};
