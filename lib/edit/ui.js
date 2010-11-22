// The UI object creates some typical ui objects to use
(function() {
	var ui = nx.ui = {};
	// Button down
	var buttonDown = function() {
		var t = $(this);
		// Hover
		t.addClass('clk');
		// Mouse off
		var mouseup = function() {
			t.removeClass('clk');
			// Remove mouse up detection
			$('html').unbind('mouseup', mouseup);
		};
		$('html').bind('mouseup', mouseup);
	}
	// Bind functions
	$('.opt').live('mousedown', buttonDown);
	// Focus input
	$('input').live('click', function() {
		this.focus();
	});	
	// Form
	ui.form = function( title, items ) {
		// Construct the form
		var form = $('<div class="ui_form"></div>');
		// Get the items dom
		for (var i in items) {
			form.append(items[i]);
		}
		// Header and footer
		form.prepend('<b>' + title + '</b><br/>------------------------------<br/>');
		form.append('------------------------------<br/><span class="opt cancel">Cancel</span> | <span class="opt submit">Submit ▷</span>');
		// Return
		return form;
	};
	// Drop down menu
	ui.menu = function( elem, items ) {
		// Construct the menu
		var menu = $('<div class="ui_menu"></div>');
		// Get the items dom
		for (var i in items) {
			var ep = $('<div class="opt">' + items[i] + '</div>');
			// Give the item an id
			ep[0].menuId = i;
			// Append to the menu
			menu.append(ep);
		}
		// Return
		return menu;
	};
	// Show a drop down menu
	ui.showMenu = function( elem, items, click ) {
		// Create the menu
		var menu = ui.menu(elem, items);
		// Add to the game
		$('.nexus_game').append(menu);
		// Position
		var pos = elem.offset();
		// Align the menu to the element
		menu.css({
			left: pos.left,
			top: pos.top - menu.height() - 20
		});
		// Event listener
		var clk = function() {
			// Remove the menu
			menu.remove();
			// Unbind
			$('html').unbind('mousedown', clk);
		};
		menu.mousedown(function( e ) {
			e.stopPropagation();
		});
		// Click
		menu.find('.opt').click(function() {
			// Callback
			click(this.menuId);
			// Remove
			clk();
		});
		// Detect click
		$('html').bind('mousedown', clk);
		// Return the menu
		return menu;
	}
	// Input
	ui.input = function(label, value) {
		// Construct the dom
		var dom = $('<div class="ui_input control"><span class="label" readonly>' + label + '</span><input class="value" value="' + value + '"/></div>');
		// Return
		return dom;
	};
})();
