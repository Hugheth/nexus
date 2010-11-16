// Seeded random number generator

nx.random = function( seed ) {
  this.seed = seed;
  var A = 48271;
  var M = 2147483647;
  var Q = M / A;
  var R = M % A;
  var tM = 1 / M;
  // Generate the next number in line
  this.next = function() {
	  var hi = this.seed / Q;
	  var lo = this.seed % Q;
	  var test = A * lo - R * hi;
	  if (test > 0) {
		this.seed = test;
	  } else {
		this.seed = test + M;
	  }
	  return (this.seed * tM);  
  };
};

// LOAD LEVEL //

nx.load = function( level ) {
	// Data
	var data = $('.nexus_levels .' + level);
	// Create the circuits
	// Iterate through the circuits
	data.find('level circuits').children().each(function() {
		// Add the circuit to the board
		nx.circuit.add(nx.factory($(this)));
	});
	// Connect circuitry
	// Iterate through the actions
	data.find('level actions').children().each(function() {
		var t = $(this);
		// Get the action name
		var name = (this.tagName).toLowerCase();
		// Switch
		switch (name) {
			case 'send':
			// Send a packet to a circuit
			var obj = t.attr('target');
			var pos = t.attr('pos');
			// Get the packet
			var p = nx.factory.packet(t.children(':first'));
			// Issue the command
			nx.circuits[obj].send(pos, p);
			break;
		}
	});
};
