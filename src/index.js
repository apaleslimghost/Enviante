var σ = require('highland');

function find(xs, fn) {
	for(var i = 0, l = xs.length; i < l; ++i) {
		if(fn(xs[i], i, xs)) return xs[i];
	}
}

class Dispatcher {
	constructor(receivers = []) {
		this.registry = receivers;
	}

	canReceive(intent, receiver) {
		return receiver.receives.some(path =>
			path.every((part, i) => intent.path[i] === part)
		);
	}

	_dispatch(intent) {
		var receiver = find(this.registry, receiver => this.canReceive(intent, receiver));
		if(receiver) {
			return σ(receiver(intent) || []).flatMap(i => this._dispatch(i));
		}

		return σ([]);
	}

	dispatch(intent) {
		return this._dispatch(intent).toArray(() => {});
	}

	registerOnce(receiver) {
		var self = this;
		once.receives = receiver.receives;
		this.register(once);
		function once() {
			self.removeReceiver(once);
			return receiver.apply(this, arguments);
		}
	}

	removeReceiver(receiver) {
		this.registry = this.registry.filter(r => r !== receiver);
	}

	register(receiver) {
		this.registry.push(receiver);
	}
}

module.exports = Dispatcher;
