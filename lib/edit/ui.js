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
	// Input
	ui.input = function(label, value) {
		// Construct the dom
		var dom = $('<div class="ui_input control"><span class="label" readonly>' + label + '</span><input class="value" value="' + value + '"/></div>');
		// Return
		return dom;
	};
})();
