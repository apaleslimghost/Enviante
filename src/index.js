var σ = require('highland');

function find(xs, fn) {
	for(var i = 0, l = xs.length; i < l; ++i) {
		if(fn(xs[i], i, xs)) return xs[i];
	}
}

class Dispatcher {
	sinks = [];
	constructor(receivers = []) {
		this.registry = receivers;
	}

	canReceive(intent, receiver) {
		return receiver.receives.some(path =>
			path.every((part, i) => intent.path[i] === part)
		);
	}

	dispatch(intent) {
		var receiver = find(this.registry, receiver => this.canReceive(intent, receiver));
		if(receiver) {
			return σ(receiver(intent) || []).flatMap(i => this.dispatch(i));
		}

		this.sinks.forEach(sink => sink(intent));
	}

	sink(receiver) {
		this.sinks.push(receiver);
	}

	sinkOnce(receiver) {
		var self = this;
		this.sink(function sink() {
			self.removeSink(sink);
			return receiver.apply(this, arguments);
		});
	}

	removeSink(receiver) {
		this.sinks = this.sinks.filter(sink => sink !== receiver);
	}

	register(receiver) {
		this.registry.push(receiver);
	}
}

module.exports = Dispatcher;
