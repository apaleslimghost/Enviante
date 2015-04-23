var curry = require("curry");

var classRegistry = new WeakMap();
var instanceRegistry = new WeakMap();
var handleIntent = Symbol("handleIntent");

function registerClass(klass) {
	classRegistry.set(klass.displayName || klass.name, klass);
}

function registerInstance(obj) {
	var instances = instanceRegistry.get(obj.constructor) || new Map();
	instances.set(obj.id, obj);
	instanceRegistry.set(obj.constructor, instances);
}

function getClass(name) {
	return classRegistry.get(name);
}

function getInstance(klass, intent) {
	return classRegistry.get(name);
}

function Intent(path, data) {
	return {path, data};
}

Intent.scope = function(...scope) {
	return function(path, data) {
		return Intent([...scope, ...path], data)
	};
};

var canReceive = curry(function _canReceive(intent, klass) {
	return klass.receives.some(path =>
		path.every((part, i) => intent.path[i] === part)
	);
});

function dispatch(intent) {
	var klass = registry.find(canReceive(intent));
	if(klass) {
		getInstance(klass, intent)[handleIntent](intent).forEach(dispatch);
	}
}
