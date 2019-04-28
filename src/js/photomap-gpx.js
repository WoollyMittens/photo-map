// extend the class
Photomap.prototype.Gpx = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.load = function (oncomplete) {
		var _this = this;
		// if the GPX have been cached in gpxData
		if (this.config.gpxData) {
			console.log('PhotomapGpx: from cache');
			// call back
			oncomplete();
		// lead it from disk
		} else {
			console.log('PhotomapGpx: using ajax');
			// show the busy indicator
			parent.busy.show();
			// onload
			requests.send({
				url : this.config.gpx,
				post : null,
				onProgress : function () {},
				onFailure : function () {},
				onSuccess : function (reply) {
					// store the result
					_this.config.gpxData = _this.config.togeojson.gpx(reply.responseXML);
					// call back
					oncomplete();
					// hide the busy indicator
					_this.parent.busy.hide();
				}
			});
		}
	};

	this.coordinates = function () {
		// get the line data from the geojson file
		var features = this.config.gpxData.features, segments = [], coordinates;
		// for all features
		for (var a = 0, b = features.length; a < b; a += 1) {
			// if the coordinates come in sections
			if (features[a].geometry.coordinates[0][0] instanceof Array) {
				// flatten the sections
				coordinates = [].concat.apply([], features[a].geometry.coordinates);
			// else
			} else {
				// use the coordinates directly
				coordinates = features[a].geometry.coordinates;
			}
			// gather all the segments
			segments.push(coordinates);
		}
		// return the flattened segments
		return [].concat.apply([], segments);
	};

};
