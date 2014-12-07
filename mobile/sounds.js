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

loadSound("win", "../sounds/yes.ogg");
loadSound("win", "../sounds/hooray.ogg");
loadSound("step", "../sounds/step-0.ogg");
loadSound("step", "../sounds/step-1.ogg");
loadSound("step", "../sounds/step-2.ogg");
loadSound("stopped", "../sounds/rock-1.ogg");
loadSound("stopped", "../sounds/loud.ogg");

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
