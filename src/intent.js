function Intent(path, data) {
	return {path, data};
}

Intent.scope = function(...scope) {
	return function(path, data) {
		return Intent([...scope, ...path], data)
	};
};

module.exports = Intent;
