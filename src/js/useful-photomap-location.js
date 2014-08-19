(function (useful) {

	"use strict";

	useful.Photomap_Location = function (parent) {
		this.parent = parent;
		this.object = null;
		this.interval = null;
		// add the Layer with the GPX Track
		this.point = function () {
			// if geolocation is available
			if (navigator.geolocation) {
				// request the position
				navigator.geolocation.watchPosition(
					this.onGeoSuccess(), 
					this.onGeoFailure(),
					{ maximumAge : 10000,  timeout : 5000,  enableHighAccuracy : true }
				);
			}
		};
		// redraw the pointer layer
		this.redraw = function () {
			// if geolocation is available
			if (navigator.geolocation) {
				// request the position
				navigator.geolocation.getCurrentPosition(
					this.onGeoSuccess(), 
					this.onGeoFailure(),
					{ enableHighAccuracy : true }
				);
			}
		};
		// geo location events
		this.onGeoSuccess = function () {
			var _this = this, _cfg = this.parent.cfg;
			return function (geo) {
				console.log('geolocation succeeded', geo);
				// if the marker doesn't exist yet
				if (_this.object === null) {
					// create the icon
					var icon = L.icon({
						iconUrl: _cfg.pointer,
						iconSize: [32, 32],
						iconAnchor: [16, 32]
					});
					// add the marker with the icon
					_this.object = L.marker(
						[geo.coords.latitude, geo.coords.longitude],
						{'icon': icon}
					);
					_this.object.addTo(_cfg.map.object);
				} else {
					_this.object.setLatLng([geo.coords.latitude, geo.coords.longitude]);
				}
			};
		};
		this.onGeoFailure = function () {
			var _this = this;
			return function () {
				console.log('geolocation failed');
			};
		};
	};

}(window.useful = window.useful || {}));
