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
useful.Photomap.prototype.Indicator = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	// this methods
	this.add = function () {
		var cfg = this.parent.cfg, icon, map = cfg.map, indicator = cfg.indicator;
		// if the indicator has coordinates
		if (indicator.lon && indicator.lat) {
			// remove any previous indicator
			if (indicator.object) {
				map.object.removeLayer(indicator.object);
			}
			// create the icon
			icon = L.icon({
				iconUrl: indicator.icon,
				iconSize: [32, 32],
				iconAnchor: [16, 32]
			});
			// report the location for reference
			console.log('location:', indicator);
			// add the marker with the icon
			indicator.object = L.marker(
				[indicator.lat, indicator.lon],
				{'icon': icon}
			);
			indicator.object.addTo(map.object);
			// add the popup to the marker
			indicator.popup = indicator.object.bindPopup(indicator.description);
			// add the click handler
			indicator.object.on('click', this.onIndicatorClicked(indicator));
			// focus the map on the indicator
			this.focus();
		}
	};
	this.onIndicatorClicked = function (indicator) {
		var _this = this;
		return function (evt) {
			// trigger the click event
			if (indicator.clicked) { indicator.clicked(evt, indicator); }
			// or show the indicator message in a balloon
			else if (indicator.object) { indicator.object.openPopup(); }
		};
	};
	this.remove = function () {
		var cfg = this.parent.cfg, map = cfg.map, indicator = cfg.indicator;
		// remove the balloon
		indicator.object.closePopup();
		// remove the indicator
		if (indicator.object) {
			map.object.removeLayer(indicator.object);
			indicator.object = null;
		}
		// unfocus the indicator
		this.unfocus();
	};
	this.focus = function () {
		var cfg = this.parent.cfg;
		// focus the map on the indicator
		cfg.map.object.setView([cfg.indicator.lat, cfg.indicator.lon], cfg.zoom + 2);
		// call for a  redraw
		this.parent.redraw();
	};
	this.unfocus = function () {
		var cfg = this.parent.cfg;
		// focus the map on the indicator
		cfg.map.object.setView([cfg.indicator.lat, cfg.indicator.lon], cfg.zoom);
		// call for a  redraw
		this.parent.redraw();
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Indicator;
}
