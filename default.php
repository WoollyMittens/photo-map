<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Sydney Train Walks - Easily accessible bushwalks using public transport</title>
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
		<?php
			// variables
			$path = './assets/';

			// displays sections from an HTML file
			function displaySection($tag, $document)
			{
				$output = split('<' . $tag . '>', $document);
				$output = $output[1];
				$output = split('</' . $tag . '>', $output);
				$output = $output[0];
				return $output;
			}
		?>
		<header class="title sign train">
			<h1><a href="./">Sydney Train Walks</a></h1>
		</header>
		<nav>
			<p>
				Don't let organising a bushwalk intimidate you. These walks are easy day trips from Sydney using public transport.
			</p>
			<menu>
				<?php
					// include all project folders in the root
					$files = scandir($path);
					for ($a = 0; $a < count($files); $a++) {
						if (!preg_match("/\./i", $files[$a])) {
							echo '<li style="background-image:url(' . $path . $files[$a] . '.jpg)"><a href="details.php?id='. $files[$a] . '">';
							$document = file_get_contents($path . $files[$a] . '.html');
							echo displaySection('h1', $document);
							echo '</a></li>';
						}
					}
				?>
			</menu>
			<p>
				Print these maps and get better ones if you come across a park's visitor centre.
				Wear sneakers or other sturdy shoes with good grip.
				Bring a few soda bottles refilled with water in a shoulder bag or backpack.
				Don't forget to charge your phone for emergencies.
				Remember to always wear sun screen and a hat, but also bring a rain coat.
			</p>
		</nav>
	</body>
</html>
