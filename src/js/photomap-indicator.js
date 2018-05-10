// extend the class
Photomap.prototype.Indicator = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.add = function () {
		var icon, map = this.config.map, indicator = this.config.indicator;
		// if the indicator has coordinates
		if (indicator.lon && indicator.lat) {
			// remove any previous indicator
			if (indicator.object) {
				map.object.removeLayer(indicator.object);
			}
			// create the icon
			icon = L.icon({
				iconUrl: indicator.icon,
				iconSize: [32, 32],
				iconAnchor: [16, 32]
			});
			// report the location for reference
			console.log('location:', indicator);
			// add the marker with the icon
			indicator.object = L.marker(
				[indicator.lat, indicator.lon],
				{'icon': icon}
			);
			indicator.object.addTo(map.object);
			// add the popup to the marker
			indicator.popup = indicator.object.bindPopup(indicator.description);
			// add the click handler
			indicator.object.on('click', this.onIndicatorClicked(indicator));
			// focus the map on the indicator
			this.focus();
		}
	};

	this.onIndicatorClicked = function (indicator) {
		var _this = this;
		return function (evt) {
			// trigger the click event
			if (indicator.clicked) { indicator.clicked(evt, indicator); }
			// or show the indicator message in a balloon
			else if (indicator.object) { indicator.object.openPopup(); }
		};
	};

	this.remove = function () {
		var map = this.config.map, indicator = this.config.indicator;
		// remove the balloon
		indicator.object.closePopup();
		// remove the indicator
		if (indicator.object) {
			map.object.removeLayer(indicator.object);
			indicator.object = null;
		}
		// unfocus the indicator
		this.unfocus();
	};

	this.focus = function () {
		// focus the map on the indicator
		this.config.map.object.setView([this.config.indicator.lat, this.config.indicator.lon], this.config.zoom + 2);
		// call for a  redraw
		this.parent.redraw();
	};

	this.unfocus = function () {
		// focus the map on the indicator
		this.config.map.object.setView([this.config.indicator.lat, this.config.indicator.lon], this.config.zoom);
		// call for a  redraw
		this.parent.redraw();
	};

};
