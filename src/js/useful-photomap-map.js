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
useful.Photomap.prototype.Map = function (parent) {

	// PROPERTIES

	"use strict";
	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.setup = function () {
		var id = this.parent.element.id;
		// define the map
		this.config.map = {};
		this.config.map.object = L.map(id);
		// add the tiles
		var tileLayer = L.tileLayer(this.config.tiles, {
			attribution: this.config.credit,
			errorTileUrl: this.config.missing,
			minZoom: this.config.minZoom,
			maxZoom: this.config.maxZoom
		}).addTo(this.config.map.object);
		// if there is a local tile store, try and handle failing tiles
		if (this.config.local) {
			tileLayer.on('tileloadstart', this.onFallback(this.config.local));
		}
		// get the centre of the map
		this.bounds();
		// refresh the map after scrolling
		var _this = this;
		this.config.map.object.on('moveend', function (e) { _this.parent.redraw(); });
		this.config.map.object.on('zoomend', function (e) { _this.parent.redraw(); });
	};

	this.remove = function () {
		// ask leaflet to remove itself if available
		if (this.config.map && this.config.map.object) {
			this.config.map.object.remove();
		}
	};

	this.bounds = function () {
		var a, b, points, minLat = 999, minLon = 999, maxLat = -999, maxLon = -999;
		// for all navigation points
		points = this.parent.gpx.coordinates();
		for (a = 0 , b = points.length; a < b; a += 1) {
			minLon = (points[a][0] < minLon) ? points[a][0] : minLon;
			minLat = (points[a][1] < minLat) ? points[a][1] : minLat;
			maxLon = (points[a][0] > maxLon) ? points[a][0] : maxLon;
			maxLat = (points[a][1] > maxLat) ? points[a][1] : maxLat;
		}
		// extend the bounds a little
		minLat -= 0.01;
		minLon -= 0.01;
		maxLat += 0.01;
		maxLon += 0.01;
		// limit the bounds
		this.config.map.object.fitBounds([
			[minLat, minLon],
			[maxLat, maxLon]
		]);
		this.config.map.object.setMaxBounds([
			[minLat, minLon],
			[maxLat, maxLon]
		]);
	};

	this.beginning = function () {
		var a, b,
			points = this.parent.gpx.coordinates(),
			totLon = points[0][0] * points.length,
			totLat = points[0][1] * points.length;
		// for all navigation points
		for (a = 0 , b = points.length; a < b; a += 1) {
			totLon += points[a][0];
			totLat += points[a][1];
		}
		// average the centre
		this.config.map.centre = {
			'lon' : totLon / points.length / 2,
			'lat' : totLat / points.length / 2
		};
		// apply the centre
		this.config.map.object.setView([this.config.map.centre.lat, this.config.map.centre.lon], this.config.zoom);
		// call for a redraw
		this.parent.redraw();
	};

	this.centre = function () {
		var a, b, points,
			minLat = 999, minLon = 999, maxLat = 0, maxLon = 0, totLat = 0, totLon = 0;
		// for all navigation points
		points = this.parent.gpx.coordinates();
		for (a = 0 , b = points.length; a < b; a += 1) {
			totLon += points[a][0];
			totLat += points[a][1];
			minLon = (points[a][0] < minLon) ? points[a][0] : minLon;
			minLat = (points[a][1] < minLat) ? points[a][1] : minLat;
			maxLon = (points[a][0] > maxLon) ? points[a][0] : maxLon;
			maxLat = (points[a][1] > maxLat) ? points[a][1] : maxLat;
		}
		// average the centre
		this.config.map.centre = {
			'lon' : totLon / points.length,
			'lat' : totLat / points.length
		};
		// apply the centre
		this.config.map.object.setView([this.config.map.centre.lat, this.config.map.centre.lon], this.config.zoom);
		// call for a redraw
		this.parent.redraw();
	};

	this.onFallback = function (local) {
		return function (element) {
			var src = element.tile.getAttribute('src');
			element.tile.setAttribute('data-failed', 'false');
			element.tile.addEventListener('error', function () {
				// if this tile has not failed before
				if (element.tile.getAttribute('data-failed') === 'false') {
					// mark the element as a failure
					element.tile.setAttribute('data-failed', 'true');
					// recover the coordinates
					var parts = src.split('/'),
						length = parts.length,
						z = parseInt(parts[length - 3]),
						x =	parseInt(parts[length - 2]),
						y = parseInt(parts[length - 1]);
					// try the local source instead
					element.tile.src = local.replace('{z}', z).replace('{x}', x).replace('{y}', y);
					console.log('fallback to:', element.tile.src);
				}
			});
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photomap.Map;
}
