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
			break;
		case 1:
			return new TrackFactory(4, 50, 50);
			break;
		default:
			break;
	}
	return new TrackFactory(8, 50, 100);
};

Game.prototype.reset = function() {
	log("New round, difficulty is now "+this.difficulty);
	this.trackFactory = this.generateNextLevel();
	this.delay = 2000;

	this.tracks.filter({won: false}).forEach(function(t) {
		t.lose();
	});

	this.tracks.forEach(function(track) {
		track.reset(this.trackFactory);
	}, this);
};

Game.prototype.stepInterval = 1000;

Game.prototype.tick = function(dt) {

	if(this.tracks.any({won: true})) {
		this.difficulty++;
		setTimeout(this.reset.bind(this));
	}

	if(this.tracks.length && this.tracks.all({lost: true})) {
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

Game.prototype.gotConnection = function(peer, dataConnection) {
	var playerId = dataConnection.peer;
	var name = dataConnection.metadata.name;
	var track = this.tracks.find({id: playerId});
	if(!track) {
		log(name+" joined");
		track = new Track(playerId, name);
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
				this.tracks.remove(track);
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
	this.tracks.remove({dead: true});
};

Object.defineProperty(Game.prototype, "paused", {
	get: function() {
		if(this.delay)
			return true;
		return game.tracks.any({ready: false});
	}
});

loadSound("everybodylost", "sounds/everybody-lost.ogg");
