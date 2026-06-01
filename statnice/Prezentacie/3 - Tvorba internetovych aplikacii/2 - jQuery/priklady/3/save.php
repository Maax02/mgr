<?php
$name = $_POST["name"];
$location = $_POST["location"];
 
date_default_timezone_set('Europe/Bratislava');
$date = date('g:i:s', time());
 
echo "Time: $date; Name: $name; Location: $location";
?>