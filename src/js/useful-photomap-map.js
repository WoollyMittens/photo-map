(function (useful) {

	"use strict";

	useful.PhotomapMap = function (parent) {
		this.parent = parent;
		this.setup = function () {
			var cfg = this.parent.cfg,
				id = this.parent.obj.id;
			// define the map
			cfg.map = {};
			cfg.map.object = L.map(id);
			// add the tiles
			L.tileLayer(cfg.tiles, {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
				maxZoom: 15
			}).addTo(cfg.map.object);
			// get the centre of the map
			this.centre();
			// get the duration of the walk
			this.duration();
			// refresh the map after scrolling
			var context = this;
			cfg.map.object.on('moveend', function (e) { context.parent.redraw(); });
			cfg.map.object.on('zoomend', function (e) { context.parent.redraw(); });
		};
		this.duration = function () {
			var time, start, end, cfg = this.parent.cfg, points = cfg.gpxDOM.getElementsByTagName('trkpt');
			// if the duration placeholder and the time markers exist
			if (cfg.duration && points[0].getElementsByTagName('time').length > 0) {
				// get the start time
				time = points[0].getElementsByTagName('time')[0].firstChild.nodeValue;
				start = new Date(time);
				// if the date could not be interpreted
				if (isNaN(start)) {
					// split the string up manually as a fall back
					start = new Date(
						parseInt(time.split('-')[0], 10),
						parseInt(time.split('-')[1], 10) + 1,
						parseInt(time.split('-')[2], 10),
						parseInt(time.split('T')[1], 10),
						parseInt(time.split(':')[1], 10),
						parseInt(time.split(':')[2], 10)
					);
				}
				// get the start time
				time = points[points.length - 1].getElementsByTagName('time')[0].firstChild.nodeValue;
				end = new Date(time);
				// if the date could not be interpreted
				if (isNaN(end)) {
					// split the string up manually as a fall back
					end = new Date(
						parseInt(time.split('-')[0], 10),
						parseInt(time.split('-')[1], 10) + 1,
						parseInt(time.split('-')[2], 10),
						parseInt(time.split('T')[1], 10),
						parseInt(time.split(':')[1], 10),
						parseInt(time.split(':')[2], 10)
					);
				}
				// write the duration to the document
				cfg.duration.innerHTML = (!isNaN(start)) ? Math.round((end.getTime() - start.getTime()) / 3600000, 10) + ' hours' : '- hours';
			}
			if (cfg.there) {
				cfg.there.innerHTML = cfg.markers.start.description;
			}
			if (cfg.back) {
				cfg.back.innerHTML = cfg.markers.end.description;
			}
		};
		this.centre = function () {
			var a, b, points, cfg = this.parent.cfg, totLat = 0, totLon = 0;
			// for all navigation points
			points = cfg.gpxDOM.getElementsByTagName('trkpt');
			for (a = 0 , b = points.length; a < b; a += 1) {
				totLat += parseFloat(points[a].getAttribute('lat'));
				totLon += parseFloat(points[a].getAttribute('lon'));
			}
			// average the centre
			cfg.map.centre = {
				'lat' : totLat / points.length,
				'lon' : totLon / points.length
			};
			// apply the centre
			cfg.map.object.setView([cfg.map.centre.lat, cfg.map.centre.lon], cfg.zoom);
			// call for a redraw
			this.parent.redraw();
		};
	};

}(window.useful = window.useful || {}));
