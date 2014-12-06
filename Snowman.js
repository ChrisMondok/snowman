var Snowman = extend(Pawn, function Snowman(){});

Snowman.prototype.tick = function(dt) {
	Pawn.prototype.tick.apply(this, arguments);
};
