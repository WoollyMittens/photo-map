/*
	Source:
	van Creij, Maurice (2012). "useful.photomap.js: Plots the GPS data of the photos in a slideshow on a map", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="http://www.photomap.org/openlayers/photomap.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var photomap = {};
	photomap = {
		start : function (element, settings) {
			photomap.busy.setup(settings);
			photomap.gpx.load(settings);
		},
		busy : {
			setup : function (settings) {
				return settings;
			},
			show : function (settings) {
				return settings;
			},
			hide : function (settings) {
				return settings;
			}
		},
		exif : {
			load : function (src, settings) {
				// retrieve the exif data of a photo
				useful.request.send({
					url : settings.exif.replace('{src}', src),
					post : null,
					onProgress : function (reply) {
						return reply;
					},
					onFailure : function (reply) {
						return reply;
					},
					onSuccess : function (reply) {
						photomap.exif.convert(useful.request.decode(reply.responseText), settings);
					}
				});
			},
			convert : function (exif, settings) {
				var deg, min, sec;
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
				settings.indicator.lon = (deg + min / 60 + sec / 3600) * (exif.GPS.GPSLongitudeRef === "W" ? -1 : 1);
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
				settings.indicator.lat = (deg + min / 60 + sec / 3600) * (exif.GPS.GPSLatitudeRef === "N" ? 1 : -1);
				// temporary console report
				if (typeof(console) !== 'undefined') {
					console.log(settings.indicator);
				}
				// render the indicator
				photomap.indicator.add(settings);
				// focus the map on the indicator
				photomap.indicator.focus(settings);
			},
			unload : function (settings) {
				// remove the indicator
				photomap.indicator.remove(settings);
			}
		},
		gpx : {
			load : function (settings) {
				// show the busy indicator
				photomap.busy.show(settings);
				// onload
				useful.request.send({
					url : settings.gpx,
					post : null,
					onProgress : function (reply) { return reply; },
					onFailure : function (reply) { return reply; },
					onSuccess : function (reply) {
						// store the result
						settings.gpxDOM = reply.responseXML;
						// draw the map
						photomap.map.setup(settings);
						// plot the route
						photomap.route.plot(settings);
						// show the permanent markers
						photomap.markers.add(settings);
						// show the indicator
						photomap.indicator.add(settings);
						// prepare the balloon
						settings.balloon = settings.balloon || {};
						// hide the busy indicator
						photomap.busy.show(settings);
					}
				});
			}
		},
		map : {
			setup : function (settings) {
				// define the map
				settings.map = {};
				settings.map.object = new OpenLayers.Map("testmap", {
					controls: [
						new OpenLayers.Control.Navigation(),
						new OpenLayers.Control.PanZoomBar(),
						new OpenLayers.Control.LayerSwitcher(),
						new OpenLayers.Control.Attribution()
					],
					maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
					maxResolution: 156543.0399,
					numZoomLevels: 19,
					units: 'm',
					projection: new OpenLayers.Projection("EPSG:900913"),
					displayProjection: new OpenLayers.Projection("EPSG:4326")
				});
				// define the map layer
				var layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
				settings.map.object.addLayer(layerCycleMap);
				var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
				settings.map.object.addLayer(layerMapnik);
				// get the duration of the walk
				photomap.map.duration(settings);
				// get the centre of the map
				photomap.map.centre(settings);
				// centre the map on the coordinates
				settings.map.centre.lonLat = new OpenLayers.LonLat(settings.map.centre.lon, settings.map.centre.lat).transform(new OpenLayers.Projection("EPSG:4326"), settings.map.object.getProjectionObject());
				settings.map.object.setCenter(settings.map.centre.lonLat, settings.zoom);
			},
			duration : function (settings) {
				var time, start, end, points = settings.gpxDOM.getElementsByTagName('trkpt');
				// if the duration placeholder and the time markers exist
				if (settings.duration && points[0].getElementsByTagName('time').length > 0) {
					// get the start time
					time = points[0].getElementsByTagName('time')[0].firstChild.nodeValue;
					start = new Date(time);
					// if the date could not be interpreted
					if (isNaN(start)) {
						// split the string up manually as a fall back
						start = new Date(
							parseInt(time.split('-')[0], 10),
							parseInt(time.split('-')[1], 10) + 1,
							parseInt(time.split('-')[2], 10),
							parseInt(time.split('T')[1], 10),
							parseInt(time.split(':')[1], 10),
							parseInt(time.split(':')[2], 10)
						);
					}
					// get the start time
					time = points[points.length - 1].getElementsByTagName('time')[0].firstChild.nodeValue;
					end = new Date(time);
					// if the date could not be interpreted
					if (isNaN(end)) {
						// split the string up manually as a fall back
						end = new Date(
							parseInt(time.split('-')[0], 10),
							parseInt(time.split('-')[1], 10) + 1,
							parseInt(time.split('-')[2], 10),
							parseInt(time.split('T')[1], 10),
							parseInt(time.split(':')[1], 10),
							parseInt(time.split(':')[2], 10)
						);
					}
					// write the duration to the document
					settings.duration.innerHTML = (!isNaN(start)) ? Math.round((end.getTime() - start.getTime()) / 3600000, 10) + ' hours' : '- hours';
				}
			},
			centre : function (settings) {
				var a, b, points, totLat = 0, totLon = 0;
				settings.map.centre = settings.map.centre || {};
				// for all navigation points
				points = settings.gpxDOM.getElementsByTagName('trkpt');
				for (a = 0 , b = points.length; a < b; a += 1) {
					totLat += parseFloat(points[a].getAttribute('lat'));
					totLon += parseFloat(points[a].getAttribute('lon'));
				}
				// average the centre
				settings.map.centre.lat = totLat / points.length;
				settings.map.centre.lon = totLon / points.length;
			}
		},
		route : {
			// add the Layer with the GPX Track
			plot : function (settings) {
				var lgpx = new OpenLayers.Layer.Vector("route", {
					strategies: [new OpenLayers.Strategy.Fixed()],
					protocol: new OpenLayers.Protocol.HTTP({
						url: settings.gpx,
						format: new OpenLayers.Format.GPX()
					}),
					style: {strokeColor: "blue", strokeWidth: 5, strokeOpacity: 0.5},
					projection: new OpenLayers.Projection("EPSG:4326")
				});
				settings.map.object.addLayer(lgpx);
			}
		},
		markers : {
			// add the Layer with the permanent markers
			add : function (settings) {
				var marker, size, offset, icon;
				settings.markers.object = new OpenLayers.Layer.Markers("Markers");
				settings.trackPoints = settings.gpxDOM.getElementsByTagName('trkpt');
				// for all markers
				for (marker in settings.markers) {
					if (settings.markers.hasOwnProperty(marker) && marker !== 'object') {
						// special markers
						switch (marker) {
						case 'start' :
							settings.markers[marker].lat = settings.trackPoints[0].getAttribute('lat');
							settings.markers[marker].lon = settings.trackPoints[0].getAttribute('lon');
							break;
						case 'end' :
							settings.markers[marker].lat = settings.trackPoints[settings.trackPoints.length - 1].getAttribute('lat');
							settings.markers[marker].lon = settings.trackPoints[settings.trackPoints.length - 1].getAttribute('lon');
							break;
						}
						// add the marker
						size = new OpenLayers.Size(32, 32);
						offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
						icon = new OpenLayers.Icon(settings.markers[marker].icon, size, offset);
						settings.markers[marker].lonLat = new OpenLayers.LonLat(settings.markers[marker].lon, settings.markers[marker].lat).transform(new OpenLayers.Projection("EPSG:4326"), settings.map.object.getProjectionObject());
						settings.markers[marker].object = new OpenLayers.Marker(settings.markers[marker].lonLat, icon);
						photomap.markers.click(settings.markers[marker], settings);
						settings.markers.object.addMarker(settings.markers[marker].object);
					}
				}
				// add the layer to the map
				settings.map.object.addLayer(settings.markers.object);
			},
			click : function (marker, settings) {
				marker.object.events.register('mousedown', marker.object, function (evt) {
					settings.balloon.description = marker.description;
					settings.balloon.lon = marker.lon;
					settings.balloon.lat = marker.lat;
					photomap.balloon.add(settings);
					OpenLayers.Event.stop(evt);
				});
			}
		},
		indicator : {
			add : function (settings) {
				var size, offset, icon;
				// if the indicator has coordinates
				if (settings.indicator.lon && settings.indicator.lat) {
					// remove the old indicator
					photomap.indicator.remove(settings);
					// add the new indicator
					size = new OpenLayers.Size(32, 32);
					offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					icon = new OpenLayers.Icon(settings.indicator.icon, size, offset);
					settings.indicator.lonLat = new OpenLayers.LonLat(settings.indicator.lon, settings.indicator.lat).transform(new OpenLayers.Projection("EPSG:4326"), settings.map.object.getProjectionObject());
					settings.indicator.object = new OpenLayers.Marker(settings.indicator.lonLat, icon);
					photomap.markers.click(settings.indicator, settings);
					settings.markers.object.addMarker(settings.indicator.object);
				}
			},
			remove : function (settings) {
				// remove the balloon
				photomap.balloon.remove(settings);
				// remove the indicator
				if (settings.indicator.object) {
					settings.markers.object.removeMarker(settings.indicator.object);
					settings.indicator.object.destroy();
					settings.indicator.object = null;
				}
			}
		},
		balloon : {
			add : function (settings) {
				// remove the old balloon
				photomap.balloon.remove(settings);
				// add the new popup
				var myLocation = new OpenLayers.Geometry.Point(settings.balloon.lon, settings.balloon.lat).transform('EPSG:4326', 'EPSG:3857');
				var size = new OpenLayers.Size(320, 240);
				settings.balloon.object = new OpenLayers.Popup.FramedCloud(
					"Balloon",
					myLocation.getBounds().getCenterLonLat(),
					size,
					settings.balloon.description,
					null,
					true
				);
				settings.map.object.addPopup(settings.balloon.object);
				settings.balloon.object.show();
			},
			remove : function (settings) {
				// remove the balloon
				if (settings.balloon.object) {
					settings.balloon.object.destroy();
					settings.balloon.object = null;
				}
			}
		}
	};

	// public functions
	useful.request = useful.request || {};
	useful.request.send = function (properties) {
		var serverRequest;
		// create an HTTP request
		serverRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		// add the onchange handler
		serverRequest.onreadystatechange = function () {
			useful.request.update(serverRequest, properties);
		};
		// if the request is a POST
		if (properties.post) {
			// open the request
			serverRequest.open('POST', properties.url, true);
			// set its header
			serverRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			serverRequest.setRequestHeader("Content-length", properties.post.length);
			serverRequest.setRequestHeader("Connection", "close");
			// send the request, or fail gracefully
			try { serverRequest.send(properties.post); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		// else treat it as a GET
		} else {
			// open the request
			serverRequest.open('GET', properties.url, true);
			// send the request
			try { serverRequest.send(); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		}
	};
	useful.request.update = function (serverRequest, properties) {
		// react to the status of the request
		if (serverRequest.readyState === 4) {
			switch (serverRequest.status) {
			case 200 :
				properties.onSuccess(serverRequest, properties);
				break;
			case 304 :
				properties.onSuccess(serverRequest, properties);
				break;
			default :
				properties.onFailure(serverRequest, properties);
			}
		} else {
			properties.onProgress(serverRequest, properties);
		}
	};
	useful.request.decode = function (text) {
		var object;
		object = {};
		// if jQuery is available
		if (typeof jQuery !== 'undefined') {
			// use it
			object = jQuery.parseJSON(text);
		// if JSON.parse is available
		} else if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
			// use it
			object = JSON.parse(text);
		// if jsonParse is available
		} else if (typeof jsonParse !== 'undefined') {
			// use it
			object = jsonParse(text);
		// else
		} else {
			// do something desperate
			eval('object = ' + text);
		}
		// return the object
		return object;
	};

	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};
	useful.models.trim = function (string) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
		var a, b, elements;
		// validate the input
		parent = parent || document;
		input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined') ?
			input.parent.querySelectorAll(input.rule) :
			(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};

	useful.photomap = {};
	useful.photomap.start = photomap.start;
	useful.photomap.exif = {};
	useful.photomap.exif.load = photomap.exif.load;
	useful.photomap.exif.unload = photomap.exif.unload;

}(window.useful = window.useful || {}));
