var σ = require('highland');
var Intent = require('../intent');
var find = require('array-find');

function streamCoerce(s) {
	if(!s)               return σ([]);
	if(σ.isStream(s))    return s;
	if(Array.isArray(s)) return σ(s);
	return σ([s]);
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

	dispatch(intent) {
		var receiver = find(this.registry, receiver => this.canReceive(intent, receiver));
		if(receiver) {
			return streamCoerce(receiver(intent)).flatMap(
				i => Intent.isIntent(i) ? this.dispatch(i) : streamCoerce(i)
			);
		}

		return σ([]);
	}

	removeReceiver(receiver) {
		this.registry = this.registry.filter(r => r !== receiver);
	}

	register(receiver) {
		this.registry.push(receiver);
	}
}

module.exports = Dispatcher;
