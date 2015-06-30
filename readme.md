<h1 align="center">
	<img src="/logo.png" width="600"><br>
	<a href="https://npmjs.org/package/enviante"><img src="https://badge.fury.io/js/enviante.svg"></a>
	<a href="https://travis-ci.org/quarterto/Enviante"><img src="https://travis-ci.org/quarterto/Enviante.svg"></a>
</h1>

Decouple your applications with intents

```js
var Dispatcher = require('enviante');
var Intent = require('enviante/intent');

function controller(intent) {
	switch(intent.data.url) {
		case '/foo':
			return Intent(['render'], {greet: 'world'});
		default:
			return intent.data.url + ' not found';
	}
} controller.receives = [['route']];

function view(intent) {
	return 'hello ' + intent.data.greet;
} view.receives = [['render']];

var server = new Dispatcher([controller, view]);
server.dispatch(Intent(['route'], {url: '/foo'})).apply(function(result) {
	console.assert(result === 'hello world');
});
```

install
---
```
npm install enviante
```

licence
---
MIT
