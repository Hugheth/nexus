(function() {
	// Sound
	nx.sound = {};
	// Play a sound
	nx.sound.play = function( name ) {
		// TODO check for already playing - two elements?
		// Retrieve the dom
		var s = $('.nexus_game .sound_' + name)[0];
		if (s) 
			s.play();
		else
			nx.error('Sound Error', 'The sound specified could not be found.', {name: name});
	};

})();
