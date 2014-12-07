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
