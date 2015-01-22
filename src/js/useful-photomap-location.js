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
useful.Photomap.prototype.Location = function (parent) {

	// PROPERTIES
	
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	this.object = null;
	this.interval = null;
	// add the Layer with the GPX Track
	this.point = function () {
		// if geolocation is available
		if (navigator.geolocation) {
			// request the position
			navigator.geolocation.watchPosition(
				this.onGeoSuccess(),
				this.onGeoFailure(),
				{ maximumAge : 10000,  timeout : 5000,  enableHighAccuracy : true }
			);
		}
	};
	// redraw the pointer layer
	this.redraw = function () {
		// if geolocation is available
		if (navigator.geolocation) {
			// request the position
			navigator.geolocation.getCurrentPosition(
				this.onGeoSuccess(),
				this.onGeoFailure(),
				{ enableHighAccuracy : true }
			);
		}
	};
	// geo location events
	this.onGeoSuccess = function () {
		var _this = this, _config = this.parent.config;
		return function (geo) {
			console.log('geolocation succeeded', geo);
			// if the marker doesn't exist yet
			if (_this.object === null) {
				// create the icon
				var icon = L.icon({
					iconUrl: _config.pointer,
					iconSize: [32, 32],
					iconAnchor: [16, 32]
				});
				// add the marker with the icon
				_this.object = L.marker(
					[geo.coords.latitude, geo.coords.longitude],
					{'icon': icon}
				);
				_this.object.addTo(_config.map.object);
			} else {
				_this.object.setLatLng([geo.coords.latitude, geo.coords.longitude]);
			}
		};
	};
	
	this.onGeoFailure = function () {
		var _this = this;
		return function () {
			console.log('geolocation failed');
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Location;
}
