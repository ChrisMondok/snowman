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

window.lastPath = null;
TrackFactory.prototype.levelIsNotPlayable = function(obstacles) {
	lastPath = findPathToFinish(obstacles, {x: 0, y: this.rows - 1}, this.lanes);
	return !lastPath;
};

TrackFactory.prototype.makeObstacle = function() {
	//TODO: weight these based on distance or something?
	
	var obstacle = new ([Rock].sample());
	obstacle.x = Math.floor(Math.random() * this.lanes);
	//don't put obstacles in the bottom row
	obstacle.y = Math.floor(Math.random() * (this.rows - 2));

	return obstacle;
};
