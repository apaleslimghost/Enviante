var im = require('immutable');
var Bacon = require('baconjs');

export var dispatcher = (receivers, init = {}) => {
	var receiverMap = receivers.reduce(
		(map, receiver) => map.updateIn(receiver.receives, current => current ? current.push(receiver) : im.List.of(receiver)),
		new im.Map()
	);
	var state = im.fromJS(init);
	var dispatch = (path, modify = (a => a), defaultValue = null) => {
		state = state.updateIn(path, defaultValue, modify);
		var found = receiverMap.getIn(path, new im.Map());
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
	return dispatch;
};

export var receives = (receives, fn) => (fn.receives = receives, fn);
