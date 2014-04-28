(function (useful) {

	"use strict";

	useful.PhotomapExif = function (parent) {
		this.parent = parent;
		this.load = function (url, onComplete) {
			var cfg = this.parent.cfg, context = this;
			// TODO: if the lat and lon haven't been cached
				// retrieve the exif data of a photo
				useful.request.send({
					url : cfg.exif.replace('{src}', url),
					post : null,
					onProgress : function (reply) {
						return reply;
					},
					onFailure : function (reply) {
						return reply;
					},
					onSuccess : function (reply) {
						var json = useful.request.decode(reply.responseText);
						var latLon = context.convert(json);
						// TODO: cache the values
						// call back the values
						onComplete(latLon);
					}
				});
			// else
				// TODO: send back the store coordinates from the cache
		};
		this.convert = function (exif) {
			var deg, min, sec, lon, lat, cfg = this.parent.cfg;
			// latitude
			deg = (exif.GPS.GPSLatitude[0].match(/\//)) ?
				parseInt(exif.GPS.GPSLatitude[0].split('/')[0], 10) / parseInt(exif.GPS.GPSLatitude[0].split('/')[1], 10):
				parseInt(exif.GPS.GPSLatitude[0], 10);
			min = (exif.GPS.GPSLatitude[1].match(/\//)) ?
				parseInt(exif.GPS.GPSLatitude[1].split('/')[0], 10) / parseInt(exif.GPS.GPSLatitude[1].split('/')[1], 10):
				parseInt(exif.GPS.GPSLatitude[1], 10);
			sec = (exif.GPS.GPSLatitude[2].match(/\//)) ?
				parseInt(exif.GPS.GPSLatitude[2].split('/')[0], 10) / parseInt(exif.GPS.GPSLatitude[2].split('/')[1], 10):
				parseInt(exif.GPS.GPSLatitude[2], 10);
			lat = (deg + min / 60 + sec / 3600) * (exif.GPS.GPSLatitudeRef === "N" ? 1 : -1);
			// longitude
			deg = (exif.GPS.GPSLongitude[0].match(/\//)) ?
				parseInt(exif.GPS.GPSLongitude[0].split('/')[0], 10) / parseInt(exif.GPS.GPSLongitude[0].split('/')[1], 10):
				parseInt(exif.GPS.GPSLongitude[0], 10);
			min = (exif.GPS.GPSLongitude[1].match(/\//)) ?
				parseInt(exif.GPS.GPSLongitude[1].split('/')[0], 10) / parseInt(exif.GPS.GPSLongitude[1].split('/')[1], 10):
				parseInt(exif.GPS.GPSLongitude[1], 10);
			sec = (exif.GPS.GPSLongitude[2].match(/\//)) ?
				parseInt(exif.GPS.GPSLongitude[2].split('/')[0], 10) / parseInt(exif.GPS.GPSLongitude[2].split('/')[1], 10):
				parseInt(exif.GPS.GPSLongitude[2], 10);
			lon = (deg + min / 60 + sec / 3600) * (exif.GPS.GPSLongitudeRef === "W" ? -1 : 1);
			// temporary console report
			if (typeof(console) !== 'undefined') {
				console.log(cfg.indicator);
			}
			// return the values
			return {'lat' : lat, 'lon' : lon};
		};
	};

}(window.useful = window.useful || {}));
