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
useful.Photomap.prototype.Busy = function (parent) {

	// PROPERTIES
	
	"use strict";
	this.parent = parent;
	this.config = parent.config;

	// METHODS
	
	this.setup = function () {};
	this.show = function () {};
	this.hide = function () {};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Busy;
}
