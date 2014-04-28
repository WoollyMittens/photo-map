(function (useful) {

	"use strict";

	useful.PhotomapMarkers = function (parent) {
		this.parent = parent;
		// add the Layer with the permanent markers
		this.add = function () {
			var name, marker, icon, cfg = this.parent.cfg;
			// get the track points from the GPX file
			cfg.trackPoints = cfg.gpxDOM.getElementsByTagName('trkpt');
			// for all markers
			for (name in cfg.markers) {
				if (cfg.markers.hasOwnProperty(name)) {
					marker = cfg.markers[name];
					// special markers
					switch (name) {
						case 'start' :
							marker.lat = cfg.trackPoints[0].getAttribute('lat');
							marker.lon = cfg.trackPoints[0].getAttribute('lon');
							break;
						case 'end' :
							marker.lat = cfg.trackPoints[cfg.trackPoints.length - 1].getAttribute('lat');
							marker.lon = cfg.trackPoints[cfg.trackPoints.length - 1].getAttribute('lon');
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
