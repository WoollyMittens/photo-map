// extend the class
Photomap.prototype.Route = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	// add the Layer with the GPX Track
	this.plot = function () {
		// plot the geoJson object
		this.config.route = {};
		this.config.route.object = this.config.leaflet.geoJson(this.config.gpxData, {
			style : function (feature) { return { 'color': '#ff6600', 'weight': 5, 'opacity': 0.66 }; }
		});
		this.config.route.object.addTo(this.config.map.object);
	};

	// redraw the geoJSON layer
	this.redraw = function () {
		if (this.config.route) {
			// remove the layer
			this.config.map.object.removeLayer(this.config.route.object);
			// re-add the layer
			this.plot();
		}
	};

};
