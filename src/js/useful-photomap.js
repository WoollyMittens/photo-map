/*
	Source:
	van Creij, Maurice (2012). "useful.photomap.js: Plots the GPS data of the photos in a slideshow on a map", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Dependencies:
	http://www.leaflet.com/
	https://github.com/mapbox/togeojson
*/

(function (useful) {

	"use strict";

	useful.Photomap = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			var context = this;
			// show the busy indicator
			this.busy.setup();
			// load the gpx track
			this.gpx.load(function () {
				// draw the map
				context.map.setup();
				// plot the route
				context.route.plot();
				// show the permanent markers
				context.markers.add();
				// show the indicator
				context.indicator.add();
			});
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		this.redraw = function () {
			var context = this;
			// wait for a change to redraw
			clearTimeout(this.cfg.redrawTimeout);
			this.cfg.redrawTimeout = setTimeout(function () {
				// redraw the map
				context.route.redraw();
				// redraw the plotted route
				context.route.redraw();
			}, 500);
		};
		// components
		this.busy = new useful.PhotomapBusy(this);
		this.exif = new useful.PhotomapExif(this);
		this.gpx = new useful.PhotomapGpx(this);
		this.map = new useful.PhotomapMap(this);
		this.route = new useful.PhotomapRoute(this);
		this.markers = new useful.PhotomapMarkers(this);
		this.indicator = new useful.PhotomapIndicator(this);
		// public API
		this.indicate = function (element) {
			var context = this,
				cfg = this.cfg,
				url = element.getAttribute('data-url') || element.getAttribute('src') || element.getAttribute('href'),
				title = element.getAttribute('data-title') || element.getAttribute('title');
			this.exif.load(url, function (coords) {
				cfg.indicator.description = title;
				cfg.indicator.lat = coords.lat;
				cfg.indicator.lon = coords.lon;
				context.indicator.add();
			});
		};
		this.unindicate = function () {
			this.indicator.remove();
		};
		// go
		this.start();
	};

}(window.useful = window.useful || {}));
