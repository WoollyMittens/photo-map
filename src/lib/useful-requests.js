/*
	Source:
	van Creij, Maurice (2014). "useful.requests.js: A library of useful functions to ease working with AJAX and JSON.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.request = {

		// adds a random argument to the AJAX URL to bust the cache
		randomise : function (url) {
			return url.replace('?', '?time=' + new Date().getTime() + '&');
		},

		// perform all requests in a single application
		all : function (queue, results) {
			// set up storage for the results
			var _this = this, _url = queue.urls[queue.urls.length - 1], _results = results || [];
			// perform the first request in the queue
			this.send({
				url : _url,
				post : queue.post || null,
				contentType : queue.contentType || 'text/xml',
				timeout : queue.timeout || 4000,
				onTimeout : queue.onTimeout || function (reply) { return reply; },
				onProgress : function (reply) {
					// report the fractional progress of the whole queue
					queue.onProgress({});
				},
				onFailure : queue.onFailure || function (reply) { return reply; },
				onSuccess : function (reply) {
					// store the results
					_results.push({
						'url' : _url,
						'response' : reply.response,
						'responseText' : reply.responseText,
						'responseXML' : reply.responseXML,
						'status' : reply.status,
					});
					// pop one request off the queue
					queue.urls.length = queue.urls.length - 1;
					// if there are more items in the queue
					if (queue.urls.length > 0) {
						// perform the next request
						_this.all(queue, _results);
					// else
					} else {
						// trigger the success handler
						queue.onSuccess(_results);
					}
				}
			});
		},

		// create a request that is compatible with the browser
		create : function (properties) {
			var serverRequest,
				_this = this;
			// create a microsoft only xdomain request
			if (window.XDomainRequest && properties.xdomain) {
				// create the request object
				serverRequest = new XDomainRequest();
				// add the event handler(s)
				serverRequest.onload = function () { properties.onSuccess(serverRequest, properties); };
				serverRequest.onerror = function () { properties.onFailure(serverRequest, properties); };
				serverRequest.ontimeout = function () { properties.onTimeout(serverRequest, properties); };
				serverRequest.onprogress = function () { properties.onProgress(serverRequest, properties); };
			}
			// or create a standard HTTP request
			else if (window.XMLHttpRequest) {
				// create the request object
				serverRequest = new XMLHttpRequest();
				// set the optional timeout if available
				if (serverRequest.timeout) { serverRequest.timeout = properties.timeout || 0; }
				// add the event handler(s)
				serverRequest.ontimeout = function () { properties.onTimeout(serverRequest, properties); };
				serverRequest.onreadystatechange = function () { _this.update(serverRequest, properties); };
			}
			// or use the fall back
			else {
				// create the request object
				serverRequest = new ActiveXObject("Microsoft.XMLHTTP");
				// add the event handler(s)
				serverRequest.onreadystatechange = function () { _this.update(serverRequest, properties); };
			}
			// return the request object
			return serverRequest;
		},

		// perform and handle an AJAX request
		send : function (properties) {
			// add any event handlers that weren't provided
			properties.onSuccess = properties.onSuccess || function () {};
			properties.onFailure = properties.onFailure || function () {};
			properties.onTimeout = properties.onTimeout || function () {};
			properties.onProgress = properties.onProgress || function () {};
			// create the request object
			var serverRequest = this.create(properties);
			// if the request is a POST
			if (properties.post) {
				try {
					// open the request
					serverRequest.open('POST', properties.url, true);
					// set its header
					serverRequest.setRequestHeader("Content-type", properties.contentType || "application/x-www-form-urlencoded");
					// send the request, or fail gracefully
					serverRequest.send(properties.post);
				}
				catch (errorMessage) { properties.onFailure({ readyState : -1, status : -1, statusText : errorMessage }); }
			// else treat it as a GET
			} else {
				try {
					// open the request
					serverRequest.open('GET', this.randomise(properties.url), true);
					// send the request
					serverRequest.send();
				}
				catch (errorMessage) { properties.onFailure({ readyState : -1, status : -1, statusText : errorMessage }); }
			}
		},

		// regularly updates the status of the request
		update : function (serverRequest, properties) {
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
		},

		// turns a string back into a DOM object
		deserialize : function (text) {
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
		},

		// turns a json string into a JavaScript object
		decode : function (text) {
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
			// return the object
			return object;
		}

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.request;
	}

})();
