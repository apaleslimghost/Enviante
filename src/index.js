var registry = new WeakMap();

function register(klass) {
	registry.set(klass.displayName || klass.name, klass);
}

function get(name) {
	return registry.get(name);
}

class Intent {
	constructor() {}
}

function dispatch(intent) {
	registry.forEach((klass, name) => {
		if(receives(klass, intent)) {
			getInstance(klass).dispatch(intent).forEach(dispatch);
		}
	});
}
