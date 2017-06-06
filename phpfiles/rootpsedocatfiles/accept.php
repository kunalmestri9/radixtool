<?php
$rootPath=$_SERVER['ROOTPATH'].$_REQUEST["directoryName"];
echo $rootPath;
$uploaddir = $rootPath . '/';
$uploadfile = $uploaddir . basename($_FILES['file_contents']['name']);
if (move_uploaded_file($_FILES['file_contents']['tmp_name'], $uploadfile)) {
	echo "File is valid, and was successfully uploaded.\n";
} else {
	echo "Possible file upload attack!\n";
}
?>