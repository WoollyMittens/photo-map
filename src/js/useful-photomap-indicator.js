(function (useful) {

	"use strict";

	useful.Photomap_Indicator = function (parent) {
		this.parent = parent;
		this.add = function () {
			var cfg = this.parent.cfg, icon, map = cfg.map, indicator = cfg.indicator;
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
			var context = this;
			return function (evt) {
				// show the indicator message in a balloon
				if (indicator.object) { indicator.object.openPopup(); }
			};
		};
		this.remove = function () {
			var cfg = this.parent.cfg, map = cfg.map, indicator = cfg.indicator;
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
			var cfg = this.parent.cfg;
			// focus the map on the indicator
			cfg.map.object.setView([cfg.indicator.lat, cfg.indicator.lon], cfg.zoom + 2);
			// call for a  redraw
			this.parent.redraw();
		};
		this.unfocus = function () {
			var cfg = this.parent.cfg;
			// focus the map on the indicator
			cfg.map.object.setView([cfg.indicator.lat, cfg.indicator.lon], cfg.zoom);
			// call for a  redraw
			this.parent.redraw();
		};
	};

}(window.useful = window.useful || {}));
