// Nexus object
nx = {};

// Version
nx.version = '1.0.0';

// Error handler
nx.error = function ( type, text, data ) {
	if ( !window.console ) return false;
	// Warn the console
	console.warn( type + ': ' + text );
	return false;
}

// Convert html entities to proper characters
nx.toHTML = function ( str ) {
	str = str.replace( /&gt;/g, '>' );
	str = str.replace( /&lt;/g, '<' );
	str = str.replace( /&amp;/g, '&' );
	return str;
};

// The circuit object stores all the packet processors
// on the map such as wires, chips and buses.
nx.circuits = {};

// The factory creates and returns javascript instances of
// objects in the game such as chips and wires.
nx.factory = function ( e ) {
	var name = e[ 0 ].tagName.toLowerCase();
	// Check the the object exists
	if ( nx.factory[ name ] )
		return new nx.factory[ name ].fromDOM( e ); // Return the new object
	// Else return null
	return null;
};

// Contains a collection of functions to handle circuits
nx.circuit = {};
// Add a circuit to the map
nx.circuit.add = function ( circuit ) {

	if ( !circuit ) return;

	// Check that the circuit is unique
	if ( nx.circuits[ circuit.x + '.' + circuit.y ] ) return nx.error( 'Manipulation Error', 'Circuit already exists at this point', {
		x: circuit.x,
		y: circuit.y,
		add: true
	} );
	// Add to the circuit object
	nx.circuits[ circuit.x + '.' + circuit.y ] = circuit;
	// Position the circuit
	circuit.draw.css( {
		left: circuit.x * 10,
		top: circuit.y * 19
	} );
	circuit.update( true );
	// Append the circuit to the board
	nx.board.append( circuit.draw );
};
// Remove a circuit from the map
nx.circuit.remove = function ( x, y ) {
	var c = nx.circuits[ x + '.' + y ];
	if ( !c ) return nx.error( 'Manipulation Error', 'No circuit to remove at this point', {
		x: x,
		y: y,
		remove: true
	} );
	c.remove();
	delete nx.circuits[ x + '.' + y ];
}

// Circuit exists at a point
nx.point = function ( x, y ) {
	// Iterate through circuits
	for ( var i in nx.circuits )
	// Get the point for the current circuit
		if ( nx.circuits[ i ].point( x, y ) ) return true;
		// False
	return false;
};
// Get information about the port
nx.port = function ( x, y ) {
	// Iterate through circuits
	for ( var i in nx.circuits ) {
		// Get the point for the current circuit
		var p = nx.circuits[ i ].port( x, y );
		// Point exists?
		if ( p != null ) {
			return {
				circuit: nx.circuits[ i ],
				pos: p
			};
		}
	}
	return null;
};

// Send a packet to a point
nx.sendTo = function ( x, y, data ) {
	var nxt = nx.port( x, y );
	if ( nxt ) {
		// Send packet data and speed to the circuit port
		nxt.circuit.send( nxt.pos, data );
		return true;
	}
	return false;
};

// The player object stores the players currently in the game
nx.players = {
	0: {
		tint: '#5be'
	},
	1: {
		tint: '#0a0'
	},
	2: {
		tint: '#a00'
	},
	me: 1,
	max: 16
};

$( function () {
	// Prevent dragging around
	$( 'body' ).mousedown( function ( e ) {
		e.preventDefault();
	} );
	// Board stores the dom position of the game board
	nx.board = $( '.nexus_game .board' );
	// Load the menu level
	nx.load( 'menu' );
} );