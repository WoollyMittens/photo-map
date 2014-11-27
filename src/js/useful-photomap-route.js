/*
	Source:
	van Creij, Maurice (2014). "useful.photomap.js: Plots the GPS data of the photos in a slideshow on a map", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Dependencies:
	http://www.leaflet.com/
	https://github.com/mapbox/togeojson
*/

// create the constructor if needed
var useful = useful || {};
useful.Photomap = useful.Photomap || function () {};

// extend the constructor
useful.Photomap.prototype.Route = function (parent) {
	// properties
	"use strict";
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Route;
}
