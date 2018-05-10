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
