(function (useful) {

	"use strict";

	useful.Photomap_Gpx = function (parent) {
		this.parent = parent;
		this.load = function (oncomplete) {
			var cfg = this.parent.cfg, context = this;
			// if the GPX have been cached in gpxData
			if (cfg.gpxData) {
				// call back
				oncomplete();
			// lead it from disk
			} else {
				// show the busy indicator
				parent.busy.show();
				// onload
				useful.request.send({
					url : cfg.gpx,
					post : null,
					onProgress : function () {},
					onFailure : function () {},
					onSuccess : function (reply) {
						// store the result
						cfg.gpxData = toGeoJSON.gpx(reply.responseXML);
						// call back
						oncomplete();
						// hide the busy indicator
						context.parent.busy.hide();
					}
				});
			}
		};
		this.coordinates = function () {
			var cfg = this.parent.cfg, gpx = cfg.gpxData, joined = [];
			// get the line data from the geojson file
			var geometryCoordinates = cfg.gpxData.features[0].geometry.coordinates;
			// if the line data consists of multiple segments
			if (geometryCoordinates[0][0] instanceof Array) {
				// join all the segments
				for (var a = 0, b = geometryCoordinates.length; a < b; a += 1) {
					joined = joined.concat(geometryCoordinates[a]);
				}
				// store the joined segments
				geometryCoordinates = joined;
			}
			// return the gps coordinates
			return geometryCoordinates;
		};
	};

}(window.useful = window.useful || {}));
