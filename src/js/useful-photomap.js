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
useful.Photomap.prototype.init = function (cfg) {
	// properties
	"use strict";
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		var _this = this;
		// show the busy indicator
		this.busy.setup();
		// load the gpx track
		this.gpx.load(function () {
			// draw the map
			_this.map.setup();
			// plot the route
			_this.route.plot();
			// show the permanent markers
			_this.markers.add();
			// show the indicator
			_this.indicator.add();
			// start the location pointer
			_this.location.point();
		});
		// disable the start function so it can't be started twice
		this.start = function () {};
	};
	this.redraw = function () {
		var _this = this;
		// wait for a change to redraw
		clearTimeout(this.cfg.redrawTimeout);
		this.cfg.redrawTimeout = setTimeout(function () {
			// redraw the map
			_this.route.redraw();
			// redraw the plotted route
			_this.route.redraw();
		}, 500);
	};
	// components
	this.busy = new this.Busy(this);
	this.exif = new this.Exif(this);
	this.gpx = new this.Gpx(this);
	this.map = new this.Map(this);
	this.route = new this.Route(this);
	this.markers = new this.Markers(this);
	this.indicator = new this.Indicator(this);
	this.location = new this.Location(this);
	// public API
	this.indicate = function (element) {
		var _this = this,
			cfg = this.cfg,
			url = element.getAttribute('data-url') || element.getAttribute('src') || element.getAttribute('href'),
			title = element.getAttribute('data-title') || element.getAttribute('title');
		this.exif.load(url, function (coords) {
			cfg.indicator.lat = coords.lat;
			cfg.indicator.lon = coords.lon;
			_this.indicator.add();
		});
	};
	this.unindicate = function () {
		this.indicator.remove();
	};
	this.stop = function () {
		this.map.remove();
	};
	// go
	this.start();
	return this;
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap;
}
