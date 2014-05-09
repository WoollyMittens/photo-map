(function (useful) {

	"use strict";

	useful.Photomap_Location = function (parent) {
		this.parent = parent;
		this.object = null;
		this.interval = null;
		// add the Layer with the GPX Track
		this.point = function () {
			var cfg = this.parent.cfg, context = this;
			// if geolocation is available
			if (navigator.geolocation) {
				// request the position
				navigator.geolocation.getCurrentPosition(function (geo) {
					// create the icon
					var icon = L.icon({
						iconUrl: cfg.pointer,
						iconSize: [32, 32],
						iconAnchor: [16, 32]
					});
					// add the marker with the icon
					context.object = L.marker(
						[geo.coords.latitude, geo.coords.longitude],
						{'icon': icon}
					);
					context.object.addTo(cfg.map.object);
					// update the pointer's location periodically
					context.interval = setInterval(function () { context.redraw(); }, 5000);
				});
			}
		};
		// redraw the pointer layer
		this.redraw = function () {
			var cfg = this.parent.cfg, context = this;
			// if geolocation is available
			if (navigator.geolocation) {
				// request the position
				navigator.geolocation.getCurrentPosition(function (geo) {
					// move the location pointer to the system's position
					context.object.setLatLng([geo.coords.latitude, geo.coords.longitude]);
				});
			}
		};
	};

}(window.useful = window.useful || {}));
