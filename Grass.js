var Grass = extend(Pawn, function Grass() {
	this.image = Grass.images.sample();
});

Grass.prototype.blocksMovement = false;

Grass.prototype.draw = function(ctx, dt) {
	ctx.drawImage(this.image, this.px - GRID_SIZE, this.py - GRID_SIZE, GRID_SIZE * 3, GRID_SIZE * 3);
};

Grass.images = ["images/grass-1.png", "images/grass-2.png"].map(getImage);
