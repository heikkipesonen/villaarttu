<?php

header('Access-Control-Allow-Origin: *');
$data = file_get_contents('https://api.instagram.com/villaarttu/media');

echo $data;
