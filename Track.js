function Track(id, name) {
	this.pawns = [];

	this.id = id;
	this.name = name;

	this.snowman = new Snowman(this);
	this.snowman.y = this.rows - 1;
	this.snowman.x = Math.floor((this.lanes - 1)/2);
	this.pawns.push(this.snowman);

	this.dead = false;
	this.hasBeenDeadFor = 0;
}

Track.BORDER_WIDTH = 2;

Track.prototype.lanes = 4;

Track.prototype.rows = 100;

Track.prototype.tick = function(dt) {
	if(this.dead)
		this.hasBeenDeadFor += dt;
	else {
		this.hasBeenDeadFor = 0;
		for(var i = 0; i < this.pawns.length; i++)
			this.pawns[i].tick(dt);
	}
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

	if(this.dead) {
		ctx.globalAlpha = 0.25 + Math.sin(this.hasBeenDeadFor / 1000 * Math.PI * 2)/4;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, this.width, this.height);
	}
	ctx.restore();

	this.drawName(ctx, dt);
};

Track.prototype.drawName = function(ctx, dt) {
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "16px sans-serif";
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.fillRect(15, ctx.canvas.height - 46, this.width - 30, 30);
	ctx.fillStyle = "black";
	ctx.fillText(this.name, this.width / 2, ctx.canvas.height - 30, this.width - 30);
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
