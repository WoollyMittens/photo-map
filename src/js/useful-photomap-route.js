(function (useful) {

	"use strict";

	useful.Photomap_Route = function (parent) {
		this.parent = parent;
		// add the Layer with the GPX Track
		this.plot = function () {
			var cfg = this.parent.cfg;
			// plot the geoJson object
			cfg.route = {};
			cfg.route.object = L.geoJson(cfg.gpxData, {
				style : function (feature) { return { 'color': '#ff6600', 'weight': 5, 'opacity': 0.66 }; }
			});
			cfg.route.object.addTo(cfg.map.object);
		};
		// redraw the geoJSON layer
		this.redraw = function () {
			var cfg = this.parent.cfg;
			if (cfg.route) {
				// remove the layer
				cfg.map.object.removeLayer(cfg.route.object);
				// re-add the layer
				this.plot();
			}
		};
	};

}(window.useful = window.useful || {}));
