var Snowman = extend(Pawn, function Snowman(track){
	this.track = track;
	this.speed = 1/1000; //one hop per second

	window.snowman = this;
});

Snowman.prototype.tick = function(dt) {
	Pawn.prototype.tick.apply(this, arguments);
	this.y -= this.speed * dt;

	if(this.y < 0)
		this.y = this.track.rows - 1;
};

Snowman.prototype.size = GRID_SIZE * (3/5);

Snowman.prototype.moveLeft = function() {
	this.x = Math.max(0, this.x - 1);
};

Snowman.prototype.moveRight = function() {
	this.x = Math.min(this.track.lanes - 1, this.x + 1);
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
	return 1 - this.y.frac();
};
