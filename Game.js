function Game(canvas) {
	this.ctx = canvas.getContext("2d");	

	this.tracks = [];

	var desiredId = localStorage.getItem("last-peer-id");
	makePeer(function(err, peer) {
		if(err) {
			console.log(err);
			debugger;
		}
		else
			this.peerOpened(peer);
	}.bind(this), desiredId || undefined);
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

Game.prototype.peerOpened = function(peer) {
	var id = peer.id;
	this.peer = peer;
	localStorage.setItem("last-peer-id", id);

	peer.on("connection", this.gotConnection.bind(this, peer));

	var str = window.location.href + "mobile/?peerId="+id;
	new QRCode(document.getElementById("qrcode-container"), str);
};

Game.prototype.gotConnection = function(peer, dataConnection) {
	var track = this.tracks.find({id: dataConnection.id});
	if(!track) {
		track = new Track(dataConnection.id);
		this.tracks.push(track);
	}

	dataConnection.on("data", function(message) {
		switch(message) {
			case "pressedLeft":
				track.snowman.moveLeft();
				break;
			case "pressedRight":
				track.snowman.moveRight();
				break;
			case "releasedLeft":
			case "releasedRight":
				//do I care?
				break;
			default:
				console.log("I can't interpret "+message);
				break;
		}
	});
};
