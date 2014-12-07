function Track(game, id, name) {
	this.pawns = [];

	this.id = id;
	this.name = name;

	this.dead = false;
	this.hasBeenDeadFor = 0;

	this.cameraY = this.rows * GRID_SIZE;

	this.won = false;
	this.lost = false;
	this.ready = true;

	this.wins = 0;

	this.game = game;
}

Track.deadImage = getImage("images/disconnected.png");
Track.starImage = getImage("images/star.png");

Track.prototype.playSound = function() {};

Track.prototype.reset = function(trackFactory) {
	if(!(trackFactory instanceof TrackFactory))
		throw new TypeError("What is this? I can't work with this!");

	this.pawns = trackFactory.entities.slice(0);

	this.lanes = trackFactory.lanes;
	this.rows = trackFactory.rows;

	snowman = new Snowman(this);
	snowman.y = this.rows - 1;
	snowman.x = Math.floor((this.lanes - 1)/2);
	snowman.speed = trackFactory.snowmanSpeed;
	this.pawns.push(snowman);

	this.pawns.filter(function(pawn) {
		return pawn instanceof ItemFactory;
	}).forEach(function(factory) {
		var item = factory.constructItem();
		this.pawns.remove(factory);
		this.pawns.add(item);
	}, this);

	this.won = false;
	this.lost = false;
};

Track.BORDER_WIDTH = 2;

Track.prototype.win = function() {
	if(this.won)
		return;
	var snowman = this.getSnowman();
	if(snowman)
		this.pawns.remove(snowman);
	this.playSound("win");
	this.won = true;
	this.wins++;
};

Track.prototype.lose = function() {
	if(this.lost)
		return;
	this.lost = true;
	this.playSound("lose");
};

Track.prototype.lanes = 4;

Track.prototype.rows = 10;

Track.prototype.tick = function(dt) {
	if(this.dead) {
		this.hasBeenDeadFor += dt;
		return;
	}

	this.hasBeenDeadFor = 0;
	for(var i = 0; i < this.pawns.length; i++)
		this.pawns[i].tick(dt);

	this.sortPawns();
};

Track.prototype.sortPawns = function() {
	this.pawns = this.pawns.sortBy(function(p) {return p.y.ceil();});
};

Track.prototype.moveLeft = function() {
	var snowman = this.getSnowman();
	if(snowman)
		snowman.moveLeft();
};

Track.prototype.moveRight = function() {
	var snowman = this.getSnowman();
	if(snowman)
		snowman.moveRight();
};

Track.prototype.getSnowman = function() {
	return this.pawns.filter(function(pawn) {return pawn instanceof Snowman;})[0];
};

Track.prototype.draw = function(ctx, dt) {
	ctx.save();
	var snowman = this.getSnowman();
	if(snowman)
		this.cameraY = snowman.cy + GRID_SIZE * 2 - ctx.canvas.height;

	ctx.translate(0, - this.cameraY);

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

	if(!this.ready)
		this.drawPaused(ctx, dt);

	if(this.dead)
		this.drawDead(ctx, dt);

	this.drawName(ctx, dt);

};

Track.prototype.canMoveOnto = function(x, y) {
	if(x < 0 || x >= this.lanes)
		return false;
	if(y < 0 || y >= this.rows)
		return false;
	return !this.pawns.filter({x: x, y: y, blocksMovement: true}).length;
};

Track.prototype.drawName = function(ctx, dt) {
	var snowman = this.getSnowman();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "16px sans-serif";
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.fillRect(15, ctx.canvas.height - 46, this.width - 30, 30);
	ctx.fillStyle = "rgba(100, 100, 255, 1)";
	if(snowman) {
		var progress = (this.rows - snowman.y) / this.rows;
		ctx.fillRect(15, ctx.canvas.height - 26, progress * (this.width - 30), 10);
	}
	ctx.fillStyle = "black";
	ctx.fillText(this.name, this.width / 2, ctx.canvas.height - 30, this.width - 30);

	if(this.wins) {
//		ctx.fillStyle = "gold";
//		ctx.beginPath();
//		ctx.arc(this.width - 15, ctx.canvas.height - 46, 16, 0, 2 * Math.PI, false);
//		ctx.fill();
		var imageWidth = Track.starImage.width;
		var imageHeight = Track.starImage.height;
		ctx.drawImage(Track.starImage, this.width - 15 - imageWidth/2, ctx.canvas.height - 46 - imageHeight/2);
		ctx.fillText(this.wins, this.width - 15, ctx.canvas.height - 46);
	}
};

Track.prototype.drawDead = function(ctx, dt) {
	ctx.save();
	ctx.globalAlpha = 0.75 + Math.sin(this.hasBeenDeadFor / 1000 * Math.PI * 2)/4;
	ctx.drawImage(Track.deadImage, this.width / 2 - 64, ctx.canvas.height/2 - 64);
	ctx.restore();
};

Track.prototype.drawPaused = function(ctx, dt) {
	ctx.save();
	ctx.fillStyle = "orange";
	ctx.shadowBlur = 20;
	ctx.shadowColor = "black";
	ctx.fillRect(this.width / 2 - 48, ctx.canvas.height/2 - 48, 32, 96);
	ctx.fillRect(this.width / 2 + 16, ctx.canvas.height/2 - 48, 32, 96);
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
