var Symbol = require('es6-symbol');
var intent = Symbol.for('intent');

function Intent(path, data) {
	return {
		path: Array.isArray(path) ? path : path.split('/'),
		data,
		[intent]: true
	};
}

Intent.scope = function(...scope) {
	return function(path, data) {
		return Intent([...scope, ...path], data)
	};
};

Intent.of = function(...scope) {
	return data => Intent(scope, data);
};

Intent.isIntent = function(obj) {
	return obj[intent];
};

module.exports = Intent;
