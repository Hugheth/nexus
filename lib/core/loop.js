// GAME LOOP //
nx.pause = false;	// If the game is paused
nx.time = 0;	// Frame count

// The stack stores messages to handle at given points in time
nx.stack = {};
// Add to the stack
nx.stack.add = function( data, time ) {
	// Check for array
	if (!nx.stack[time]) nx.stack[time] = [];
	// Push the data onto the stack
	nx.stack[time].push(data);
}

// The main game loop that handels packet propogation
nx.tick = function() {
	var i;
	// Do nothing if the game is paused
	if (nx.pause) return;
	// Check delay
	if (nx.delay > 0) {
		// Count down
		nx.delay--;
		return;
	}
	// Iterate through circuits
	for (i in nx.circuits)
		nx.circuits[i].tick();
	// Check for messages to handle
	var stk = nx.stack[nx.time];
	if (stk) {
		// Iterate through stack and dispatch messages
		for (i in stk)
			nx.dispatch(stk[i]);
		// Clear messages
		delete nx.stack[nx.time];
	}
	// Increment the time
	nx.time++;
};

// Dispatch a message
nx.dispatch = function( data ) {
	switch (data.type) {
		case 'clikput':
			// Untag the input
			if (data.local)
				data.circuit.draw.find('.clikput.ref' + data.ref).removeClass('wait');
			// Clikput
			var res = data.circuit["clikput_" + data.ref](data);
			if (!data.player && res) {
				nx.sound.play('clikput_generate');
			} else if (data.player == nx.players.me) {
				if (res)
					nx.sound.play('clikput_accept');
				else
					nx.sound.play('clikput_block');
			}
		break;
	}
};

// Regularly calls the tick function
setInterval(function() {
	setTimeout(nx.tick, 100);
	setTimeout(nx.tick, 200);
	setTimeout(nx.tick, 300);
	setTimeout(nx.tick, 400);
	setTimeout(nx.tick, 500);
	setTimeout(nx.tick, 600);
	setTimeout(nx.tick, 700);
	setTimeout(nx.tick, 800);
	setTimeout(nx.tick, 900);
	setTimeout(nx.tick, 1000);
}, 1000);
