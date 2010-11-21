// A wire transfers packets from one place to another.
nx.factory.wire = function( spec ) {
	// Get the dimensions
	this.x = parseInt(spec.x);
	this.y = parseInt(spec.y);
	// Detect vertical
	this.vert = (spec.h > 1);
	// Length
	this.l = parseInt((this.vert) ? spec.h : spec.w);
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
		p.out = false;
		// Add the packet to the wire
		this.packets.push(p);
	};
	// Get point
	this.point = function( x, y ) {
		return (
			(this.vert) ?
				(x == this.x && y >= this.y && y < this.y + this.l)
			:
				(y == this.y && x >= this.x && x < this.x + this.l)
		);
	};
	// Get port
	this.port = function( x, y ) {
		// Check that the coordinates are a point in the wire
		if (!this.point(x, y)) return null;
		// Return the port details
		return (this.vert) ? y - this.y : x - this.x;
	};
	// Propogate packets
	this.tick = function() {
		var i = 0, j = 0;
		// Iterate through packets and proliferate them
		while (i < this.packets.length) {
			// Get packet and set exists flag to true
			var p = this.packets[i], d = true;
			// Get normalized speed
			var spd = (this.vert) ? ((p.gain) ? -1 : 1 ) : p.speed;
			// Check lower bound
			if (p.pos < 0 && !p.out && spd < 0) {
				// Signal that the package is leaving the wire
				p.out = true;
				// Send the packet to the next circuit
				if (this.vert)
					nx.sendTo(this.x, this.y - 1, p.clone());
				else
					nx.sendTo(this.x - 1, this.y, p.clone());
			}
			// Check upper bound
			else if (p.pos >= this.l && !p.out && spd > 0) {
				// Signal that the package is leaving the wire
				p.out = true;
				// Send the packet to the next circuit
				if (this.vert)
					nx.sendTo(this.x, this.y + this.l, p.clone());
				else
					nx.sendTo(this.x + this.l, this.y, p.clone());
			}
			// Check for completely out of wire
			else if (p.out && (p.pos < 0 || p.pos >= this.l)) {
				this.packets.splice(i, 1);
				// Continue to the next packet
				d = false;
			}
			var bit;
			j = Math.abs(spd) - 1;
			// Check for collision with an interesting character
			while (d && j >= 0) {
				try {
					// Get the bits moved through by the packet
					var ni;
					if (spd > 0)
						ni = p.pos - j;
					else
						ni = p.pos + j;
					bit = this.bits[ni];
					// Check for important bit
					if (bit && bit.act) {
						switch (bit.html) {
							// Down arrow
							case '▼':
							if (this.vert) {
								// Change direction
								p.gain = Math.abs(p.gain);
							} else {
								// Remove the packet from the wire
								this.packets.splice(i, 1);
								d = false;
								// Check for an object starting below this point
								nx.sendTo(this.x + ni, this.y + 1, p.clone());
							}
							break;
							// Up arrow
							case '▲':
							if (this.vert) {
								// Change direction
								p.gain = -Math.abs(p.gain);
							} else {
								// Remove the packet from the wire
								this.packets.splice(i, 1);
								d = false;
								// Check for an object starting above this point
								nx.sendTo(this.x + ni, this.y - 1, p.clone());
							}
							break;
							// Right arrow
							case '▶':
							if (!this.vert) {
								// Change direction
								p.speed = Math.abs(p.speed);
							}
							break;
							// Left arrow					
							case '◀':
							if (!this.vert) {
								// Change direction
								p.speed = -Math.abs(p.speed);
							}
							break;
						}
					}
				} catch ( e ) {}
				// Increment
				j--;
			}
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
			p.pos = p.pos + spd;
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
			if (this.vert) {
				while (i < this.l) {
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
			} else {
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
			}
			// Update the object html
			if (chg)
				this.draw.html(html);
		}
	};
};
// Create from dom
nx.factory.wire.fromDOM = function( e ) {
	// Iterate through attributes
	var l = e[0].attributes.length;
	var attr = e[0].attributes;
	var spec = {};
	for (var i = 0; i < l; i++)
		spec[attr[i].nodeName] = attr[i].nodeValue;
	// Bits
	spec.bits = {};
	// Get the bits
	e.children().each(function() {
		var t = $(this);
		spec.bits[t.attr('p')] = {
			act: true,
			player: t.attr('player'),
			html: t.html()
		};
	});
	// Return the wire
	return new nx.factory.wire(spec);
};
