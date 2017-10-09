
// Expects input to be a Vol object
// Returns the probability distribution of 
net: function(input) {

	net = fromJSON($.getJSON("/../json/convoNet.json")
	net.makeLayers(layer_defs);

	return net.forward(input, false)
}

