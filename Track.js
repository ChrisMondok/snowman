function Track(id) {
	this.pawns = [];

	this.id = id;

	this.snowman = new Snowman(this);
	this.snowman.y = this.rows - 1;
	this.snowman.x = Math.floor((this.lanes - 1)/2);
	this.pawns.push(this.snowman);
}

Track.BORDER_WIDTH = 2;

Track.prototype.lanes = 4;

Track.prototype.rows = 100;

Track.prototype.tick = function(dt) {
	for(var i = 0; i < this.pawns.length; i++)
		this.pawns[i].tick(dt);
};

Track.prototype.draw = function(ctx, dt) {
	ctx.save();
	var cameraY = this.snowman.cy + GRID_SIZE * 2 - ctx.canvas.height;

	ctx.translate(0, - cameraY);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.fillStyle = "white";
	ctx.fillRect(Track.BORDER_WIDTH, Track.BORDER_WIDTH, this.width - 2 * Track.BORDER_WIDTH, this.height - 2 * Track.BORDER_WIDTH);

	ctx.save();
	ctx.translate(Track.BORDER_WIDTH, Track.BORDER_WIDTH);
	this.drawLanes(ctx, dt);
	for(var i = 0; i < this.pawns.length; i++)
		this.pawns[i].draw(ctx, dt);
	ctx.restore();
	ctx.restore();
};

Track.prototype.drawLanes = function(ctx, dt) {
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";

	for(var x = 1; x < this.lanes; x++) {
		ctx.moveTo(x * GRID_SIZE, 0);
		ctx.lineTo(x * GRID_SIZE, this.rows * GRID_SIZE);
	}

	//TODO: hide off-screen rows?
	for(var y = 1; y < this.rows; y++) {
		ctx.moveTo(0, y * GRID_SIZE);
		ctx.lineTo(this.lanes * GRID_SIZE, y * GRID_SIZE);
	}
	
	ctx.stroke();
};

Object.defineProperty(Track.prototype, "width", {
	get: function() { return this.lanes * GRID_SIZE + 2 * Track.BORDER_WIDTH; }
});

Object.defineProperty(Track.prototype, "height", {
	get: function() { return this.rows * GRID_SIZE + 2 * Track.BORDER_WIDTH; }
});
