(function (useful) {

	"use strict";

	useful.Photomap_Markers = function (parent) {
		this.parent = parent;
		// add the Layer with the permanent markers
		this.add = function () {
			var name, marker, icon, cfg = this.parent.cfg;
			// get the track points from the GPX file
			var points = this.parent.gpx.coordinates();
			// for all markers
			for (name in cfg.markers) {
				if (cfg.markers.hasOwnProperty(name)) {
					marker = cfg.markers[name];
					// special markers
					switch (name) {
						case 'start' :
							marker.lon = points[0][0];
							marker.lat = points[0][1];
							break;
						case 'end' :
							marker.lon = points[points.length - 1][0];
							marker.lat = points[points.length - 1][1];
							break;
					}
					// create the icon
					icon = L.icon({
						iconUrl: marker.icon,
						iconSize: [32, 32],
						iconAnchor: [16, 32]
					});
					// add the marker with the icon
					marker.object = L.marker(
						[marker.lat, marker.lon],
						{'icon': icon}
					);
					marker.object.addTo(cfg.map.object);
					// add the popup to the marker
					marker.popup = marker.object.bindPopup(marker.description);
					// add the click handler
					marker.object.on('click', this.onMarkerClicked(marker));
				}
			}
		};
		this.onMarkerClicked = function (marker) {
			var context = this;
			return function (evt) {
				// show the marker message in a balloon
				marker.object.openPopup();
			};
		};
	};

}(window.useful = window.useful || {}));
