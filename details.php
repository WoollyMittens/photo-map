<!DOCTYPE html>
<html>
	<?php
		// variables
		$id = (@$_REQUEST['id']) ? @$_REQUEST['id'] : 'cowan-taffyslookout-brooklyn';
		$path = './assets/';
		$full = '/';
		$thumbnails = '/thumbnails/';
		$contents = file_get_contents($path . $id . ".html");

		// displays sections from an HTML file
		function displaySection($tag, $document)
		{
			global $contents;
			$output = split('<' . $tag . '>', $document);
			$output = $output[1];
			$output = split('</' . $tag . '>', $output);
			$output = $output[0];
			return $output;
		}

		// formal title
		$title = displaySection('h1', $contents);
		$title = strip_tags($title);

	?>
	<head>
		<meta charset="UTF-8" />
		<title>Sydney Train Walks - <?php echo $title ?></title>
		<link rel="stylesheet" href="./css/photocombi.css"/>
		<!--[if lte IE 9]>
			<meta http-equiv="imagetoolbar" content="no"/>
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
			<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
			<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
		<![endif]-->
	</head>
	<body>
		<header class="title sign train">
			<h1><a href="./">Sydney Train Walks</a></h1>
		</header>
		<header class="subtitle">
			<h2><?php echo displaySection('h1', $contents); ?></h2>
			<nav><a class="popup-opener" href="#" onclick="document.getElementsByTagName('article')[0].className='popup popup-open'; return false;">Your trip</a></nav>
		</header>
		<article class="popup popup-closed">
			<a class="popup-closer" href="#" onclick="document.getElementsByTagName('article')[0].className='popup popup-closed'; return false;">x</a>
			<?php echo displaySection('article', $contents); ?>
		</article>
		<aside>

			<!-- Cut below this -->
			<style>@import url("./css/photomap.css")</style>
			<figure id="testmap" class="photomap"></figure>
			<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
			<script src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
			<script src="./js/useful.photomap.js"></script>
			<script>
			//<!--
				<?php echo displaySection('script', $contents); ?>
				photomapSettings.gpx = '<?php echo $path . $id?>.xml';
				photomapSettings.exif = './php/imageexif.php?src=../{src}';
				photomapSettings.indicator = {
					'icon' : './img/marker-photo.png',
					'description' : 'Photo taken at this location.'
				};
				useful.photomap.start(document.getElementById('testmap'), photomapSettings);
			//-->
			</script>
			<!-- Cut above this -->

			<!-- Cut below this -->
			<style>@import url("./css/photowall.css")</style>
			<script src="../photowall/js/useful.photowall.js"></script>
			<figure id="testwall" class="photowall">
				<ul>
					<?php
						$files = scandir($path . $id);
						for ($a = 0; $a < count($files); $a++) {
							if(preg_match("/\.jpg/i", $files[$a])){
								?><li><a href="<?php echo $path . $id . $full . $files[$a]?>"><img alt="" src="<?php echo $path . $id . $thumbnails . $files[$a]?>"/></a></li><?php
							}
						}
					?>
				</ul>
			</figure>
			<script>
			//<!--
				var photowallSettings;
				photowallSettings = {
					'row' : 150,
					'orphans' : 2,
					'slice' : './php/imageslice.php?src=../{src}&width={width}&height={height}',
					'opened' : function (image, link) {
						useful.photomap.exif.load(image.getAttribute('src'), photomapSettings);
					},
					'closed' : function () {
						useful.photomap.exif.unload(photomapSettings);
					}
				};
				useful.photowall.start(document.getElementById('testwall'), photowallSettings);
			//-->
			</script>
			<!-- Cut above this -->

		</aside>
	</body>
</html>
