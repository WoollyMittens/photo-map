/*
	Source:
	van Creij, Maurice (2014). "useful.photomap.js: Plots the GPS data of the photos in a slideshow on a map", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Dependencies:
	http://www.leaflet.com/
	https://github.com/mapbox/togeojson
*/

// establish the class
var Photomap = function (config) {

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this);
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// delete the list of elements from the clone
			delete _config.elements;
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context).init();
		}
		// return the instances
		return instances;
	};

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Photomap });
if (typeof module != 'undefined') module.exports = Photomap;

// extend the class
Photomap.prototype.Busy = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.setup = function () {};
	this.show = function () {};
	this.hide = function () {};
};

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
			// send back the stored coordinates from the exifData
			onComplete({
				'lat' : this.config.exifData[name].lat,
				'lon' : this.config.exifData[name].lon,
			});
		// else
		} else {
			console.log('PhotomapExif: ajax');
			// retrieve the exif data of a photo
			requests.send({
				url : this.config.exif.replace('{src}', url),
				post : null,
				onProgress : function (reply) {
					return reply;
				},
				onFailure : function (reply) {
					return reply;
				},
				onSuccess : function (reply) {
					var json = requests.decode(reply.responseText);
					var latLon = _this.convert(json);
					// exifData the values
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
			// call back
			oncomplete();
		// lead it from disk
		} else {
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

// extend the class
Photomap.prototype.Indicator = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.add = function (lat, lon) {
		var icon;
		var map = this.config.map;
		var indicator = this.config.indicator;
		// if the indicator has coordinates
		if (lon && lat) {
			// store the coordinates
			this.lon = lon;
			this.lat = lat;
			// remove any previous indicator
			if (this.object) {
				map.object.removeLayer(this.object);
			}
			// create the icon
			icon = this.config.leaflet.icon({
				iconUrl: this.config.indicator,
				iconSize: [28, 28],
				iconAnchor: [14, 28]
			});
			// report the location for reference
			console.log('location:', lat, lon);
			// add the marker with the icon
			this.object = this.config.leaflet.marker(
				[this.lat, this.lon],
				{'icon': icon}
			);
			this.object.addTo(map.object);
			// focus the map on the indicator
			this.focus();
		}
	};

	this.remove = function () {
		var map = this.config.map;
		// remove the indicator
		if (this.object) {
			// remove the balloon
			this.object.closePopup();
			map.object.removeLayer(this.object);
			this.object = null;
		}
		// unfocus the indicator
		this.unfocus();
	};

	this.focus = function () {
		// focus the map on the indicator
		this.config.map.object.setView([this.lat, this.lon], this.config.zoom + 2);
		// call for a  redraw
		this.parent.redraw();
	};

	this.unfocus = function () {
		// focus the map on the indicator
		this.config.map.object.setView([this.lat, this.lon], this.config.zoom);
		// call for a  redraw
		this.parent.redraw();
	};

};

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

// extend the class
Photomap.prototype.Main = function (config, context) {

	// PROPERTIES

	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS

	this.init = function () {
		var _this = this;
		// show the busy indicator
		this.busy.setup();
		// load the gpx track
		this.gpx.load(function () {
			// draw the map
			_this.map.setup();
			// plot the route
			_this.route.plot();
			// show the permanent markers
			_this.markers.add();
			// show the indicator
			_this.indicator.add();
			// start the location pointer
			_this.location.point();
		});
		// return the object
		return this;
	};

	this.redraw = function () {
		var _this = this;
		// wait for a change to redraw
		clearTimeout(this.config.redrawTimeout);
		this.config.redrawTimeout = setTimeout(function () {
			// redraw the map
			//_this.map.redraw();
			// redraw the plotted route
			_this.route.redraw();
		}, 500);
	};

	// PUBLIC

	this.indicate = function (element) {
		var _this = this,
			config = this.config,
			url = element.getAttribute('data-url') || element.getAttribute('src') || element.getAttribute('href'),
			title = element.getAttribute('data-title') || element.getAttribute('title');
		this.exif.load(url, function (coords) {
			_this.indicator.add(coords.lat, coords.lon);
		});
	};

	this.unindicate = function () {
		this.indicator.remove();
	};

	this.stop = function () {
		this.map.remove();
	};

	// CLASSES

	this.busy = new this.context.Busy(this);
	this.exif = new this.context.Exif(this);
	this.gpx = new this.context.Gpx(this);
	this.map = new this.context.Map(this);
	this.route = new this.context.Route(this);
	this.markers = new this.context.Markers(this);
	this.indicator = new this.context.Indicator(this);
	this.location = new this.context.Location(this);

	// EVENTS

	this.init();

};

// extend the class
Photomap.prototype.Map = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	this.setup = function () {
		var id = this.parent.element.id;
		// define the map
		this.config.map = {};
		this.config.map.object = this.config.leaflet.map(id);
		// add the scale
		this.config.leaflet.control.scale({imperial:false}).addTo(this.config.map.object);
		// add the tiles
		var tileLayer = this.config.leaflet.tileLayer(this.config.tiles, {
			attribution: this.config.credit,
			errorTileUrl: this.config.missing,
			minZoom: this.config.minZoom,
			maxZoom: this.config.maxZoom
		}).addTo(this.config.map.object);
		// if there is a local tile store, try and handle failing tiles
		if (this.config.local) {
			tileLayer.on('tileloadstart', this.onFallback(this.config.local));
		}
		// get the centre of the map
		this.bounds();
		// refresh the map after scrolling
		var _this = this;
		this.config.map.object.on('moveend', function (e) { _this.parent.redraw(); });
		this.config.map.object.on('zoomend', function (e) { _this.parent.redraw(); });
	};

	this.remove = function () {
		// ask leaflet to remove itself if available
		if (this.config.map && this.config.map.object) {
			this.config.map.object.remove();
		}
	};

	this.bounds = function () {
		var a, b, points, minLat = 999, minLon = 999, maxLat = -999, maxLon = -999;
		// for all navigation points
		points = this.parent.gpx.coordinates();
		for (a = 0 , b = points.length; a < b; a += 1) {
			minLon = (points[a][0] < minLon) ? points[a][0] : minLon;
			minLat = (points[a][1] < minLat) ? points[a][1] : minLat;
			maxLon = (points[a][0] > maxLon) ? points[a][0] : maxLon;
			maxLat = (points[a][1] > maxLat) ? points[a][1] : maxLat;
		}
		// extend the bounds a little
		minLat -= 0.01;
		minLon -= 0.01;
		maxLat += 0.01;
		maxLon += 0.01;
		// limit the bounds
		this.config.map.object.fitBounds([
			[minLat, minLon],
			[maxLat, maxLon]
		]);
		this.config.map.object.setMaxBounds([
			[minLat, minLon],
			[maxLat, maxLon]
		]);
	};

	this.beginning = function () {
		var a, b,
			points = this.parent.gpx.coordinates(),
			totLon = points[0][0] * points.length,
			totLat = points[0][1] * points.length;
		// for all navigation points
		for (a = 0 , b = points.length; a < b; a += 1) {
			totLon += points[a][0];
			totLat += points[a][1];
		}
		// average the centre
		this.config.map.centre = {
			'lon' : totLon / points.length / 2,
			'lat' : totLat / points.length / 2
		};
		// apply the centre
		this.config.map.object.setView([this.config.map.centre.lat, this.config.map.centre.lon], this.config.zoom);
		// call for a redraw
		this.parent.redraw();
	};

	this.centre = function () {
		var a, b, points,
			totLat = 0, totLon = 0;
		// for all navigation points
		points = this.parent.gpx.coordinates();
		for (a = 0 , b = points.length; a < b; a += 1) {
			totLon += points[a][0];
			totLat += points[a][1];
		}
		// average the centre
		this.config.map.centre = {
			'lon' : totLon / points.length,
			'lat' : totLat / points.length
		};
		// apply the centre
		this.config.map.object.setView([this.config.map.centre.lat, this.config.map.centre.lon], this.config.zoom);
		// call for a redraw
		this.parent.redraw();
	};

	this.onFallback = function (local) {
		return function (element) {
			var src = element.tile.getAttribute('src');
			element.tile.setAttribute('data-failed', 'false');
			element.tile.addEventListener('error', function () {
				// if this tile has not failed before
				if (element.tile.getAttribute('data-failed') === 'false') {
					// mark the element as a failure
					element.tile.setAttribute('data-failed', 'true');
					// recover the coordinates
					var parts = src.split('/'),
						length = parts.length,
						z = parseInt(parts[length - 3]),
						x =	parseInt(parts[length - 2]),
						y = parseInt(parts[length - 1]);
					// try the local source instead
					element.tile.src = local.replace('{z}', z).replace('{x}', x).replace('{y}', y);
					console.log('fallback to:', element.tile.src);
				}
			});
		};
	};

};

// extend the class
Photomap.prototype.Markers = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	// add the Layer with the permanent markers
	this.add = function () {
		var name, marker, icon;
		// get the track points from the GPX file
		var points = this.parent.gpx.coordinates();
		// for all markers
		var _this = this;
		this.config.markers.map(function (marker, index) {
			// disregard the waypoints with photos
			if (!marker.photo) {
				// create the icon
				icon = _this.config.leaflet.icon({
					iconUrl: _this.config.marker.replace('{type}', marker.type),
					iconSize: [28, 28],
					iconAnchor: [14, 28]
				});
				// add the marker with the icon
				marker.object = _this.config.leaflet.marker(
					[marker.lat, marker.lon],
					{'icon': icon}
				);
				marker.object.addTo(_this.config.map.object);
				// if there is a desciption
				if (marker.description) {
					// add the popup to the marker
					marker.popup = marker.object.bindPopup(marker.description);
					// add the click handler
					marker.object.on('click', _this.onMarkerClicked(marker));
				}
			}
		});
	};

	this.onMarkerClicked = function (marker) {
		var _this = this;
		return function (evt) {
			// show the marker message in a balloon
			marker.object.openPopup();
		};
	};

};

// extend the class
Photomap.prototype.Route = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

	// add the Layer with the GPX Track
	this.plot = function () {
		// plot the geoJson object
		this.config.route = {};
		this.config.route.object = this.config.leaflet.geoJson(this.config.gpxData, {
			style : function (feature) { return { 'color': '#ff6600', 'weight': 5, 'opacity': 0.66 }; }
		});
		this.config.route.object.addTo(this.config.map.object);
	};

	// redraw the geoJSON layer
	this.redraw = function () {
		if (this.config.route) {
			// remove the layer
			this.config.map.object.removeLayer(this.config.route.object);
			// re-add the layer
			this.plot();
		}
	};

};
