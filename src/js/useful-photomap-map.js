(function (useful) {

	"use strict";

	useful.Photomap_Map = function (parent) {
		this.parent = parent;
		this.setup = function () {
			var cfg = this.parent.cfg,
				id = this.parent.obj.id;
			// define the map
			cfg.map = {};
			cfg.map.object = L.map(id);
			// add the tiles
			L.tileLayer(cfg.tiles, {
				attribution: cfg.credit,
				errorTileUrl: cfg.missing,
				maxZoom: 15
			}).addTo(cfg.map.object);
			// get the centre of the map
			this.beginning();
			// refresh the map after scrolling
			var context = this;
			cfg.map.object.on('moveend', function (e) { context.parent.redraw(); });
			cfg.map.object.on('zoomend', function (e) { context.parent.redraw(); });
		};
		this.remove = function () {
			var cfg = this.parent.cfg;
			// ask leaflet to remove itself if available
			if (cfg.map && cfg.map.object) {
				cfg.map.object.remove();
			}
		};
		this.beginning = function () {
			var a, b, cfg = this.parent.cfg,
				points = this.parent.gpx.coordinates(),
				totLon = points[0][0] * points.length,
				totLat = points[0][1] * points.length;
			// for all navigation points
			for (a = 0 , b = points.length; a < b; a += 1) {
				totLon += points[a][0];
				totLat += points[a][1];
			}
			// average the centre
			cfg.map.centre = {
				'lon' : totLon / points.length / 2,
				'lat' : totLat / points.length / 2
			};
			// apply the centre
			cfg.map.object.setView([cfg.map.centre.lat, cfg.map.centre.lon], cfg.zoom);
			// call for a redraw
			this.parent.redraw();
		};
		this.centre = function () {
			var a, b, points, cfg = this.parent.cfg, totLat = 0, totLon = 0;
			// for all navigation points
			points = this.parent.gpx.coordinates();
			for (a = 0 , b = points.length; a < b; a += 1) {
				totLon += points[a][0];
				totLat += points[a][1];
			}
			// average the centre
			cfg.map.centre = {
				'lon' : totLon / points.length,
				'lat' : totLat / points.length
			};
			// apply the centre
			cfg.map.object.setView([cfg.map.centre.lat, cfg.map.centre.lon], cfg.zoom);
			// call for a redraw
			this.parent.redraw();
		};
	};

}(window.useful = window.useful || {}));
