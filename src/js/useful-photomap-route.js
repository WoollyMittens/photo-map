(function (useful) {

	"use strict";

	useful.PhotomapRoute = function (parent) {
		this.parent = parent;
		// add the Layer with the GPX Track
		this.plot = function () {
			var cfg = this.parent.cfg;
			// plot the geoJson object
			cfg.route = {};
			cfg.route.object = L.geoJson(cfg.geoJSON, {
				style: { 'color': '#ff6600', 'weight': 5, 'opacity': 0.66 }
			});
			cfg.route.object.addTo(cfg.map.object);
		};
	};

}(window.useful = window.useful || {}));
