<?php
$fullPath=realpath($argv[1].$argv[2] );
if(!file_exists("$fullPath". DIRECTORY_SEPARATOR ."_env.ini")){
	echo "$fullPath". DIRECTORY_SEPARATOR ."_env.ini";
	echo "It seems you haven't included env.ini file";
}else{
	copy("$fullPath". DIRECTORY_SEPARATOR ."_env.ini","$fullPath". DIRECTORY_SEPARATOR ."env.ini");
}
?>
