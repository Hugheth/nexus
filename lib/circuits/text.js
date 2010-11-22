// Text displays text on the screen
nx.factory.text = function( spec ) {
	// Get the dimensions
	this.x = spec.x;
	this.y = spec.y;
	this.w = spec.w;
	this.h = 3;
	// Text is visible
	this.show = true;
	// Text
	this.text = spec.text;
	// Generate border
	var brd = '', i = 0;
	while (i < this.w) {
		brd += '═';
		i++;
	}	
	// Set object
	this.draw = $('<div class="text" style="color: ' + spec.tint + '">╔' + brd + '╗<br/>║' + this.text + '║<br/>╚' + brd + '╝</div>');
	// Tick
	this.tick = function() {};
	// Update
	this.update = function() {};
	// Point
	this.port = function() { return null };
	this.point = function() { return false };
	// Remove
	this.remove = function() {};
};
// Create from dom
nx.factory.text.fromDOM = function( e ) {
	return new nx.factory.text({
		x: e.attr('x'),
		y: e.attr('y'),
		w: e.attr('w'),
		tint: e.attr('tint'),
		text: e.html()
	});
};
