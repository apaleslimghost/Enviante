<h1 align="center">
	<img src="/logo.png" width="600"><br>
	<a href="https://npmjs.org/package/enviante"><img src="https://badge.fury.io/js/enviante.svg"></a>
	<a href="https://travis-ci.org/quarterto/Enviante"><img src="https://travis-ci.org/quarterto/Enviante.svg"></a>
</h1>

```sh
npm install enviante
```

Decoupled, predictable application state. Subscribe anywhere, dispatch anywhere.

```js
import createStore from 'enviante';
const connect = createStore({count: 0});

connect((subscribe) => {
	document.getElementById('counter').innerHTML = subscribe('count');
});

connect((subscribe, dispatch) => {
	document.getElementById('increment').addEventListener('click', () => {		
		dispatch('count', count => count + 1);
	});
});

```

`connect = createStore(state)`
---

Create a new store with an initial state. Returns a function to connect to the store.

`connect(receiver: ({subscribe, dispatch, unsubscribe, meta}) => {})`
---

Sets up a connection from the store via the receiver. The function is called an object containing keys `subscribe`, `dispatch`, `unsubscribe`, and `meta`. Call `subscribe` to register a subscription to part of the state: when the state changes, the receiver is called again. Call `dispatch` to change part of the state and notify subscribers. Call `unsubscribe` to remove subscriptions. `meta` is information passed along with a `dispatch`, see [below](#dispatchstate-path-updater).

The receiver is called once, immediately. It will only be called again if you `subscribe` to any state. If you don't call `subscribe`, it's safe to register event handlers etc. in here.

`subscribe(['state', 'path'], defaultValue)`
---

Returns the nested state value at the path, falling back to a default value. Future dispatches to this path (or a sub-path) will call the receiver again.

`dispatch(['state', 'path'], updater, meta)`
---
Modifies the nested state value at the path with an updater function. The updater is called with the previous value, and its return value replaces the state at the path. If the updater returns undefined, the previous value is used. If the value is an object, mutations will be kept.

Any previous subscriptions at this path (or a sub-path) will call the receiver again. The last argument, `meta`, is passed along to receivers, which is useful for things like ignoring updates from certain sources.

`unsubscribe(['state', 'path'])`
---

Removes any previous subscription to the path. Future subscriptions will still cause reruns.

Inspiration
---

[Redux](https://github.com/react/redux) and Meteor's [`react-meteor-data`](https://atmospherejs.com/meteor/react-meteor-data).

I love Redux. I find it hard to build my state and components in the top-down way it seems to favour, and mutating state can be nicer than deep immutable updates. I also love Meteor, but Tracker is far too magic.

Enviante lets you imbue any part of your application with an arbitrary chunk of state. If your dispatches are pure, your state is predicable. Since each dispatch only sees a small part of the state, it's also safe to mutate in-place.

History
---

Versions 1 and 2: Highland streams. "Receivers" that receive "Intents" and return a stream of Intents. Hard to reason about laziness, need to manually drain everything.

Version 3: Bacon streams. Concept of nested state appears. All receivers are passed in as a tree on init. Still a bunch of internal mystery meat, still weird laziness constraints.

Licence
---
MIT
