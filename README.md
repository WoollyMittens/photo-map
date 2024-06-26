# photomap.js: Photo Map

*DEPRICATION WARNING: the functionality in this script is now part of [useful-localmap](https://github.com/WoollyMittens/useful-localmap).*

Plots the GPS data of the photos in a slideshow on a map.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/photomap.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/requests.js"></script>
<script src="lib/togeojson.js"></script>
<script src="lib/leaflet-src.js"></script>
<script src="data/exif-data.js"></script>
<script src="data/gpx-data.js"></script>
<script src="js/photomap.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	"js/photomap.js",
	"lib/requests.js",
	"lib/leaflet-src.js",
	"lib/togeojson.js",
	"data/exif-data.js",
	"data/gpx-data.js"
], function(Photomap, requests, Leaflet, toGeoJSON, ExifData, GpxData) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {Leaflet} from "lib/leaflet-src.js";
@import {requests} from "lib/requests.js";
@import {toGeoJSON} from "lib/togeojson.js";
@import {ExifData} from "data/exif-data.js";
@import {GpxData} from "data/gpx-data.js";
@import {Photomap} from "js/photomap.js";
```

## How to start the script

```javascript
var photomap = new Photomap({
	'element' : document.getElementById('id'),
	'duration' : document.getElementById('duration'),
	//'tiles' : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	//'tiles' : 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
	//'tiles' : 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
	//'tiles' : 'http://4umaps.eu/{z}/{x}/{y}.png';
	'onlineTiles' : 'http://4umaps.eu/{z}/{x}/{y}.png',
	'offlineTiles' : './tiles/{z}/{x}/{y}.png',
	'gpx' : './xml/cowan-taffyslookout-brooklyn.xml',
	'gpxData' : GpxData['cowan-taffyslookout-brooklyn'],
	'exif' : 'php/imageexif.php?src={src}',
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
photomap.indicate(element);
```

Highlights and centres a specific location.

**element : {DOM node}** - Reference to a link or image for which EXIF geolocation data is available.

### Unindicate

```javascript
photomap.unindicate(element);
```

Reset the map after "indicate" was used.

## How to build the script

This project uses leaflet.js from http://leafletjs.com/

This project uses node.js from http://nodejs.org/

The following commands are available for development:
+ `node node_scripts/importexif.js` - Imports EXIF data and creates a JSON cache file.
+ `node node_scripts/importgpx.js` - Imports GPS data and creates a JSON cache file.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
