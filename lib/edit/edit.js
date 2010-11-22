// Level editing functionality
(function() {
	// Edit object
	var ed = nx.edit = {};
	// Pause the game
	//nx.pause = true;
	// Null player
	nx.players.me = null;
	// Mode
	ed.mode = 'draw';
	// Dom
	ed.draw = null;
	ed.drag = null;
	// Dragging
	ed.dragX = 0;
	ed.dragY = 0;
	ed.dragging = false;
	// Dialog
	ed.dialog = null;
	ed.dialogOpen = false;
	// Dom reaed.dragY
	$(function() {
		// Stop music
		$('.music')[0].pause();
		// Draw the editor panel
		ed.draw = $('<div class="editor"><b>Nexus Version ' + nx.version + ' Editing Tools</b> | <span class="opt">new</span> <span class="opt">load</span> <span class="opt">save</span> <span class="opt">configure</span> | <span class="opt active">draw</span> <span class="opt">edit</span> <span class="opt">erase<x/span> | <span class="opt">actions</span> | <span class="opt">test</span> <span class="opt">publish</span></div>');
		// Active helper function
		var activ = function( e ) {
			ed.draw.find('.opt').removeClass('active');
			e.addClass('active');
		}
		// Mouse down
		ed.draw.find('.opt').click(function() {
			var t = $(this);
			// Switch name
			switch(t.html()) {
				case 'draw':
				activ(t);
				ed.mode = 'draw';
				break;
				case 'edit':
				activ(t);
				ed.mode = 'edit';
				break;
				case 'erase':
				activ(t);
				ed.mode = 'erase';
				break;
			}
		});
	
		// DRAG SELECTION //

		// Drag element
		ed.drag = $('<div class="edit_drag"></div>');
		// Set 
		nx.board.append(ed.drag);
		// On mousemove
		var move = function( e ) {
			var w = Math.floor(e.clientX / 10) - ed.dragX;
			var h = Math.floor(e.clientY / 19) - ed.dragY;
			// Check for dragging
			if (ed.dragging) {
				// Calulate the position and width
				ed.drag.css({
					left: (w < 0) ? (ed.dragX + w + 1) * 10 - 1 : ed.dragX * 10 - 1,
					top: (h < 0) ? (ed.dragY + h + 1) * 19 - 1 : ed.dragY * 19 - 1,
					width: Math.abs(w) * 10 - 2,
					height: Math.abs(h) * 19 - 2
				});
			} else {
				// Calculate the position
				ed.drag.css({
					left: Math.floor(e.clientX / 10) * 10,
					top: Math.floor(e.clientY / 19) * 19
				});
			}
		};
		// Bind mousemove
		$('html').bind('mousemove', move);
		// Drag on the board
		$('html').mousedown(function( e ) {
			// If a dialog is open then do nothing
			if (ed.dialogOpen) return;
			// Calculate the drag position
			ed.dragX = Math.floor(e.clientX / 10);
			ed.dragY = Math.floor(e.clientY / 19);
			// Remove the dialog if it exists and isn't persisant
			if (ed.dialog && !ed.dialogOpen) {
				ed.dialog.remove();
				ed.dialog = null;
			}
			// Set dragging
			ed.dragging = true;
			ed.drag.addClass('drag');
			// Position
			ed.drag.css({
				left: ed.dragX * 10 - 1,
				top: ed.dragY * 19 - 1
			});
			// Mouseup
			var up = function( f ) {
				// Unbind
				$('html').unbind('mouseup', up);
				// Drag properties
				var w = Math.floor(f.clientX / 10) - ed.dragX;
				var h = Math.floor(f.clientY / 19) - ed.dragY;
				var x = (w < 0) ? (ed.dragX + w + 1) : ed.dragX;
				var y = (h < 0) ? (ed.dragY + h + 1) : ed.dragY;
				// Consider mode of operation
				switch (ed.mode) {
					// Draw a new circuit or bit
					case 'draw':
					// Choose a new object to create
					if (Math.abs(w) < 2 && Math.abs(h) < 2) {
						// Check point
						
					} else if (Math.abs(w) < 2) {
						nx.circuit.add(
							new nx.factory.wire({
								x: x,
								y: y,
								h: Math.abs(h)
							})
						);
					} else if (Math.abs(h) < 2) {
						nx.circuit.add(
							new nx.factory.wire({
								x: x,
								y: y,
								w: Math.abs(w)
							})
						);
					} else {
						// Show the chip dialog
						ed.dialog = $('<div class="chipbox"></div>');
						// Move
						ed.dialog.css({
							left: f.clientX - 15,
							top: f.clientY - 15
						});
						// Populate dialog
						for (var i in nx.factory.chip) {
							var ch = nx.factory.chip[i];
							// Check for name
							if (ch.buildable)
								ed.dialog.append('<div class="opt">' + i + '</div>');
						}
						// On mouse down on a chip option
						var optClick = function( e ) {
							// Name
							var n = $(this).html();
							// Stop HTML from removing the dialog
							ed.dialogOpen = true;
							// Show the dialog to build the chosen chip
							ed.dialog.html(nx.factory.chip[n].build());
							// Hide the dialog
							var hideDialog = function() {
								// Hide
								ed.dialog.remove();
								ed.dialog = null;
								// Allow drag
								ed.dialogOpen = false;
							};
							// On submit, create the chip
							ed.dialog.find('.submit').click(function() {
								// Data
								var data = {
									x: x,
									y: y,
									w: w,
									h: h,
									type: n
								};
								// Pull data from the form
								ed.dialog.find('.control').each(function() {
									var t = $(this);
									// Add to data the value
									data[t.find('.label').html()] = t.find('.value').val();
								});
								// Create the circuit
								nx.circuit.add(new nx.factory.chip(data));							
								// Hide the dialog
								hideDialog();
							});
							// On cancel, hide the dialog
							ed.dialog.find('.cancel').click(hideDialog);
							// Unbind
							ed.dialog.find('.opt').unbind('mousedown', optClick);
						}
						// On click
						ed.dialog.find('.opt').bind('mousedown', optClick);
						// Add to DOM
						$('.nexus_game').append(ed.dialog);
					}
					break;
					// Remove a circuit
					case 'erase':
						nx.circuit.remove(x, y);
					break;
				}
				// Stop dragging
				ed.dragging = false;
				ed.drag.removeClass('drag');
				// Resize and re-position
				ed.drag.css({
					left: Math.floor(f.clientX / 10) * 10,
					top: Math.floor(f.clientY / 19) * 19,
					width: 8,
					height: 17
				});
			};
			// Bind mouseup
			$('html').bind('mouseup', up);
		});
		// Add to the game
		$('.nexus_game').append(ed.draw);
	});
})();
