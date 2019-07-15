// extend the class
Photomap.prototype.Location = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.object = null;
	this.interval = null;

	// METHODS

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
		var _this = this, _config = this.parent.config;
		return function (geo) {
			// if the marker doesn't exist yet
			if (_this.object === null) {
				// create the icon
				var icon = _this.config.leaflet.icon({
					iconUrl: _config.pointer,
					iconSize: [28, 28],
					iconAnchor: [14, 28]
				});
				// add the marker with the icon
				_this.object = _this.config.leaflet.marker(
					[geo.coords.latitude, geo.coords.longitude],
					{'icon': icon}
				);
				_this.object.addTo(_config.map.object);
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
