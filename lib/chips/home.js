// The make chip makes a packet of information
(function() {
	var cf = nx.factory.chip;
	// Make chip constructor
	cf.home = function( spec ) {
		this.x = spec.x;
		this.y = spec.y;
	}
	// The make chip prototype object
	cf.home.Proto = function() {
		var t = this;
		// Dimensions
		this.w = 13;
		this.h = 7;
		// HTML
		this.html = '<div class="chip">&nbsp; ╔═══════╗<br/>&nbsp; ║ &nbsp;<span style="text-shadow: #2b2 0px 0px 15px, #2b2 0px 5px 15px">HOME</span> ║<br/><span class="clikput ref0 only-player">o ║</span> &nbsp; &nbsp; &nbsp; <span class="clikput ref0 only-player">║ o</span><br/><span class="clikput ref0 only-player">o ║</span> &nbsp; &nbsp; &nbsp; <span class="clikput ref0 only-player">║ o</span><br/><span class="clikput ref0 only-player">o ║</span> &nbsp; &nbsp; &nbsp; <span class="clikput ref0 only-player">║ o</span><br/>&nbsp; ║ &nbsp; &nbsp; &nbsp; ║<br/>&nbsp; ╚═══════╝</div>';
		// Point - returns null as no inputs to chip
		this.point = function() { return null; };
		this.clikput_0 = function( data ) {
			if (this.player != data.player)
				return nx.error("Permission error", "Player tried to act on a chip that they didn't own", data);
			// Check for num
			if (!this.num) return false;
			this.num--;
			this.update();
			// Send packet right
			var m = nx.sendTo(this.x + 12, this.y + 1, {
				speed: 1,
				player: data.player,
				data: 'make'
			});
			return true;
		}
		this.update = function() {
			var txt;
			if (this.num > 999) txt = '---';
			else if (this.num > 99) txt = '&nbsp;' + this.num;
			else if (this.num > 9) txt = '&nbsp; ' + this.num;
			else txt = '&nbsp; &nbsp;' + this.num;
			// Get the number of packets left
			this.draw.find('.num').html(txt);
			this.html = this.draw.html();
		}
	}
	// Inherit generic chip functions
	cf.home.Proto.prototype = new cf.Proto();
	// Instance inherit prototype functions
	cf.home.prototype = new cf.home.Proto();
})();
