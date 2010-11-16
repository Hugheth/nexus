// The net object stores all the functionality regarding the net
nx.net = {
	server: 'nexus.hugheth.com/server/'
};
// Network game
nx.net.game = false;
// Monitor network players
nx.net.monitor = false;
// Handles network connection errors
nx.net.error = function( info ) {
	nx.error('Network Error', 'Failed to connect to the network.')

};
// Scan network players for inputs
nx.net.scan = function() {
	// On server return
	var success = function() {
		// TODO
		// Call another monitor
		if (nx.net.monitor)
			setTimeout(nx.net.scan, 0);
	};
	// Ajax to the server
	$.ajax({
		url: nx.net.server + 'scan.php',
		type: 'GET',
		data: data,
		dataType: 'json',
		success: callback,
		error: nx.net.error
	});
}
// Share data with network players
nx.net.share = function( data, callback ) {
	// Ajax to the server
	$.ajax({
		url: nx.net.server + 'share.php',
		type: 'POST',
		data: data,
		dataType: 'json',
		success: callback,
		error: nx.net.error
	});
};
