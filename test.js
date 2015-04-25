var {expect} = require('chai').use(require('sinon-chai'));
var sinon = require('sinon');
var Dispatcher = require('./lib');

describe('Dispatcher', () => {
	it('can be instantiated', () => {
		var d = new Dispatcher;
		expect(d).to.be.an.instanceof(Dispatcher);
	});

	it('can register a thing', () => {
		var d = new Dispatcher;
		d.register(function () {});
	});

	it('can dispatch a thing', () => {
		var d = new Dispatcher;
		d.dispatch({});
	});

	it('can take an array of things to register', () => {
		function r() {}
		var d = new Dispatcher([r]);
		expect(d.registry).to.contain(r);
	});

	describe('dispatch', () => {
		it('should send a thing to the thing that can receive it', () => {
			var d = new Dispatcher;
			var r = sinon.spy();
			r.receives = [['foo']];
			d.register(r);
			d.dispatch({path: ['foo']});
			expect(r).to.have.been.called;
		});

		it('should pass the intent to the thing', () => {
			var d = new Dispatcher;
			var r = sinon.spy();
			r.receives = [['foo']];
			d.register(r);
			var i = {path: ['foo']};
			d.dispatch(i);
			expect(r).to.have.been.calledWith(i);
		});

		it('should call a thing with a subpath', () => {
			var d = new Dispatcher;
			var r = sinon.spy();
			r.receives = [['foo']];
			d.register(r);
			d.dispatch({path: ['foo', 'bar']});
			expect(r).to.have.been.called;
		});

		it('shouldn\'t call a subpath thing without a subpath', () => {
			var d = new Dispatcher;
			var r = sinon.spy();
			r.receives = [['foo', 'bar']];
			d.register(r);
			d.dispatch({path: ['foo']});
			expect(r).not.to.have.been.called;
		});

		it('should dispatch the return values', () => {
			var d = new Dispatcher;

			var r = sinon.stub(); r.receives = [['foo']]; r.returns([{path: ['bar']}, {path: ['baz']}]);
			var s = sinon.spy(); s.receives = [['bar']];
			var t = sinon.spy(); t.receives = [['baz']];

			d.register(r);
			d.register(s);
			d.register(t);

			d.dispatch({path: ['foo']});
			expect(s).to.have.been.called;
			expect(t).to.have.been.called;
		});
	});
});
