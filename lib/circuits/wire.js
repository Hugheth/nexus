// A wire transfers packets from one place to another.
nx.factory.wire = function( spec ) {
	// Get the dimensions
	this.x = spec.x;
	this.y = spec.y;
	this.l = spec.l;
	// Show the wire
	this.show = true;
	// Packets in the wire
	this.packets = [];
	// Bits of the wire
	this.bits = spec.bits || {};
	// Set object
	this.draw = $('<div class="wire"></div>');
	// Send packet
	this.send = function( pos, p ) {
		p.pos = parseInt(pos);
		// Add the packet to the wire
		this.packets.push(p);
	};
	// Get point
	this.point = function( x, y ) {
		// Check y
		if (y != this.y) return null;
		// Check x
		if (x >= this.x + this.l || x < this.x) return null;
		// Get point
		var p = [x - this.x];
		// Get bit data
		if (this.bits[x - this.x]) p.push(this.bits[x - this.x].data);
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
			if (p.pos < 0 && !p.out && p.speed < 0) {
				// Signal that the package is leaving the wire
				p.out = true;
				// Send the packet to the next circuit
				nx.sendTo(this.x - 1, this.y, {
					data: p.data,
					player: p.player,
					speed: p.speed
				});
			}
			// Check upper bound
			else if (p.pos >= this.l && !p.out && p.speed > 0) {
				// Signal that the package is leaving the wire
				p.out = true;
				// Send the packet to the next circuit if there is one
				nx.sendTo(this.x + this.l, this.y, {
					data: p.data,
					player: p.player,
					speed: p.speed
				});
			}
			// Check for completely out of wire
			else if (p.out && (p.pos < 0 || p.pos >= this.l)) {
				this.packets.splice(i, 1);
				// Continue to the next packet
				d = false;
			}
			var bit;
			j = Math.abs(p.speed) - 1;
			// Check for collision with an interesting character
			while (d && j >= 0) {
				try {
					// Get the bits moved through by the packet
					var ni;
					if (p.speed > 0)
						ni = p.pos - j;
					else
						ni = p.pos + j;
					bit = this.bits[ni];
					// Check for important bit
					if (bit && bit.act) {
						switch (bit.html) {
							// Down arrow
							case '▼':
							// Remove the packet from the wire
							this.packets.splice(i, 1);
							d = false;
							// Check for an object starting below this point
							nx.sendTo(this.x + ni, this.y + 1, {
								data: p.data,
								player: p.player,
								speed: p.speed
							});
							break;
							// Up arrow
							case '▲':
							// Remove the packet from the wire
							this.packets.splice(i, 1);
							d = false;
							// Check for an object starting above this point
							nx.sendTo(this.x + ni, this.y - 1, {
								data: p.data,
								player: p.player,
								speed: p.speed
							});
							break;
							// Right arrow
							case '▶':
							// Change direction
							p.speed = Math.abs(p.speed);
							break;		
							// Left arrow					
							case '◀':
							// Change direction
							p.speed = -Math.abs(p.speed);
							break;
						}
//					console.log(bit.html.charCodeAt(0));
					}
				} catch ( e ) {}
				// Increment
				j--;
			}
			// TODO move the packet's act bit
			// Check if the wire is visible
			if (d && this.show) {
				// Draw the bits to the wire
				if (p.pos >= 0 && p.pos < this.l) {
					if (this.bits[p.pos] && this.bits[p.pos].act) {
					
					} else {
						this.bits[p.pos] = {
							html: '<span style="background: #0AF; color: black; -moz-box-shadow: 0px 5px 15px #0AF, 0px 0px 15px #0AF;">⚡</span>',
							player: p.player,
							time: nx.time
						};
					}
				}
			}
			// Calculate the new packet position
			p.pos = p.pos + p.speed;
			// Increment
			if (d) i++;
		}
		// Update the wire
		this.update();
	};
	// Update the wire
	this.update = function( chg ) {
		// Check for visible
		if (this.show) {
			// String
			var html = '';
			var i = 0;
			var bit;
			// Iterate
			while (i < this.l) {
				bit = this.bits[i];
				// Check for current packet bit
				if (bit) {
					if (bit.act) {
						html += '<span class="tint_' + bit.player + '">' + bit.html + '</span>';
					} else if (bit.time == nx.time) {
						html += '<span class="tint_' + bit.player + ' bb">' + bit.html + '</span>';
						chg = true;
					} else if (bit.time < nx.time) {
						// Get rate of change
						if (nx.time - bit.time == 1) {
							bit.mod = Math.floor(Math.random() * 10) + 1;
							bit.mark = Math.floor(Math.random() * 9) + 1;
						}
						// Check for change
						if ((nx.time - bit.time) % bit.mod == 1)
							bit.mark = Math.floor(Math.random() * 9) + 1;
						if (Math.random() * 20 > 19) {
							delete this.bits[i];
							html += '0';
							chg = true;
						} else {
							var l = 5 - (Math.floor((nx.time - bit.time) / 2)) % 5;
							html += '<span class="tint_' + bit.player + ' l' + l + '">' + bit.mark + '</span>';
							chg = true;
						}
					}
				} else {
					html += '0';
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
nx.factory.wire.fromDOM = function( e ) {
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
	return new nx.factory.wire({
		x: parseInt(e.attr('x')),
		y: parseInt(e.attr('y')),
		l: parseInt(e.attr('l')),
		bits: bits
	});
};
