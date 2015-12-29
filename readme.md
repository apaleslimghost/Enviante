<h1 align="center">
	<img src="/logo.png" width="600"><br>
	<a href="https://npmjs.org/package/enviante"><img src="https://badge.fury.io/js/enviante.svg"></a>
	<a href="https://travis-ci.org/quarterto/Enviante"><img src="https://travis-ci.org/quarterto/Enviante.svg"></a>
</h1>

Predictable, decoupled, nested, streaming state for applications.

Dispatch
----------

The `dispatch` function is the crux of Enviante. All interactions, database updates, `fetch` responses, whatever, will result in a call to `dispatch` to update some part of the state. It returns a stream of values returned by your application functions.

State
------

State in Enviante is an immutable tree. Receiver functions are given a copy of the state; local modifications mean nothing. The only way to update the state is to dispatch an intent.

Intents
---------

An intent is a function that updates a slice of state. It's what you pass to `dispatch`. Given an initial state of `{foo: 5}`, dispatching the intent `function(state) { return state * 2 }` to the path `['foo']` will result in the state `{foo: 10}`. If your intents are pure functions (i.e. they do not have side effects or rely on external state), your state is defined entirely by the intents that have been dispatched so far.

Receivers
------------

A receiver is a function that is called when a particular slice of state is updated. It's given the entire state, and a copy of dispatch. Return values from these functions are streamed in the return value of `dispatch`, starting with the dispatch that directly triggered this update and bubbling up to the root dispatch. This allows receivers to return e.g. stateless React components, which are rendered by the root dispatch.

Dispatcher
-------------

Dispatcher ties everything together. It takes a tree of receivers and returns the root dispatch function:

```js
var dispatcher = require('enviante');

function foo(state, dispatch) {
  // call dispatch here to keep updating the state
  return state.foo;
}

var dispatch = dispatcher([[['foo'], foo]]);
dispatch(['foo'], function() {
  return 5;
}).onValue(console.log); // logs 5
```

Streaming
------------

Since `dispatch` returns a lazy event stream, nothing actually runs until you start the stream, by calling `.onValue(fn)`. This also lets you do something with your receivers' return values.

TODO
----

More examples, full API documentation, namecheck redux/om/cycle, annotated source?

install
---
```
npm install enviante
```

licence
---
MIT
