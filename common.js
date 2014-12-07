function makePeer(callback, desiredId) {
	var peer;

	var peerOptions = {key: "u9w2z80r7a5uerk9"};

	if(desiredId)
		peer = new Peer(desiredId, {key: "u9w2z80r7a5uerk9"});
	else
		peer = new Peer(peerOptions);

	peer.on("error", function(err) {
		if(err.type == "unavailable-id")
			makePeer(callback);
		else {
			callback(err, null);
			alert("Error connecting to signaling server: "+JSON.stringify(err));
		}
	});

	peer.on("open", function(id) {
		callback(null, peer);
	});
}

function parseSearch() {
	var args = {};
	location.search.replace(/^\?/,'').split('&').forEach(function(nameValue) {
		var nameAndValue = nameValue.split('=');
		args[nameAndValue[0]] = nameAndValue[1];
	});

	return args;
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.audioCtx = new window.AudioContext();

window.sounds = {};

function loadSound(name, url) {
	var source = window.audioCtx.createBufferSource();
	var req = new XMLHttpRequest();

	req.open('GET', url, true);

	req.responseType = 'arraybuffer';

	req.addEventListener('load', function() {
		var audioData = req.response;
		audioCtx.decodeAudioData(audioData, function(buffer) {
			source.buffer = buffer;

			source.connect(audioCtx.destination);
			window.sounds[name] = window.sounds[name] || [];
			window.sounds[name].push(buffer);
		},
		function(error){console.error("Well this sucks.");});
	});

	req.send();
}

function playSound(name) {
	if(!(name in sounds))
		return;

	var index = Math.floor(Math.random() * sounds[name].length);

	playBuffer(sounds[name][index]);
}

function playBuffer(buffer) {
	var src = audioCtx.createBufferSource();
	src.buffer = buffer;
	src.connect(audioCtx.destination);
	src.start(0);
	return src;
}
