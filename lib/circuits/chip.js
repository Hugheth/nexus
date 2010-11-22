// A chip recieves and outputs packets
nx.factory.chip = function( spec ) {
	// Call the type constructor
	var ins = new nx.factory.chip[spec.type](spec);
	// Add properties to the instance
	// Get the dimensions
	ins.x = parseInt(ins.x || spec.x);
	ins.y = parseInt(ins.y || spec.y);
	ins.w = parseInt(ins.w || spec.w);
	ins.h = parseInt(ins.h || spec.h);
	// Player
	ins.player = ins.player || spec.player || 0;
	// Chip is visible
	ins.show = true;
	// Packets to handle in the chip
	ins.packets = ins.packets || [];
	// Format DOM
	ins.formatHTML();
	// Return the chip
	return ins;
};
// Chip prototype
nx.factory.chip.Proto = function() {
	// Format the DOM element from the html
	this.formatHTML = function() {
		var chip = this;
		// Reset listeners
		this.draw = $(this.html);
		// Colour the chip dom
		this.draw.css('color', nx.players[this.player].tint);
		// Add event listeners to the inputs
		this.draw.find('.clikput').each(function() {
			var t = $(this);
			// Check for player ownership
			if (t.hasClass('only-player') && chip.player != nx.players.me) {
				t.removeClass('clikput');
				return;
			}
			// Mouse up and mouse down listeners
			t.mousedown(function(){
				t.addClass('clk');
			}).mouseup(function(){
				nx.sound.play('clikput_click');
				t.removeClass('clk');
			});
			// Get the reference
			var ref = this.className.match(/ref([0-9]+)/)[1];
			// Handle clikput
			t.click(function() {
				chip.share({
					type: 'clikput',
					circuit: chip,
					ref: ref,
					player: nx.players.me,
					time: nx.time
				}, t)
			});
		});
	};
	// Send a packet to the chip
	this.send = function(port, p) {
		// Port
		p.port = port;
		// Add to the packets
		this.packets.push(p);
	};
	// Share the client's clikput with network players
	this.share = function( data, elem ) {
		// Tag the clikput
		elem.addClass('wait');
		// Respond
		var respond = function( info ) {
			// Check for okay
			if (info.status != 'ok')
				return nx.net.error(info);
			// Make local
			data.local = true;
			// Stack the message
			nx.stack.add(data, data.time);
		}
		// Check for network players
		if (nx.net.game) {
			// Increase time delay
			data.time += 8;
			// Send off the data to the network players
			nx.net.share(data, respond);
		} else {
			// Increase time delay
			data.time += 2;
			// Respond by firing chip output
			respond({
				status: 'ok'
			});
		}		
	};
	// Get the point in the chip
	this.point = function( x, y ) {
		return ((x >= this.x || x < this.x + this.w) && (y >= this.y || y < this.y + this.h));
	};
	// Get a port of the chip
	this.port = function( x, y ) {
		var n = (x - this.x) + '.' + (y - this.y);
		// Check and return ports
		if (this.ports[n]) {
			return [n, this.ports[n].type];
		}
	};
	this.update = function() {};
	this.tick = function() {};
	// Remove the chip
	this.remove = function() {
		this.draw.remove();
	}
};
// Create from dom
nx.factory.chip.fromDOM = function( e ) {
	// Iterate through attributes
	var l = e[0].attributes.length;
	var attr = e[0].attributes;
	var spec = {};
	for (var i = 0; i < l; i++)
		spec[attr[i].nodeName] = attr[i].nodeValue;
	// Return the chip
	return nx.factory.chip(spec);
};
