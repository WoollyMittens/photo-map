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
