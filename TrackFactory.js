function TrackFactory(lanes, rows, numObstacles) {
	this.lanes = lanes;
	this.rows = rows;

	this.snowmanSpeed = 1/1000;

	this.entities = [];

	var retries = 0;

	var started = new Date();

	var solution = this.getSolution();

	while(this.entities.length < numObstacles && retries < 20) {
		var newObstacle = this.makeObstacle();

		var nope = this.entities.any({x: newObstacle.x, y: newObstacle.y});

		if( !nope &&
			newObstacle instanceof Rock &&
			newObstacleIsInSolution(newObstacle)) {
				var newSolution = this.getSolution(newObstacle);
				if(!newSolution)
					nope = true;
				else
					solution = newSolution;
		}

		if(nope)
			retries++;
		else {
			retries = 0;
			this.entities.push(newObstacle);
		}
	}

	if(this.entities.length < numObstacles) {
		var skipped = numObstacles - this.entities.length;
		log("Warning: failed to place "+skipped+" obstacles");
	}

	var duration = new Date() - started;
	log("Level created in "+duration/1000+" ms");

	function newObstacleIsInSolution(newObstacle) {
		var node = solution;
		while(node) {
			if(node.x == newObstacle.x && node.y == newObstacle.y)
				return true;
			node = node.parent;
		}
		return false;
	}
}

TrackFactory.prototype.getSolution = function(newObstacle) {
	var o = this.entities;
	if(newObstacle)
		o = o.concat(newObstacle);
	return findPathToFinish(this.entities.concat(newObstacle), {x: 0, y: this.rows - 1}, this.lanes);
};

(function() {
	var weightedItemsCollection = [];
	var i;
	for(i = 0; i < 5; i++)
		weightedItemsCollection.push(Rock);
	
	for(i = 0; i < 1; i++)
		weightedItemsCollection.push(ItemFactory);

	TrackFactory.prototype.makeObstacle = function() {
		
		var obstacle = new (weightedItemsCollection.sample());
		obstacle.x = Math.floor(Math.random() * this.lanes);
		//don't put obstacles in the bottom row
		obstacle.y = Math.floor(Math.random() * (this.rows - 2));

		return obstacle;
	};
})();
