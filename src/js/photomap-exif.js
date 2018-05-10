// extend the class
Photomap.prototype.Exif = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.load = function (url, onComplete) {
		var _this = this, path = url.split('/'), name = path[path.length - 1];
		// if the lat and lon have been cached in exifData
		if (this.config.exifData && this.config.exifData[name] && this.config.exifData[name].lat && this.config.exifData[name].lon) {
			console.log('PhotomapExif: from cached');
			// send back the stored coordinates from the exifData
			onComplete({
				'lat' : this.config.exifData[name].lat,
				'lon' : this.config.exifData[name].lon,
			});
		// else
		} else {
			console.log('PhotomapExif: using ajax');
			// retrieve the exif data of a photo
			useful.request.send({
				url : this.config.exif.replace('{src}', url),
				post : null,
				onProgress : function (reply) {
					return reply;
				},
				onFailure : function (reply) {
					return reply;
				},
				onSuccess : function (reply) {
					var json = useful.request.decode(reply.responseText);
					var latLon = _this.convert(json);
					// exifData the values
					_this.config.exifData = _this.config.exifData || {};
					_this.config.exifData[name] = json;
					// call back the values
					onComplete(latLon);
				}
			});
		}
	};

	this.convert = function (exif) {
		var deg, min, sec, lon, lat;
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
			console.log(this.config.indicator);
		}
		// return the values
		return {'lat' : lat, 'lon' : lon};
	};

};
