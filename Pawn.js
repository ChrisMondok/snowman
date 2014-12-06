function Pawn() {
}

Pawn.prototype.x = 0;
Pawn.prototype.y = 0;

Pawn.prototype.blocksMovement = false;

Pawn.prototype.tick = function(dt) {
};

Pawn.prototype.draw = function(ctx, dt) {

};

Object.defineProperty(Pawn.prototype, 'px', {
	get: function() {return this.x * GRID_SIZE;}
});
Object.defineProperty(Pawn.prototype, 'py', {
	get: function() {return this.y * GRID_SIZE;}
});
Object.defineProperty(Pawn.prototype, 'cx', {
	get: function() {return (this.x + 0.5) * GRID_SIZE;}
});
Object.defineProperty(Pawn.prototype, 'cy', {
	get: function() {return (this.y + 0.5) * GRID_SIZE;}
});
