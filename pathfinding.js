window.lastPath = null;
function findPathToFinish(obstacles, origin, numLanes) {
	var open = [{x: origin.x, y: origin.y, parent: null}];
	var closed = [];

	while(open.length) {
		var thisNode = open.reduce((a, b) => a.y < b.y ? a : b);
		open.splice(open.indexOf(thisNode, 1));

		var successors = getSuccessors(thisNode);
		closed.push(thisNode);

		for(var i = 0; i < successors.length; i++) {
			var s = successors[i];
			if(s.y === 0) {
				window.lastPath = s;
				return s;
			}
			if(!open.concat(closed).some(node => node.x == s.x && node.y == s.y)) {
				open.push(s);
			}
		}
	}

	function nodeCost(node) {
		return node.y;
	}

	function getSuccessors(node) {
		var successors = [];
		if(positionIsFree(node.x, node.y - 1))
			successors.push({ x: node.x, y: node.y - 1, parent:node });

		if(positionIsFree(node.x - 1, node.y))
			successors.push({ x: node.x - 1, y: node.y, parent:node });

		if(positionIsFree(node.x + 1, node.y))
			successors.push({ x: node.x + 1, y: node.y, parent:node });

		return successors;
	}

	function positionIsFree(x, y) {
		if(x < 0 || x >= numLanes)
			return false;
		if(y < 0)
			return false;
		// This was probably a bug, but obstacles would contain undefined at the first index???
		return !obstacles.filter(o => o !== undefined).some(o => o.x ==x && o.y == y && o.blocksMovement);
	}

	return null;
}

function printLastPath() {
	var p = lastPath;
	while(p) {
		console.log("%s, %s", p.x, p.y);
		p = p.parent;
	}
}
