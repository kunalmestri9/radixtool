<?php
	$target_url = 'http://'.$argv[3].'/rootpsedocatfiles/index.php';
	//This needs to be the full path to the file you want to send.
	$post = array('action' => $argv[1],'directoryName'=> $argv[2]);
	//var_dump($post);
    $ch = curl_init($target_url);
	curl_setopt($ch, CURLOPT_POST,1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	$result=curl_exec ($ch);
	curl_close ($ch);
	echo $result;
?>