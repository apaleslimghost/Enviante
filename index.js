var get = require('lodash.get');
var update = require('lodash.update');
var mergeSetsDeep = require('@quarterto/merge-sets-deep');

module.exports = initialState => {
	var state = initialState || {};
	var subscribers = {};
	return receiver => {
		var runReceiver = () => receiver(
			(path, defaultValue) => { // subscribe
				update(
					subscribers,
					path,
					pathSubs => pathSubs ? pathSubs.add(runReceiver) : new Set([runReceiver])
				);

				return get(state, path, defaultValue);
			},

			(path, fn) => { // dispatch
				update(state, path, fn);
				return Array.from(mergeSetsDeep(get(subscribers, path, [])))
					.map(sub => sub());
			},

			path => { // unsubscribe
				update(
					subscribers,
					path,
					pathSubs => {
						if(pathSubs) pathSubs.delete(runReceiver);
						return pathSubs;
					}
				);
			}
		);

		return runReceiver();
	};
};
