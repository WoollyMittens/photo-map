/*
	Source:
	van Creij, Maurice (2012). "useful.requests.js: A library of useful functions to ease working with AJAX and JSON.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Fallbacks:
	<!--[if IE]>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var request = request || {};

	// adds a random argument to the AJAX URL to bust the cache
	request.randomise = function (url) {
		return url.replace('?', '?time=' + new Date().getTime() + '&');
	};

	// perform and handle an AJAX request
	request.send = function (properties) {
		var serverRequest;
		// create an HTTP request
		serverRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		// add the onchange handler
		serverRequest.onreadystatechange = function () {
			request.update(serverRequest, properties);
		};
		// set the optional timeout
		if (properties.timeout) {
			serverRequest.timeout = properties.timeout;
		}
		// set the optional timeout handler
		if (properties.onTimeout) {
			serverRequest.ontimeout = properties.onTimeout;
		}
		// if the request is a POST
		if (properties.post) {
			// open the request
			serverRequest.open('POST', properties.url, true);
			// set its header
			serverRequest.setRequestHeader("Content-type", properties.contentType || "application/x-www-form-urlencoded");
			//serverRequest.setRequestHeader("Content-length", properties.post.length);
			//serverRequest.setRequestHeader("Connection", "close");
			// send the request, or fail gracefully
			try { serverRequest.send(properties.post); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		// else treat it as a GET
		} else {
			// open the request
			serverRequest.open('GET', request.randomise(properties.url), true);
			// send the request
			try { serverRequest.send(); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		}
	};

	// regularly updates the status of the request
	request.update = function (serverRequest, properties) {
		// react to the status of the request
		if (serverRequest.readyState === 4) {
			switch (serverRequest.status) {
			case 200 :
				properties.onSuccess(serverRequest, properties);
				break;
			case 304 :
				properties.onSuccess(serverRequest, properties);
				break;
			case 0 :
				// check if the data is okay before accepting it
				try {
					var test = JSON.parse(serverRequest.responseText);
					properties.onSuccess(serverRequest, properties);
				} catch (e) {
					properties.onFailure(serverRequest, properties);
				}
				break;
			default :
				properties.onFailure(serverRequest, properties);
			}
		} else {
			properties.onProgress(serverRequest, properties);
		}
	};

	// turns a string back into a DOM object
	request.deserialize = function (text) {
		var parser, xmlDoc;
		// if the DOMParser exists
		if (window.DOMParser) {
			// parse the text as an XML DOM
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(text, "text/xml");
		// else assume this is Microsoft doing things differently again
		} else {
			// parse the text as an XML DOM
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(text);
		}
		// return the XML DOM object
		return xmlDoc;
	};

	// turns a json string into a JavaScript object
	request.decode = function (text) {
		var object;
		object = {};
		// if JSON.parse is available
		if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
			// use it
			object = JSON.parse(text);
		// if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			// use it
			object = jQuery.parseJSON(text);
		}
/*
		else {
			// do something desperate
			eval('object = ' + text);
		}
*/
		// return the object
		return object;
	};

	// public functions
	useful.request = useful.request || {};
	useful.request.send = request.send;
	useful.request.deserialize = request.deserialize;
	useful.request.decode = request.decode;

}(window.useful = window.useful || {}));
