const get = require('@quarterto/get-path');
const update = require('@quarterto/update-path');
const mergeSetsDeep = require('@quarterto/merge-sets-deep');

module.exports = initialState => {
	const state = initialState || {};
	const subscribers = {};
	return receiver => {
		const runReceiver = () => receiver(
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
