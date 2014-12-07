var IcePowerup = extend(Pawn, function IcePowerup() { });

IcePowerup.prototype.blocksMovement = false;

IcePowerup.prototype.draw = function(ctx, dt) {
	ctx.drawImage(IcePowerup.image, this.cx - IcePowerup.image.width/2, this.cy - IcePowerup.image.width/2);
};

IcePowerup.image = getImage("images/snowflake.png");
