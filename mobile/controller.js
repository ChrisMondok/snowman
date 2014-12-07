window.addEventListener("load", function() {
	var args = parseSearch();
	if("peerId" in args && "name" in args) {
		establishConnection(args.peerId, args.name);
		window.connection = null;
		setUpButtons();
	}
	else
		goBackToTheForm();
});

function establishConnection(gamePeerId, name) {
	var desiredId = localStorage.getItem("last-controller-peer-id") || undefined;
	makePeer(function(err, peer) {
		if(err) {
			debugger;
			alert(err);
		}
		else
			connectToGame(peer, gamePeerId, name);
	}, desiredId);
}

function setUpButtons() {
	var leftButton = document.getElementById("left");
	var rightButton = document.getElementById("right");
	var quitButton = document.getElementById("quit-button");
	var resetButton = document.getElementById("reset-button");

	leftButton.addEventListener("touchstart", function(e) {
		e.preventDefault();
		if(connection)
			connection.send("pressedLeft");
		leftButton.style.backgroundColor = "red";
	});

	leftButton.addEventListener("touchend", function(e) {
		e.preventDefault();
		if(connection)
			connection.send("releasedLeft");
		leftButton.style.backgroundColor = "";
	});

	rightButton.addEventListener("touchstart", function(e) {
		e.preventDefault();
		if(connection)
			connection.send("pressedRight");
		rightButton.style.backgroundColor = "green";
	});

	rightButton.addEventListener("touchend", function(e) {
		e.preventDefault();
		if(connection)
			connection.send("releasedRight");
		rightButton.style.backgroundColor = "";
	});

	quitButton.addEventListener("click", function() {
		if(connection)
			connection.send("quit");
	});

	resetButton.addEventListener("click", function() {
		if(connection)
			connection.send("reset");
	});
}

function connectToGame(peer, gamePeerId, name) {
	localStorage.setItem("last-controller-peer-id", peer.id);

	var connection = peer.connect(gamePeerId, {metadata: {name: name}});

	connection.on("open", function() {
		window.connection = connection;
		broadcastOrientation();
	});

	connection.on("error", function(error) {
		alert("ERROR connecting to game: "+JSON.stringify(error));
	});

	connection.on("data", function(message) {
		var arr = message.split(" ");
		switch(arr[0]) {
			case "playSound":
				playSound(arr[1]);
				break;
			default:
				console.log("Can't handle "+arr[0]);
				break;
		}
	});

	connection.on("close", goBackToTheForm);
}

if(window.screen && window.screen.orientation && window.screen.orientation.addEventListener)
{
	screen.orientation.addEventListener("change", function(event) {
		broadcastOrientation();
	});
}

function broadcastOrientation() {
	var orientation = screen.orientation.type.replace(/-.*/,"");
	if(connection)
		connection.send(orientation == "landscape" ? "ready" : "notReady");
}

function goBackToTheForm() {
	window.location.href = window.location.href.replace(/controller.html/,"index.html");
}

function playSound(name) {
	var availableSounds = document.getElementsByClassName("sound-"+name);
	var index = Math.floor(Math.random() * availableSounds.length);
	var audio = availableSounds[index];

	alert(audio);

	audio.play();
}
