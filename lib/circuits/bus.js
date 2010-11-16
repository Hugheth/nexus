// A bus transfers packets vertically between wires and chips
nx.factory.bus = function( spec ) {
	// Get the dimensions
	this.x = spec.x;
	this.y = spec.y;
	this.h = spec.h;
	// Show the bus
	this.show = true;
	// Packets in the bus
	this.packets = [];
	// Bits of the bus
	this.bits = spec.bits || {};
	// Set object
	this.draw = $('<div class="bus"></div>');
	// Send packet
	this.send = function( pos, p ) {
		// Get the gain
		p.gain = false;
		if (pos == this.h - 1) p.gain = true;
		// Set the position
		p.pos = pos;
		// Add the packet to the bus
		this.packets.push(p);
	};
	// Get point
	this.point = function( x, y ) {
		// Check x
		if (x != this.x) return null;
		// Check y
		if (y >= this.y + this.h || y < this.y) return null;
		// Get point
		var p = [y - this.y];
		// Get bit data
		if (this.bits[y - this.y]) p.push(this.bits[y - this.y].data);
		// Return point
		return p;
	};
	// Propogate packets
	this.tick = function() {
		var i = 0, j = 0;
		// Iterate through packets and proliferate them
		while (i < this.packets.length) {
			var p = this.packets[i], d = true;
			// Check lower bound
			if (p.pos < 0 && !p.out && p.gain) {
				// Signal that the package is leaving the bus
				p.out = true;
				// Send the packet to the next circuit if there is one
				nx.sendTo(this.x, this.y - 1, {
					data: p.data,
					player: p.player,
					speed: p.speed
				});
			}
			// Check upper bound
			else if (p.pos >= this.h && !p.out && !p.gain) {
				// Signal that the package is leaving the bus
				p.out = true;
				nx.sendTo(this.x, this.y + this.h, {
					data: p.data,
					player: p.player,
					speed: p.speed
				});
			}
			// Check for completely out of bus
			else if (p.out && (p.pos < 0 || p.pos >= this.h)) {
				this.packets.splice(i, 1);
				// Continue to the next packet
				d = false;
			}
			var bit;
			// Check for collision with an interesting character
			// Get the bit the packet moves into
			bit = this.bits[p.pos];
			// Check for important bit
			if (bit && bit.act)
				false;
			// TODO move the packet's act bit
			// Check if the bus is visible
			if (this.show) {
				// Draw the first packet bit to the bus
				if (p.pos >= 0 && p.pos < this.h) {
					if (this.bits[p.pos] && this.bits[p.pos].act) {
					
					} else {
						this.bits[p.pos] = {
							html: '█',
							player: p.player,
							time: nx.time
						};
					}
				}
			}
			// Calculate the new packet position
			p.pos += (p.gain) ? -1 : 1;
			// Increment
			if (d) i++;
		}
		// String
		var html = '';
		// Update the bus
		this.update();
	};
	// Update the bus
	this.update = function( chg ) {
		// Check for visible
		if (this.show) {
			// String
			var html = '';
			var i = 0;
			var bit;
			// Iterate
			while (i < this.h) {
				bit = this.bits[i];
				// Check for current packet bit
				if (bit) {
					if (bit.act) {
						html += '<span class="tint_' + bit.player + '">' + bit.html + '</span><br/>';					
					} else if (bit.time == nx.time) {
						html += '<span class="tint_' + bit.player + ' bb">' + bit.html + '</span><br/>';
						chg = true;
					} else {
						delete this.bits[i];
						html += '¦<br/>';
						chg = true;
					}
				} else {
					html += '¦<br/>';
				}
				// Increment
				i++;
			}
			// Update the object html
			if (chg)
				this.draw.html(html);
		}
	};
};
// Create from dom
nx.factory.bus.fromDOM = function( e ) {
	// Iterate and add bits
	var bits = {};
	e.children().each(function() {
		var t = $(this);
		bits[t.attr('p')] = {
			act: true,
			player: t.attr('player'),
			html: t.html()
		};
	});
	return new nx.factory.bus({
		x: parseInt(e.attr('x')),
		y: parseInt(e.attr('y')),
		h: parseInt(e.attr('h')),
		bits: bits
	});
};
