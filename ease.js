window.easing = {
	circularInOut: function circularInOut(from, to, x) {
		x /= 0.5;

		var delta = to - from;

		if(x < 1)
			return -delta/2 * (Math.sqrt(1 - x * x) - 1) + from;
		x -= 2;
		return delta/2 * (Math.sqrt(1 - x * x) + 1) + from;
	},

	quadraticInOut: function(from, to, x) {
		x /= 0.5;

		var delta = to - from;

		if(x < 1)
			return delta/2*x*x + from;
		x--;
		return -delta/2*(x*(x-2)-1) + from;	
	}
};
