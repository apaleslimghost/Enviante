const get = require('@quarterto/get-path');
const update = require('@quarterto/update-path');
const mergeSetsDeep = require('@quarterto/merge-sets-deep');

module.exports = (initialState, initialMeta) => {
	const state = initialState || {};
	const subscribers = {};

	return receiver => {
		const runReceiver = meta => {
			const subscribe = (path, defaultValue) => {
				update(
					subscribers,
					path,
					pathSubs => pathSubs ? pathSubs.add(runReceiver) : new Set([runReceiver])
				);

				return get(state, path, defaultValue);
			};

			const dispatch = (path, fn, meta) => {
				update(state, path, fn);
				return Array.from(mergeSetsDeep(get(subscribers, path, [])))
					.map(sub => sub(meta));
			};

			const unsubscribe = path => {
				update(
					subscribers,
					path,
					pathSubs => {
						if(pathSubs) pathSubs.delete(runReceiver);
						return pathSubs;
					}
				);
			};

			return receiver(
				Object.assign(subscribe, {
					subscribe, dispatch, unsubscribe, meta,
				}),
				dispatch,
				unsubscribe
			);
		};

		return runReceiver(initialMeta);
	};
};
