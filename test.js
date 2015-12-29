var {expect} = require('chai').use(require('sinon-chai')).use(require('dirty-chai'));
var sinon = require('sinon');
var nthback = require('@quarterto/nthback');
var dispatcher = require('./');

var runObservable = o => o.onValue(() => {});

describe('Dispatcher', () => {
	it('returns a dispatch function', () => {
		var d = dispatcher();
		expect(d).to.be.a('function');
	});

	describe('dispatch', () => {
		it('should return an observable', () => {
			var d = dispatcher();
			expect(d()).to.have.property('_isObservable');
		});

		it('should send a thing to the thing that can receive it', () => {
			var r = sinon.spy();
			var d = dispatcher([
				[['foo'], r]
			]);
			runObservable(d(['foo']));
			expect(r).to.have.been.called();
		});

		it('should pass the state to the thing', () => {
			var r = sinon.spy();
			var d = dispatcher([
				[['foo'], r]
			]);
			runObservable(d(['foo']));
			expect(r.lastCall.args[0]).to.deep.equal({});
		});

		it('should call all nested things', () => {
			var r = sinon.spy();
			var s = sinon.spy();
			var d = dispatcher([
				[['foo', 'bar'], r],
				[['foo', 'baz'], s],
			]);
			runObservable(d(['foo']));
			expect(r).to.have.been.called();
			expect(s).to.have.been.called();
		});

		it('should provide dispatch to receivers', () => {
			var r = sinon.spy();
			var d = dispatcher([
				[['foo'], (_, dispatch) => { dispatch(['bar']); }],
				[['bar'], r]
			]);
			runObservable(d(['foo']));
			expect(r).to.have.been.called();
		});

		it('should observe return values', done => {
			var r = sinon.stub().returns(5);
			var d = dispatcher([
				[['foo'], r]
			]);
			var o = d(['foo']);
			var s = sinon.spy();
			o.onValue(s);
			o.onEnd(() => {
				expect(s).to.have.been.calledOnce();
				expect(s).to.have.been.calledWith(5);
				done();
			});
			o.end();
		});
	
		it('should observe return values of subdispatches', done => {
			var r = sinon.stub().returns(2);
			var d = dispatcher([
				[['foo'], (_, dispatch) => { dispatch(['bar']); return 1; }],
				[['bar'], r]
			]);
			var o = d(['foo']);
			var s = sinon.spy();
			o.onValue(s);
			o.onEnd(() => {
				expect(s).to.have.been.calledTwice();
				expect(s).to.have.been.calledWith(1);
				expect(s).to.have.been.calledWith(2);
				done();
			});
			o.end();
		});

		it('should update the state at the path with the transformer', done => {
			var d = dispatcher([
				[['foo'], (state) => { expect(state).to.deep.equal({foo: 1}); done(); }],
			]);
			runObservable(d(['foo'], () => 1));
		});

		it('should update the state on nested dispatch', done => {
			var doneTwice = nthback(2)(done);
			var d = dispatcher([
				[['foo'], (state, dispatch) => { expect(state).to.deep.equal({foo: 1}); dispatch(['bar'], () => 2); doneTwice(); }],
				[['bar'], (state) => { expect(state).to.deep.equal({foo: 1, bar: 2}); doneTwice(); }]
			]);
			runObservable(d(['foo'], () => 1));
		});

	});
});
