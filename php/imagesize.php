<?php
/*
	name: 			imageSize
	by: 			Maurice van Creij
	description:	A simple PHP webservice to return the dimensions of an image.
*/

	class imageSize{

		var $imageWidth, $imageHeight;

		function getImage($imageSrc)
		{
			// get the image dimensions
			$imageSrc = explode(",", $imageSrc);
			for($a=0, $b=count($imageSrc); $a<$b; $a++)
			{
				list($this->imageWidth[$a], $this->imageHeight[$a]) = getimagesize("../" . $imageSrc[$a]);
			}
		}

		function writeSize($callBack)
		{
			// write the dimensions into a JSON reply
			if(isset($callBack)) echo $callBack . '(';
			echo '{x:[' . implode(',', $this->imageWidth) . '], y:[' . implode(',', $this->imageHeight) . ']}';
			if(isset($callBack)) echo ');';
		}

	}

	$image = new imageSize;
	$image->getImage(@$_REQUEST['src']);
	$image->writeSize(@$_REQUEST['callback']);

	// http://localhost/~Woolly/Useful/webservices/imagesize.php?src=img/figure_6a.jpg,img/figure_7a.jpg&callback=alert

?>
