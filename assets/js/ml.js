
// Expects input to be a Vol object
// Returns the probability distribution of 
function classify(input) {

	var net = fromJSON($.getJSON("/../json/convoNet.json"));
	net.makeLayers(layer_defs);

	return net.forward(input, false)
}

