var Snowman = extend(Pawn, function Snowman(track){
	this.track = track;

	window.snowman = this;
});

Snowman.MAX_SPEED = 0.002;

Snowman.prototype.speed = 1/1000;
Snowman.prototype.acceleration = 0.0001;

Snowman.prototype.tick = function(dt) {
	Pawn.prototype.tick.apply(this, arguments);

	var lastY = this.y;

	this.y -= this.speed * dt;

	if(!this.track.canMoveOnto(this.x, this.y.floor())) {
		this.y = (this.y).floor() + 1;
		this.speed = Snowman.prototype.speed;
	}

	//TODO: win
	if(this.y === 0)
		this.y = this.track.rows - 1;
	
	this.speed = Math.min(Snowman.MAX_SPEED, this.speed + this.acceleration * dt / 1000);

	if(this.y.floor() != lastY.floor())
		this.track.playSound("step");
};

Snowman.prototype.size = GRID_SIZE * (3/5);

Snowman.prototype.moveLeft = function() {
	if(this.track.canMoveOnto(this.x - 1, this.y.round()))
		this.x--;
};

Snowman.prototype.moveRight = function() {
	if(this.track.canMoveOnto(this.x + 1, this.y.round()))
		this.x++;
};

Snowman.prototype.draw = function(ctx, dt) {
	ctx.strokeStyle = "black";
	
	ctx.fillStyle = "white";

	var animPhase = this.getAnimationPhase();

	var y = (this.y.ceil() - easing.quadraticInOut(0, 1, animPhase) + 0.5) * GRID_SIZE;
	
	var z = easing.quadraticInOut(0, 1, Math.sin(animPhase * Math.PI));

	var baseRadius = this.size/2;
	var middleRadius = baseRadius * 0.8;
	var topRadius = middleRadius * 0.8;

	var baseY = y - z * GRID_SIZE/4;
	var middleY = baseY - baseRadius - z * middleRadius/2;
	var topY = middleY - middleRadius - z * topRadius/2;

	var armLength = middleRadius * 0.8;

	var shadowColor = "rgba(0, 0, 0, 0.5)";

	ctx.fillStyle = shadowColor;
	ctx.beginPath();
	ctx.arc(this.cx, y, this.size/2, 0, 2 * Math.PI, false);
	ctx.fill();

	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";

	ctx.beginPath();
	ctx.arc(this.cx, baseY, baseRadius, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(this.cx, middleY, middleRadius, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(this.cx, topY, topRadius, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(this.cx - middleRadius, middleY);
	ctx.lineTo(this.cx - middleRadius - armLength, middleY - armLength/4);
	ctx.moveTo(this.cx + middleRadius, middleY);
	ctx.lineTo(this.cx + middleRadius + armLength, middleY - armLength/4);
	ctx.stroke();
};

Snowman.prototype.getAnimationPhase = function() {
	return (1 - this.y.frac()) % 1;
};
