/**
 * @Author: Chris Moyer <cmoyer@newstex.com>
 * @Description: An "Event Q" or "Waiting Counter", based on EventEmitter,
 * this allows you to call a bunch of asynchronous functions, and have a callback
 * called whenever they are all completed.
 *
 * Usage:
 *   var q = new EventQ();
 *
 *   items.forEach(function(item){
 *     // Add to our counter
 *     q.add();
 *     my_async_function_with_callback(item, function(){
 *       // Pop one off our counter
 *       // "val" is optional, and lets you return something
 *       // to the "ready" handler
 *       q.done(val);
 *     });
 *   });
 *
 *   q.add(function(done){
 *     // do async task
 *     done();
 *   });
 *
 *
 *
 *   q.on('ready', function(vals){
 *     console.log('Ready!');
 *   });
 *
 */
'use strict';

var events = require('events');
var util = require('util');

/**
 * Create a new EventQ
 * Keeps an internal counter, when the counter reaches zero it fires a "ready" event
 * You should emit "
 * @param count: An optional count to start at, defaults to 0
 * @param max_wait_time: An optional maximum time to wait before triggering ready
 */
function EventQ(count, max_wait_time){
	var self = this;
	events.EventEmitter.call(this);
	self.counter = count || 0;
	self.vals = [];
	if(max_wait_time){
		self.timeout = setTimeout(function eventQTimeout(){
			if(self.counter !== null){
				self.counter = null;
				self.emit('ready', self.vals);
			}
		}, max_wait_time);
	}
}
util.inherits(EventQ, events.EventEmitter);

/**
 * Add one to our counter
 */
EventQ.prototype.add = function eventQ_add(fnc){
	// Only add to the counter if we haven't set it to disabled
	if(this.counter !== null){
		this.counter++;
	}
	// Allow passing in a function to be run asynchronously
	if(fnc){
		var self = this;
		// Only allow the "completed" function to fire once
		var completed = false;
		function complete(val){
			if(!completed){
				completed = true;
				self.done(val);
			} else {
				console.warn('WARNING: Completion event fired multiple times');
			}
		}
		// Fire this asynchronously
		setImmediate(fnc, complete);
	}
};

/**
 * Delete one from our counter
 */
EventQ.prototype.done = function eventQ_done(val){
	// If we've disabled the counter, it's because we've already fired
	if(this.counter === null){
		return;
	}
	this.counter--;
	// Add this value if it is not undefined
	if (val !== undefined){
		this.vals.push(val);
	}
	// If we're at zero, fire the ready event
	if(this.counter <= 0){
		this.counter = null;
		this.emit('ready', this.vals);
	}
};


module.exports = EventQ;
 
