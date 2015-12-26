import {Map, Iterable, List, fromJS as immutableFromJS} from 'immutable';
import {fromBinder as baconFromBinder, Bus} from 'baconjs';
import mapToTree from '@quarterto/immutable-map-to-tree';

export default function dispatcher(receivers, init = {}) {
	var receiverTree = mapToTree(receivers);
	var state = immutableFromJS(init);
	
	return function dispatch(path = [], modify = (a => a), defaultValue = null) {
		var found = receiverTree.getIn(path, new Map());
		var receivers = Iterable.isIterable(found) ? found.valueSeq().flatten() : List.of(found);
		var stream = new Bus();

		state = state.updateIn(path, defaultValue, modify);

		stream.plug(baconFromBinder(sink => {
			receivers.forEach(receiver => {
				var result = receiver(state.toJS(), (...args) => stream.plug(dispatch(...args)));
				if(typeof result !== 'undefined') sink(result);
			});
		}));

		return stream;
	};
};
