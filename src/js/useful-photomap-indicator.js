(function (useful) {

	"use strict";

	useful.PhotomapIndicator = function (parent) {
		this.parent = parent;
		this.add = function () {
			var cfg = this.parent.cfg, icon, indicator = cfg.indicator;
			// if the indicator has coordinates
			if (indicator.lon && indicator.lat) {
				// remove any previous indicator
				if (indicator.object) {
					cfg.map.object.removeLayer(indicator.object);
				}
				// create the icon
				icon = L.icon({
					iconUrl: indicator.icon,
					iconSize: [32, 32],
					iconAnchor: [16, 32]
				});
				// add the marker with the icon
				indicator.object = L.marker(
					[indicator.lat, indicator.lon],
					{'icon': icon}
				);
				indicator.object.addTo(cfg.map.object);
				// add the popup to the marker
				indicator.popup = indicator.object.bindPopup(indicator.description);
				// add the click handler
				indicator.object.on('click', this.onIndicatorClicked(indicator));
			}
		};
		this.onIndicatorClicked = function (indicator) {
			var context = this;
			return function (evt) {
				// show the indicator message in a balloon
				indicator.object.openPopup();
			};
		};
		this.remove = function () {
			var cfg = this.parent.cfg;
			// remove the balloon
			this.parent.balloon.remove();
			// remove the indicator
			if (cfg.indicator.object) {
				cfg.map.object.removeLayer(cfg.indicator.object);
				cfg.indicator.object = null;
			}
		};
		this.focus = function () {
			var cfg = this.parent.cfg;
			// focus the map on the indicator
			cfg.map.object.setView([cfg.indicator.lat, cfg.indicator.lon], cfg.zoom);
		};
	};

}(window.useful = window.useful || {}));
