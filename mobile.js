var holdingLeft = false;
var holdingRight = false;

window.addEventListener('load', function() {
	var leftButton = document.getElementById('left');
	var rightButton = document.getElementById('right');

	leftButton.addEventListener('touchstart', function(e) {
		e.preventDefault();
		holdingLeft = true;
		leftButton.style.backgroundColor = "red";
	});

	leftButton.addEventListener('touchend', function(e) {
		e.preventDefault();
		holdingLeft = false;
		leftButton.style.backgroundColor = "";
	});

	rightButton.addEventListener('touchstart', function(e) {
		e.preventDefault();
		holdingRight = true;
		rightButton.style.backgroundColor = "green";
	});

	rightButton.addEventListener('touchend', function(e) {
		e.preventDefault();
		holdingRight = false;
		rightButton.style.backgroundColor = "";
	});
});
