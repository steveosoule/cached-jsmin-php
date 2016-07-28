<?php

header('Content-type: application/javascript');

require('JSMin.php');

$dest_file = 'cached.min.js';
$dest_file_mtime = file_exists($dest_file) ? filemtime($dest_file) : 0;
$dest_file_content = '';

$source_js_files = array(
	'jquery.min.js',
	'jquery.slick.min.js',
	'modernizr.min.js',
	'plugins.js',
	'mvscreen.js'
);

$source_files_modified = FALSE;
foreach($source_js_files as $file)
{
	if( filemtime( $file ) > $dest_file_mtime ){
		$source_files_modified = TRUE;
		break;
	}
}

if( $source_files_modified )
{
	foreach($source_js_files as $file)
	{
		$content = file_get_contents($file);
		$dest_file_content .= JSMin::minify($content);
	}
	$result = file_put_contents($dest_file, $dest_file_content);
	echo $dest_file_content;
}
else
{
	readfile( $dest_file );
}

?>