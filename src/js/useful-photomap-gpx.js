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
useful.Photomap.prototype.Gpx = function (parent) {

	// PROPERTIES

	"use strict";
	this.parent = parent;
	this.config = parent.config;
	// this methods
	this.load = function (oncomplete) {
		var _this = this;
		// if the GPX have been cached in gpxData
		if (this.config.gpxData) {
			console.log('PhotomapGpx: from cache');
			// call back
			oncomplete();
		// lead it from disk
		} else {
			console.log('PhotomapGpx: using ajax');
			// show the busy indicator
			parent.busy.show();
			// onload
			useful.request.send({
				url : this.config.gpx,
				post : null,
				onProgress : function () {},
				onFailure : function () {},
				onSuccess : function (reply) {
					// store the result
					_this.config.gpxData = toGeoJSON.gpx(reply.responseXML);
					// call back
					oncomplete();
					// hide the busy indicator
					_this.parent.busy.hide();
				}
			});
		}
	};

	this.coordinates = function () {
		// get the line data from the geojson file
		var features = this.config.gpxData.features, segments = [], coordinates;
		// for all features
		for (var a = 0, b = features.length; a < b; a += 1) {
			// if the coordinates come in sections
			if (features[a].geometry.coordinates[0][0] instanceof Array) {
				// flatten the sections
				coordinates = [].concat.apply([], features[a].geometry.coordinates);
			// else
			} else {
				// use the coordinates directly
				coordinates = features[a].geometry.coordinates;
			}
			// gather all the segments
			segments.push(coordinates);
		}
		// return the flattened segments
		return [].concat.apply([], segments);
	};

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Gpx;
}
