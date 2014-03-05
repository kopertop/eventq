eventq
======

A simple Node.js "Event Q", which lets you trigger synchronous tasks to run after a set of asynchronous tasks has completed.

Usage
=====

Simple Usage:

	// Create a new EventQ, with default options
	var q = new EventQ();
	items.forEach(function(item){
		// Add to our counter
		q.add();
		my_async_function_with_callback(item, function(){
			// Pop one off our counter
			q.done();
		});
	});
	q.on('ready', function(){
		console.log('Ready!');
	});

