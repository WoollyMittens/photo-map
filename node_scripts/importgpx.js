// constants
var fs = require('fs');
var tg = require('../src/lib/togeojson.js');
var jd = require('jsdom').jsdom;
var source = './src/xml/';
var destination = './src/json/gpx-data.js';
var geojsons = {};

// generates a resize queue
var generateQueue = function () {
	// get the folder list
	var queue = [], srcPath, dstPath,
		files = fs.readdirSync(source),
		isInvisible = new RegExp('^[.]'),
		isGpx = new RegExp('.gpx$|.xml$', 'i');
	// for every file in the folder
	for (var a = 0, b = files.length; a < b; a += 1) {
		// if this isn't a bogus file
		if (isGpx.test(files[a])) {
			// add the image to the queue
			queue.push(files[a]);
		}
	}
	// truncate the queue for testing
	//queue.length = 3;
	// return the queue
	return queue.reverse();
};

// processes a GPX file into a geojson object
var parseFiles = function (queue) {
	// if the queue is not empty
	if (queue.length > 0) {
		// pick an item from the queue
		var file = queue[queue.length - 1];
		// process the item in the queue
		new fs.readFile( source + file, function (error, data) {
			if (error) {
				console.log('ERROR: ' + error);
			} else {
				// report what was done
				console.log('indexed:', source + file);
				// convert the data into xml dom
				var xml = jd(data);
				// convert the GPX into geoJson
				var geojson = toGeoJSON.gpx(xml);
				// add the geoJson object to the list
				geojsons[file.split('.')[0].toLowerCase()] = geojson;
				// remove the item from the queue
				queue.length = queue.length - 1;
				// next iteration in the queue
				parseFiles(queue);
			}
		});
	} else {
		// write the exif data to disk
		fs.writeFile(destination, 'var GpxData = ' + JSON.stringify(geojsons) + ';', function (error) {
			if (error) {
				console.log('ERROR: ' + error);
			} else {
				console.log('SAVED AS: ' + destination);
			}
		});
	}
};

// start processing the queue
parseFiles(generateQueue());
