# useful.photomap.js: Photo Map

Plots the GPS data of the photos in a slideshow on a map.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=useful-photomap">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/useful-photomap.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful-photomap.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
```

## How to start the script

```javascript
var photomap = new useful.Photomap().init( document.getElementById('id'), {
	'duration' : document.getElementById('duration'),
	//'tiles' : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	//'tiles' : 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
	//'tiles' : 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
	//'tiles' : 'http://4umaps.eu/{z}/{x}/{y}.png';
	'onlineTiles' : 'http://4umaps.eu/{z}/{x}/{y}.png',
	'offlineTiles' : './tiles/{z}/{x}/{y}.png',
	'gpx' : './xml/cowan-taffyslookout-brooklyn.xml',
	'gpxData' : GpxData['cowan-taffyslookout-brooklyn'],
	'exif' : 'php/imageexif.php?src=../{src}',
	'exifData' : ExifData['cowan-taffyslookout-brooklyn'],
	'pointer' : './img/marker-location.png',
	'missing' : './img/missing.png',
	'credit' : 'Maps &copy; <a href="http://www.4umaps.eu/mountain-bike-hiking-bicycle-outdoor-topographic-map.htm" target="_blank">4UMaps</a>, Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> and contributors, CC BY-SA',
	'zoom' : 13,
	'minZoom' : 10,
	'maxZoom' : 15,
	'markers' : {
		'start' : {
			'icon' : './img/marker-train.png',
			'description' : 'Transport to this location: <a href="http://131500.com.au">131500.com.au</a>'
		},
		'end' : {
			'icon' : './img/marker-train.png',
			'description' : 'Transport from this location: <a href="http://131500.com.au">131500.com.au</a>'
		}
	},
	'indicator' : {
		'icon' : './img/marker-photo.png',
		'description' : 'Photo taken at this location.'
	}
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**duration : {DOM node}** - The duration of the GPX log will be written to this HTML element.

**onlineTiles : {URL}** - The source of the map tiles when an internet connection is available.

**offlineTiles : {path}** - The source of the map tiles when no internet connection is available.

**gpx : {path}** - Path to a GPS log in GPX format.

**gpxData : {json}** - An optional cache of GPS data in the GeoJSON format.

**exif : {URL}** - Path to the web service used to read EXIF information from photos.

**exifData : {json}** - An optional cache of geolocation data taken from the EXIF information of the photos.

**pointer : {image}** - An image to use for indicating the current location.

**missing : {image}** - An image to substitute for unavailable map tiles.

**credit : {string}** - Copyright information for the map source.

**zoom : {integer}** - Starting zoom level of the map.

**minZoom : {integer}** - Lowest level of zoom for which tiles are available.

**maxZoom : {integer}** - Highest level of zoom for which tiles are available.

**start : {integer}** - The starting marker of of the GPS log.

**icon : {string}** - Path to an icon graphic for the indicator.

**description : {string}** - A description to pop up in a message balloon.

**end : {integer}** - The ending marker of of the GPS log.

**indicator : {integer}** - The marker used for indicating locations.

## How to control the script

### Indicate

```javascript
photomap.indicate(source, description);
```

Highlights and centres a specific location.

**source : {string}** - Path to an image containing EXIF information.

**description : {string}** - A description to pop up in a message balloon.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp prod` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8000/ .

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
