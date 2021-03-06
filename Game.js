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

	this.difficulty = 0;

	this.reset();

	this.delay = 0;
}

Game.prototype.generateNextLevel = function() {
	switch (this.difficulty) {
		case 0:
			return new TrackFactory(4, 50, 25);
		case 1:
			return new TrackFactory(4, 50, 50);
		case 2:
			return new TrackFactory(5, 10, 50);
		case 3:
			return new TrackFactory(3, 50, 40);
		case 4:
			return new TrackFactory(8, 50, 100);
		case 5:
			return new TrackFactory(12, 12, 100);
		default:
			break;
	}
	log("Out of difficulty levels, try this random one");
	var width = 3 + Math.floor(Math.random() * 5);
	var height = 20 + Math.floor(Math.random() * 50);
	var obstacles = Math.min(100, Math.floor((0.2 * Math.random() + 0.1) * width * height));
	return new TrackFactory(width, height, obstacles);
};

Game.prototype.reset = function() {
	log("New round, difficulty is now "+this.difficulty);
	setTimeout(function() {
		this.trackFactory = this.generateNextLevel();

		this.tracks.forEach(function(track) {
			track.reset(this.trackFactory);
		}, this);

	}.bind(this));

	this.delay = 2000;

	this.tracks.filter(t => t.won === false).forEach(function(t) {
		t.lose();
	});
};

Game.prototype.stepInterval = 1000;

Game.prototype.tick = function(dt) {

	if(this.tracks.some(t => t.won)) {
		this.difficulty++;
		setTimeout(this.reset.bind(this));
	}

	if(this.tracks.length && this.tracks.every(t => t.lost)) {
		playSound("everybodylost");
		setTimeout(this.reset.bind(this));
	}

	if(this.delay)
		this.delay = Math.max(0, this.delay - dt);

	if(!this.paused) {
		for(var i = 0; i < this.tracks.length; i++)
			this.tracks[i].tick(dt);
	}
};

Game.prototype.draw = function(dt) {
	if(this.delay)
		return;
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

	this.ctx.fillText(Math.floor(1000/dt), 10, 10);
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

	var url = window.location.href + "mobile";
	var params = "/?peerId="+id;
	new QRCode(document.getElementById("qrcode-container"), url + params);
	document.getElementById("url-display").innerHTML = url;
	document.getElementById("peer-id-display").innerHTML = id;
};

Game.prototype.freezeOtherTracks = function(track) {
	this.tracks.filter(t => t !== track).forEach(function(target) {
		var snowman = target.getSnowman();
		if(snowman)
			snowman.freeze();
	});
};

Game.prototype.gotConnection = function(peer, dataConnection) {
	var playerId = dataConnection.peer;
	var name = dataConnection.metadata.name;
	var track = this.tracks.find(t => t.id == playerId);
	if(!track) {
		log(name+" joined");
		track = new Track(this, playerId, name);
		track.reset(this.trackFactory);
		this.tracks.push(track);
	}
	else {
		log(name+" reconnected");
	}

	track.name = name;
	track.dead = false;
	track.playSound = function(name) {
		dataConnection.send("playSound "+name);
	};

	track.vibrate = function(ms) {
		dataConnection.send("vibrate "+ms);
	};

	dataConnection.on("data", function(message) {
		switch(message) {
			case "pressedLeft":
				if(!this.paused)
					track.moveLeft();
				break;
			case "pressedRight":
				if(!this.paused)
					track.moveRight();
				break;
			case "releasedLeft":
			case "releasedRight":
				//do I care?
				break;
			case "quit":
				log(name + " quit");
				track.dead = true;
				dataConnection.close();
				this.tracks.splice(this.tracks.indexOf(track), 1);
				break;
			case "reset":
				log(name+ " has restarted");
				track.reset(this.trackFactory);
				break;
			case "ready":
				track.ready = true;
				break;
			case "notReady":
				track.ready = false;
				break;
			default:
				console.log("I can't interpret "+message);
				break;
		}
	}.bind(this));

	dataConnection.on("close", function() {
		if(!track.dead)
			log(name + " disconnected");
		track.dead = true;
		track.playSound = function(url){log("Failed to play sound "+name+": track dead");};
		track.vibrate = Track.prototype.vibrate;
	});
};

Game.prototype.dropDeadPlayers = function() {
	this.tracks = this.tracks.filter(t => !t.dead);
};

Object.defineProperty(Game.prototype, "paused", {
	get: function() {
		if(this.delay)
			return true;
		return game.tracks.some(t => !t.ready);
	}
});

loadSound("everybodylost", "sounds/everybody-lost.ogg");
