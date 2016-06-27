var get = require('lodash.get');
var update = require('lodash.update');
var mergeSetsDeep = require('@quarterto/merge-sets-deep');

module.exports = initialState => {
	var state = initialState || {};
	var subscribers = {};
	return sink => {
		var runSink = () => sink(
			path => { // subscribe
				update(
					subscribers,
					path,
					pathSubs => pathSubs ? pathSubs.add(runSink) : new Set([runSink])
				);

				return get(state, path);
			},

			(path, fn) => { // dispatch
				update(state, path, fn);
				return Array.from(mergeSetsDeep(get(subscribers, path, [])))
					.map(sub => sub());
			}
		);

		return runSink();
	};
};
