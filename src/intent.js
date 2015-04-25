function Intent(path, data) {
	return {path, data};
}

Intent.scope = function(...scope) {
	return function(path, data) {
		return Intent([...scope, ...path], data)
	};
};

Intent.of = function(...scope) {
	return data => Intent(scope, data);
};

module.exports = Intent;
