// Level editing functionality
(function() {
	// Edit object
	nx.edit = {};
	// Pause the game
	nx.pause = true;
	// Null player
	nx.players.me = null;
	// Mode
	nx.edit.draw = null;
	// Dom ready
	$(function() {
		// Draw the editor panel
		nx.edit.draw = $('<div class="editor"><b>Nexus Version ' + nx.version + ' Editing Tools</b> | <span class="opt">new</span> <span class="opt">load</span> <span class="opt">save</span> <span class="opt">configure</span> | <span class="opt active">draw</span> <span class="opt">edit</span> <span class="opt">erase</span> | <span class="opt">actions</span> | <span class="opt">test</span> <span class="opt">publish</span></div>');
		// Active helper function
		var activ = function( e ) {
			nx.edit.draw.find('.opt').removeClass('active');
			e.addClass('active')
		}
		// Mouse listeners
		nx.edit.draw.find('.opt').mousedown(function() {
			var t = $(this);
			// Hover
			t.addClass('clk');
			// Mouse off
			var mouseup = function() {
				t.removeClass('clk');
				$('html').unbind('mouseup', mouseup);
			}
			$('html').bind('mouseup', mouseup);
		}).click(function() {
			var t = $(this);
			// Switch name
			switch(t.html()) {
				case 'draw':

				nx.edit.draw = true;
				activ(t);
				break;
				case 'edit':
				
				activ(t);
				break;
				case 'erase':
				
				activ(t);
				break;
			}
		});
		// Drag on the board
		$('html').mousedown(function( e ) {
			var drag = $('<div class="edit_drag"></div>');
			var dx = Math.floor(e.clientX / 10);
			var dy = Math.floor(e.clientY / 19);
			// Position
			drag.css({
				left: dx * 10 - 1,
				top: dy * 19 - 1
			})
			// Mousemove
			var move = function( f ) {
				// Get the size
				drag.css({
					width: Math.max((Math.floor(f.clientX / 10) - dx), 1) * 10 - 2,
					height: Math.max((Math.floor(f.clientY / 19) - dy), 1) * 19 - 2
				})
			}
			// Mouseup
			var up = function( f ) {
				// Unbind
				$('html').unbind('mousemove', move);
				$('html').unbind('mouseup', up);
				// Get the drag properites
				if (Math.max((Math.floor(f.clientX / 10) - dx), 1) == 1) {
					nx.circuit.add(
						new nx.factory.bus({
							x: dx,
							y: dy,
							h: Math.max((Math.floor(f.clientY / 19) - dy), 1)
						})
					);
				} else if (Math.max((Math.floor(f.clientY / 19) - dy), 1) == 1) {
					nx.circuit.add(
						new nx.factory.wire({
							x: dx,
							y: dy,
							l: Math.max((Math.floor(f.clientX / 10) - dx), 1)
						})
					);
				} else {}
				// Remove drag
				drag.remove();				
			};
			// Bind
			$('html').bind('mousemove', move);
			$('html').bind('mouseup', up);
			// Set 
			nx.board.append(drag);
		});
		// Add to the game
		$('.nexus_game').append(nx.edit.draw);
	});
})();



x = 42;
