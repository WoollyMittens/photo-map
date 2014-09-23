/*
	Source:
	van Creij, Maurice (2012). "useful.photomap.js: Plots the GPS data of the photos in a slideshow on a map", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Dependencies:
	http://www.leaflet.com/
	https://github.com/mapbox/togeojson
*/

// public object
var useful = useful || {};

(function(){

	"use strict";

	useful.Photomap_Busy = function (parent) {
		this.parent = parent;
		this.setup = function () {};
		this.show = function () {};
		this.hide = function () {};
	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Photomap_Busy;
	}

})();
