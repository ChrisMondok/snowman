function TrackFactory(lanes, rows, numObstacles) {
	this.lanes = lanes;
	this.rows = rows;

	this.snowmanSpeed = 1/1000;

	this.entities = [];

	var retries = 0;

	while(this.entities.length < numObstacles && retries < 100) {
		var newObstacle = this.makeObstacle();
		if(this.entities.any({x: newObstacle.x, y: newObstacle}))
			retries++;
		else
			this.entities.push(newObstacle);
	}

	if(retries >= 100)
		log("Warning: failed to place some obstacles");
}

TrackFactory.prototype.makeObstacle = function() {
	//TODO: weight these based on distance or something?
	
	var obstacle = new ([Rock].sample());
	obstacle.x = Math.floor(Math.random() * this.lanes);
	obstacle.y = Math.floor(Math.random() * (this.rows - 2));

	return obstacle;
};
