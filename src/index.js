var im = require('immutable');
var Bacon = require('baconjs');
var mapToTree = require('@quarterto/immutable-map-to-tree');

export default function dispatcher(receivers, init = {}) {
	var receiverTree = mapToTree(receivers);
	var state = im.fromJS(init);
	return function dispatch(path, modify = (a => a), defaultValue = null) {
		state = state.updateIn(path, defaultValue, modify);
		var found = receiverTree.getIn(path, new im.Map());
		var receivers = im.Iterable.isIterable(found) ? found.valueSeq().flatten() : im.List.of(found);
		var stream = new Bacon.Bus();
		stream.plug(Bacon.fromBinder(sink => {
			receivers.forEach(receiver => {
				var result = receiver(state.toJS(), (...args) => stream.plug(dispatch(...args)));
				if(result) sink(result);
			});
		}));
		return stream;
	};
};
