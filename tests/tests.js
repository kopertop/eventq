/**
 * @author Chris Moyer <cmoyer@newstex.com>
 */
'use strict';

var should = require('should');
var EventQ = require('../index');

describe('EventQ', function(){

	it('should fire a "ready" event after the timeout', function(done){
		var q = new EventQ(0,50);
		q.on('ready', function(){ done(); });
	});
	it('should fire a "ready" event after we trigger done 5 times', function(done){
		var q = new EventQ(5);
		q.on('ready', function(){ done(); });
		for (var i = 0; i < 5; i++){
			q.done();
		}
	});
	it('should fire after 6 calls', function(done){
		var count = 6;
		var q = new EventQ(5);
		q.add();
		q.on('ready', function(){
			count.should.eql(0);
			done();
		});
		for (var i = 0; i < 6; i++){
			count--;
			q.done();
		}
	});
	it('should return a list of values sent to the "done" function', function(done){
		var items = [ 'a', 'something', 60, false, null, 16.4 ];
		var q = new EventQ(items.length);
		q.on('ready', function(vals){
			vals.should.eql(items);
			done();
		});
		items.forEach(function(item){
			q.done(item);
		});
	});
});
