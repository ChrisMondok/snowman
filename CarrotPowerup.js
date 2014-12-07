var CarrotPowerup = extend(Pawn, function CarrotPowerup() { });

CarrotPowerup.prototype.blocksMovement = false;

CarrotPowerup.prototype.draw = function(ctx, dt) {
	ctx.drawImage(CarrotPowerup.image, this.cx - CarrotPowerup.image.width/2, this.cy - CarrotPowerup.image.width/2);
};

CarrotPowerup.image = getImage("images/carrot.png");
