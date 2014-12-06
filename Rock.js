var Rock = extend(Pawn, function Rock() {
	this.image = Rock.images.sample();
});

Rock.prototype.draw = function(ctx, dt) {
	//ctx.fillRect(this.px, this.py, GRID_SIZE, GRID_SIZE);
	//image is 3 times larger than the rock, which is centered
	ctx.drawImage(this.image, this.x - GRID_SIZE, this.y - GRID_SIZE, GRID_SIZE * 3, GRID_SIZE * 3);
};

Rock.images = ["images/rock-1.png", "images/rock-2.png"].map(getImage);
