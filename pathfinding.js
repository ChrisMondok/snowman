window.lastPath = null;
function findPathToFinish(obstacles, origin, numLanes) {
	var open = [{x: origin.x, y: origin.y, parent: null}];
	var closed = [];

	while(open.length) {
		var thisNode = open.min('y');
		open.removeAt(open.indexOf(thisNode));

		var successors = getSuccessors(thisNode);
		closed.push(thisNode);

		for(var i = 0; i < successors.length; i++) {
			var s = successors[i];
			if(s.y === 0) {
				window.lastPath = s;
				return s;
			}
			if(!open.concat(closed).any({x: s.x, y: s.y})) {
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
		return !obstacles.any({x: x, y: y, blocksMovement: true});
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
