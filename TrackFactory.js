function TrackFactory(lanes, rows, numObstacles) {
	this.lanes = lanes;
	this.rows = rows;

	this.snowmanSpeed = 1/1000;

	this.entities = [];

	var retries = 0;

	var started = new Date();

	while(this.entities.length < numObstacles && retries < 20) {
		var newObstacles = this.makeObstacles(Math.min(10, numObstacles - this.entities.length));

		var potentiallyAllObstacles = this.entities.concat(newObstacles);

		if( this.entitiesAreOverlapping(potentiallyAllObstacles) ||
			this.levelIsNotPlayable(potentiallyAllObstacles) ) {
			retries++;
		}
		else {
			this.entities.add(newObstacles);
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
	return !findPathToFinish(obstacles, {x: 0, y: this.rows - 1}, this.lanes);
};

TrackFactory.prototype.entitiesAreOverlapping = function(obstacles) {
	for(var i = 1; i < obstacles.length; i++) {
		for(var j = 0; j < i; j++) {
			if(obstacles[i].x == obstacles[j].x && obstacles[i].y == obstacles[j].y)
				return true;
		}
	}
	return false;
};

(function() {
	var weightedItemsCollection = [];
	var i;
	for(i = 0; i < 5; i++)
		weightedItemsCollection.push(Rock);
	
	for(i = 0; i < 1; i++)
		weightedItemsCollection.push(ItemFactory);

	TrackFactory.prototype.makeObstacles = function(numObstacles) {
		var output = [];
		for(var i = 0; i < numObstacles; i++) {
			var obstacle = new (weightedItemsCollection.sample());
			obstacle.x = Math.floor(Math.random() * this.lanes);
			//don't put obstacles in the bottom row
			obstacle.y = Math.floor(Math.random() * (this.rows - 2));
		}

		return obstacle;
	};
})();
