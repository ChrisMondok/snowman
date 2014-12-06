function Game(canvas) {
	this.ctx = canvas.getContext('2d');	

	this.tracks = [];
}

Game.prototype.stepInterval = 1000;

Game.prototype.tick = function(dt) {
	for(var i = 0; i < this.tracks.length; i++)
		this.tracks[i].tick(dt);
};

Game.prototype.draw = function(dt) {
	var canvas = this.ctx.canvas;
	this.ctx.clearRect(0, 0, canvas.width, canvas.height);

	var minTrackSpace = 4;	

	var scale = Math.min(1, canvas.width / this.getTotalTrackWidth());

	this.ctx.save();
	this.ctx.translate(0, canvas.height * (1 - scale));
	this.ctx.scale(scale, scale);
	var columnWidth = (canvas.width / scale) / this.tracks.length;
	for(var i = 0; i < this.tracks.length; i++) {
		var track = this.tracks[i];

		var leftEdge = columnWidth * (i + 0.5) - track.width/2;
		this.ctx.save();
		this.ctx.translate(leftEdge, 0);
		this.tracks[i].draw(this.ctx, dt);
		this.ctx.restore();
	}
	this.ctx.restore();
};

Game.prototype.getTotalTrackWidth = function() {
	var width = 0;
	var minTrackSpace = 4;

	for(var i = 0; i < this.tracks.length; i++) {
		if(i)
			width += minTrackSpace;
		width += this.tracks[i].width;
	}

	return width;
};
