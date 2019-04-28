<?php

$output = "teams_output.json";
$array = [];

$file = json_decode(file_get_contents("teams.json"));
//print_r($file);
foreach($file as $objects){
  //foreach($objects as $object){
    if($objects->is_team == 1){
      echo $objects->name;
      $array[$objects->name] = $objects->id;
    }
  //}
};

print_r($array);
file_put_contents($output,json_encode($array));
 ?>

