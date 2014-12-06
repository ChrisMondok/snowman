window.addEventListener('load', function() {
	var args = parseSearch();

	prepopulateForm(args);
});

function prepopulateForm(args) {
	for(var key in args) {
		var matchingInputs = document.getElementsByName(key);
		if(matchingInputs.length)
			matchingInputs[0].value = args[key];
	}
}
