function TrackFactory(lanes, rows, numObstacles) {
	this.lanes = lanes;
	this.rows = rows;

	this.snowmanSpeed = 1/1000;

	this.entities = [];

	var retries = 0;

	var started = new Date();

	while(this.entities.length < numObstacles && retries < 20) {
		var newObstacle = this.makeObstacle();
		if( this.entities.any({x: newObstacle.x, y: newObstacle.y}) ||
			this.levelIsNotPlayable(this.entities.concat(newObstacle)) ) {
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

window.lastPath = null;
TrackFactory.prototype.levelIsNotPlayable = function(obstacles) {
	lastPath = findPathToFinish(obstacles, {x: 0, y: this.rows - 1}, this.lanes);
	return !lastPath;
};

(function() {
	var weightedItemsCollection = [];
	var i;
	for(i = 0; i < 10; i++)
		weightedItemsCollection.push(Rock);

	for(i = 0; i < 5; i++)
		weightedItemsCollection.push(Grass);
	
	for(i = 0; i < 1; i++)
		weightedItemsCollection.push(IcePowerup);

	for(i = 0; i < 1; i++)
		weightedItemsCollection.push(CarrotPowerup);

	TrackFactory.prototype.makeObstacle = function() {
		
		var obstacle = new (weightedItemsCollection.sample());
		obstacle.x = Math.floor(Math.random() * this.lanes);
		//don't put obstacles in the bottom row
		obstacle.y = Math.floor(Math.random() * (this.rows - 2));

		return obstacle;
	};
})();
