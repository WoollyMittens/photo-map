/*
	Source:
	van Creij, Maurice (2012). "useful.photowall.js: Simple photo wall", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var photowall = {};
	photowall = {
		start : function (element, settings) {
			// store the parent node
			settings.parent = element;
			// communicate the initial state
			settings.parent.className += ' photowall-passive';
			// store the images
			settings.images = {};
			settings.images.links = element.getElementsByTagName('a');
			settings.images.objects = element.getElementsByTagName('img');
			// prepare the contents
			photowall.prepare(settings);
			// construct the spinner
			photowall.busy.build(settings);
			// if the page has already loaded
			if (document.readyState === "complete") {
				// update the display
				photowall.thumbnails.measure(settings);
				photowall.thumbnails.redraw(settings);
			} else {
				// wait for the page to load first
				useful.events.add(window, 'load', function () {
					// update the display
					photowall.thumbnails.measure(settings);
					photowall.thumbnails.redraw(settings);
				});
			}
		},
		prepare : function (settings) {
			// remove the white space
			settings.parent.innerHTML = settings.parent.innerHTML.replace(/\t|\r|\n/g, '');
			// measure the container
			settings.col = settings.parent.offsetWidth;
			settings.aspect = settings.height / settings.col;
		},
		busy : {
			build : function (settings) {
				// construct the spinner
				settings.spinner = document.createElement('div');
				settings.spinner.className = 'photowall-busy photowall-busy-passive';
				settings.parent.appendChild(settings.spinner);
			},
			show : function (settings) {
				// show the spinner
				settings.spinner.className = settings.spinner.className.replace(/-passive/gi, '-active');
			},
			hide : function (settings) {
				// hide the spinner
				settings.spinner.className = settings.spinner.className.replace(/-active/gi, '-passive');
			}
		},
		details : {
			show : function (index, settings) {
				// if the popup doesn't exist
				if (!settings.popup) {
					// show the busy indicator
					photowall.busy.show(settings);
					// create a container for the popup
					settings.popup = document.createElement('div');
					settings.popup.className = 'photowall-detail photowall-detail-passive';
					// add a close gadget
					photowall.details.addCloser(settings);
					// add the popup to the parent
					settings.parent.appendChild(settings.popup);
					// add the image
					photowall.details.addImage(index, settings);
					// show the popup
					//photowall.details.open(settings);
				}
			},
			addImage : function (index, settings) {
				var parentWidth, parentHeight, parentAspect, image, imageWidth, imageHeight, imageCaption;
				// measure the parent
				parentWidth = settings.parent.offsetWidth;
				parentHeight = settings.parent.offsetHeight;
				parentAspect = parentHeight / parentWidth;
				// based on the dimensions of the thumbnail, determine the size of the zoomed image
				if (settings.images.aspects[index] > parentAspect) {
					imageWidth = parentHeight / settings.images.aspects[index];
					imageHeight = parentHeight;
				} else {
					imageWidth = parentWidth;
					imageHeight = parentWidth * settings.images.aspects[index];
				}
				// get a possible caption
				imageCaption = settings.images.links[index].getAttribute('title') || settings.images.objects[index].getAttribute('alt');
				// build the zoomed image
				image = document.createElement('img');
				image.className = 'photowall-image';
				image.setAttribute('alt', imageCaption);
				image.onload = function () {
					photowall.details.open(settings);
				};
				// centre the zoomed image
				image.style.marginTop = Math.round((parentHeight - imageHeight) / 2) + 'px';
				// add the image to the popup
				settings.popup.appendChild(image);
				// load the image
				image.src = (settings.slice) ?
					settings.slice.replace('{src}', settings.images.links[index].getAttribute('href')).replace('{width}', Math.round(imageWidth)).replace('{height}', Math.round(imageHeight)):
					settings.images.links[index];
			},
			addCloser : function (settings) {
				var closer;
				// build a close gadget
				closer = document.createElement('a');
				closer.className = 'photowall-closer';
				closer.innerHTML = 'x';
				closer.href = '#close';
				// add the close event handler
				closer.onclick = function () {
					photowall.details.close(settings);
					return false;
				};
				// add the close gadget to the image
				settings.popup.appendChild(closer);
			},
			open : function (settings) {
				// if there is a popup
				if (settings.popup) {
					// hide the busy indicator
					photowall.busy.hide(settings);
					// reveal it
					settings.popup.className = settings.popup.className.replace(/-passive/gi, '-active');
				}
			},
			close : function (settings) {
				// if there is a popup
				if (settings.popup) {
					// trigger the opened event if available
					if (settings.closed !== null) {
						settings.closed();
					}
					// unreveal the popup
					settings.popup.className = settings.popup.className.replace(/-active/gi, '-passive');
					// and after a while
					setTimeout(function () {
						// remove it
						settings.parent.removeChild(settings.popup);
						// remove its reference
						settings.popup = null;
					}, 500);
				}
			}
		},
		thumbnails : {
			measure : function (settings) {
				var a, b;
				// for all images
				settings.images.widths = [];
				settings.images.heights = [];
				settings.images.aspects = [];
				for (a = 0 , b = settings.images.objects.length; a < b; a += 1) {
					// get its dimensions
					settings.images.widths[a] = settings.images.objects[a].offsetWidth;
					settings.images.heights[a] = settings.images.objects[a].offsetHeight;
					settings.images.aspects[a] = settings.images.heights[a] / settings.images.widths[a];
				}
			},
			redraw : function (settings) {
				var a, b, last, c, d, compatibilityWidth, proportionalWidth, subtotalWidth = 0, currentRow = [];
				// for every image
				for (a = 0 , b = settings.images.objects.length, last = b - 1; a < b; a += 1) {
					// calculate its width proportional to the given row height
					proportionalWidth = settings.row / settings.images.aspects[a];
					subtotalWidth += proportionalWidth;
					// add it to a subtotal array with the image and dimensions
					currentRow.push({
						'link' : settings.images.links[a],
						'object' : settings.images.objects[a],
						'proportionalWidth' : proportionalWidth
					});
					// if the subtotal exceeds a row's width
					if (subtotalWidth >= settings.col || a === last) {
						// if the last image sticks out too far, discard it
					//	if (subtotalWidth - settings.col > proportionalWidth / 2) {
					//		currentRow.length -= 1;
					//		subtotalWidth -= proportionalWidth;
					//		a -= 1;
					//	}
						// if this is the last row and it has less orphans than allowed
						if (a === last && currentRow.length <= settings.orphans) {
							subtotalWidth = settings.col;
						}
						// for all the entries in the subtotal array
						for (c = 0 , d = currentRow.length; c < d; c += 1) {
							// convert the estimated width to a % of the row of pixels for older browsers
							compatibilityWidth = (settings.fallback) ?
								Math.round(currentRow[c].proportionalWidth / subtotalWidth * (settings.col - 18))  + 'px':
								(currentRow[c].proportionalWidth / subtotalWidth * 100)  + '%';
							// apply the new size settings
							currentRow[c].object.style.width = compatibilityWidth;
							currentRow[c].object.style.height = 'auto';
						}
						// clear the subtotal
						currentRow = [];
						subtotalWidth = 0;
					}
					// add an event handler to the image
					photowall.thumbnails.clicked(a, settings);
				}
				// communicate the active state
				settings.parent.className = settings.parent.className.replace('-passive', '-active');
			},
			clicked : function (index, settings) {
				settings.images.objects[index].onclick = function () {
					// trigger the opened event if available
					if (settings.opened !== null) {
						settings.opened(settings.images.objects[index], settings.images.links[index]);
					}
					// open the popup
					photowall.details.show(index, settings);
					// cancel the click
					return false;
				};
			}
		}
	};

	// public functions
	useful.events = useful.events || {};
	useful.events.add = function (element, eventName, eventHandler) {
		// exceptions
		eventName = (navigator.userAgent.match(/Firefox/i) && eventName.match(/mousewheel/i)) ? 'DOMMouseScroll' : eventName;
		// prefered method
		if ('addEventListener' in element) {
			element.addEventListener(eventName, eventHandler, false);
		}
		// alternative method
		else if ('attachEvent' in element) {
			element.attachEvent('on' + eventName, function (event) { eventHandler(event); });
		}
		// desperate method
		else {
			element['on' + eventName] = eventHandler;
		}
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

	useful.photowall = {};
	useful.photowall.start = photowall.start;

}(window.useful = window.useful || {}));
