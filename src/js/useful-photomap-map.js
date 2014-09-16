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
			var tileLayer = L.tileLayer(cfg.tiles, {
				attribution: cfg.credit,
				errorTileUrl: cfg.missing,
				minZoom: cfg.minZoom,
				maxZoom: cfg.maxZoom
			}).addTo(cfg.map.object);
			// if there is a local tile store, try and handle failing tiles
			if (this.parent.cfg.local) {
				tileLayer.on('tileloadstart', this.onFallback(this.parent.cfg.local));
			}
			// get the centre of the map
			this.bounds();
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
		this.bounds = function () {
			var a, b, points, cfg = this.parent.cfg,
				minLat = 999, minLon = 999, maxLat = -999, maxLon = -999;
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
			cfg.map.object.fitBounds([
				[minLat, minLon],
				[maxLat, maxLon]
			]);
			cfg.map.object.setMaxBounds([
				[minLat, minLon],
				[maxLat, maxLon]
			]);
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
			var a, b, points, cfg = this.parent.cfg,
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
			cfg.map.centre = {
				'lon' : totLon / points.length,
				'lat' : totLat / points.length
			};
			// apply the centre
			cfg.map.object.setView([cfg.map.centre.lat, cfg.map.centre.lon], cfg.zoom);
			// call for a redraw
			this.parent.redraw();
		};
		this.onFallback = function (local) {
			return function (element) {
				var src = element.tile.getAttribute('src');
				element.tile.setAttribute('data-failed', 'false')
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

}(window.useful = window.useful || {}));
