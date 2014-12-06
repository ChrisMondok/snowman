window.addEventListener("load", function() {
	letsDoThis();
});

function log(message) {
	console.log(message);
}

function letsDoThis() {
	var canvas = document.querySelector("canvas");

	var logUl = document.getElementById("log");

	log = function(message) {
		var li = document.createElement("li");
		li.innerHTML = message;
		logUl.appendChild(li);
		li.scrollIntoView();
	};

	function resizeCanvas() {
		canvas.setAttribute("width", canvas.offsetWidth);
		canvas.setAttribute("height", canvas.offsetHeight);
	}

	resizeCanvas();

	window.addEventListener("resize", resizeCanvas);

	var game = window.game = new Game(canvas);
	
	//game.tracks.push(new Track());

	var lastTick = new Date();

	function Tick() {
		if(!game)
			return;

		var now = new Date();
		var dt = now - lastTick;

		game.tick(dt);
		game.draw(dt);

		requestAnimationFrame(Tick);

		lastTick = now;
	}

	Tick();

	document.getElementById("drop-dead-players-button").addEventListener("click", function() {
		game.dropDeadPlayers();
	});
}

function extend(base, ctor) {
	if(!ctor || !(ctor instanceof Function))
		throw new TypeError();
	var cls = ctor;
	cls.prototype = Object.create(base.prototype);
	cls.prototype.constructor = ctor;
	return cls;
}

function getImage(url) {
	img = document.createElement('img');
	img.style.display = "none";
	img.src = url;
	return img;
}
