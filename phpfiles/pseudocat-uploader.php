<?php
	$target_url = 'http://'.$argv[3].'/rootpsedocatfiles/accept.php';
	//This needs to be the full path to the file you want to send.
	$file_name_with_full_path = realpath("../htdocs/".$argv[1]."/pseudocat.zip");
	
	echo "\r\n".$file_name_with_full_path;
        /* curl will accept an array here too.
         * Many examples I found showed a url-encoded string instead.
         * Take note that the 'key' in the array will be the key that shows up in the
         * $_FILES array of the accept script. and the at sign '@' is required before the
         * file name.
         */
	$post = array('directoryName' => $argv[2],'file_contents'=>'@'.$file_name_with_full_path);
 
	//var_dump($post);
    $ch = curl_init($target_url);
	//curl_setopt($ch, CURLOPT_URL,);
	curl_setopt($ch, CURLOPT_POST,1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	$result=curl_exec ($ch);
	curl_close ($ch);
	echo $result;
?>