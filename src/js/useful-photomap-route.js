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

	// PROPERTIES
	
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	// add the Layer with the GPX Track
	this.plot = function () {
		// plot the geoJson object
		this.config.route = {};
		this.config.route.object = L.geoJson(this.config.gpxData, {
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Route;
}
