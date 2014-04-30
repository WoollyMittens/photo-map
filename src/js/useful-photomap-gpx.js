(function (useful) {

	"use strict";

	useful.PhotomapGpx = function (parent) {
		this.parent = parent;
		this.load = function (oncomplete) {
			var cfg = this.parent.cfg, context = this;
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
					cfg.gpxDOM = reply.responseXML;
					cfg.geoJSON = toGeoJSON.gpx(reply.responseXML);
					// call back
					oncomplete();
					// hide the busy indicator
					context.parent.busy.hide();
				}
			});
		};
	};

}(window.useful = window.useful || {}));
