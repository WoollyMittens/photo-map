<?php
/*
	name: 			imageExif
	by: 			Maurice van Creij
	description:	A simple PHP webservice to return the EXIF information of an image.
*/

	class imageExif{

		function getExif($src, $callBack)
		{
			$exif = exif_read_data("../" . $src, 0, true);
			if(isset($callBack)) echo $callBack . '(';
			echo json_encode($exif);
			if(isset($callBack)) echo ');';
		}

	}

	$image = new imageExif;
	$image->getExif(@$_REQUEST['src'], @$_REQUEST['callback']);

	// errantventure.local/~woolly/Useful/photowall/php/imageexif.php?src=img/photo_0a.jpg&callback=alert

?>
