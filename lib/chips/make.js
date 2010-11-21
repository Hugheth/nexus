// The make chip makes a packet of information
(function() {
	var cf = nx.factory.chip;
	// Make chip constructor
	cf.make = function( spec ) {
		var t = this;
		// Position
		this.x = spec.x;
		this.y = spec.y;
		// Number of packets remaining
		this.num = spec.num;
		// Speed
		this.speed = spec.speed;
		// Rate of produce
		this.rate = spec.rate;
		// Chance of produce
		this.chance = spec.chance;
		// Random number
		this.rand = new nx.random(spec.seed || Math.random() * 10000);
		// Spawn packets
		var spawn = function() {
			// Clear interval if finished
			if (!t.num) {
				clearInterval(t.timer);
				return false;
			}
			// Get random
			if (t.rand.next() * 100 > t.chance) return false;
			nx.stack.add({
				type: 'clikput',
				circuit: nx.circuits[t.x + '.' + t.y],
				player: 0,
				ref: '0'
			}, nx.time + 1);
			return true;
		}
		// Timer
		if (this.rate)
			this.timer = setInterval(spawn, this.rate * 100);
	}
	// The make chip prototype object
	cf.make.Proto = function() {
		var t = this;
		// Dimensions
		this.w = 11;
		this.h = 3;
		// HTML
		this.html = '<div class="chip">╔═══════╗<br/>║ &nbsp;<span style="text-shadow: #0af 0px 0px 15px, #0af 0px 5px 15px">MAKE</span> <span class="clikput ref0 only-player">║ ▷</span><br/>║ &nbsp;<span class="num"></span> ║<br/>╚═══════╝</div>';
		// Port - returns null as no inputs to chip
		this.port = function() { return null; };
		this.clikput_0 = function( data ) {
			if (this.player != data.player)
				return nx.error("Permission error", "Player tried to act on a chip that they didn't own", data);
			// Check for num
			if (this.num < 1) return;
			// Decrement if small enough
			if (this.num < 1000) this.num--;
			this.update();
			// Send packet right
			var m = nx.sendTo(this.x + 11, this.y + 1, {
				speed: 1,
				player: data.player,
				data: 'make',
				clone: function() {
					var n = {};
					for (var i in this) {
						n[i] = this[i];
					}
					return n;
				}
			});
			return true;
		};
		// Update the chip DOM
		this.update = function() {
			var txt;
			if (this.num > 999) txt = '&nbsp;&nbsp; ∞';
			else if (this.num > 99) txt = '&nbsp;' + this.num;
			else if (this.num > 9) txt = '&nbsp; ' + this.num;
			else txt = '&nbsp; &nbsp;' + this.num;
			// Get the number of packets left
			this.draw.find('.num').html(txt);
			this.html = this.draw.html();
		};
	}
	// Buildable
	cf.make.buildable = true;
	// Build
	cf.make.build = function() {
		return nx.ui.form('make :: Options', [
			nx.ui.input('player', 0),
			nx.ui.input('chance', 100),
			nx.ui.input('rate', 50),
			nx.ui.input('seed', 0),
			nx.ui.input('num', 1000)
		]);
	};
	// Inherit generic chip functions
	cf.make.Proto.prototype = new cf.Proto();
	// Instance inherit prototype functions
	cf.make.prototype = new cf.make.Proto();
})();
