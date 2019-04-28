<?php
error_reporting(0);
//moving newly generated files
exec("mv *.html ./reports/");
exec("mv ./ICB/*.html ./reports/");
exec("mv output_waiting_longest.txt ./reports/");

//building array
$output_array = Array();

//getting waiting_longest
$file = explode("\n",file_get_contents("./reports/output_waiting_longest.txt"));
foreach ($file as $lines) {
  $line = explode(";",$lines);
  $team = $line[0];
  if($team == "Edit Teams" || $team == "All" || $team == "AIESEC" || $team == "AIESEC Experience Support Team"){continue;}
  if($team == "GEB"){ $team = "ICB/GEB"; }
  $longest_waiting = $line[1];
  if($longest_waiting == "undefined"){$longest_waiting = "0h";}
  preg_match('/[^\d]+/', $longest_waiting, $textMatch);
  preg_match('/\d+/', $longest_waiting, $numMatch);
  $text = $textMatch[0];
  $num = $numMatch[0];
  if($text == "d"){
    $longest_waiting = $num*24;
  }
  if($text == "mth"){
    $longest_waiting = $num*24*30;
  }
  if($text == "h"){
    $longest_waiting = $num;
  }
  if($text == "m"){
    $longest_waiting = 0;
  }
  $output_array[$team] = Array("longest_waiting" => $longest_waiting);
}
//getting open_conversations
$file = file_get_contents("./reports/Writing Open Conversations.html");
$doc = new DOMDocument();
$doc->loadHTML($file);
$text_block = $doc->textContent;
$text = explode("  ", $text_block);
$line = "";
$text = array_filter($text);
$new_text = Array();
foreach($text as $text_bit){
   if(preg_match('/[(A-z)|(0-9)]/', $text_bit, $matches)){
     $text_bit = preg_replace( "/\r|\n/", "", $text_bit );
     array_push($new_text,$text_bit);
   }
}
foreach ($new_text as $text_bit) {
  $text_bit = explode(" (", $text_bit);
  $team = $text_bit[0];
  if($team == "Edit Teams" || $team == "All" || $team == "AIESEC" || $team == "AIESEC Experience Support Team"){continue;}
  $open_conversations = explode(")",$text_bit[1])[0];
  $output_array[$team]["open_conversations"] = $open_conversations;
}

//getting remaining KPIs
$files = scandir("./reports");
foreach ($files as $file) {
  if($file == "." || $file == ".." || $file == "Writing Open Conversations.html" || $file == "AIESEC Experience Support Team.html" || $team == "AIESEC.html"){}
  else{
    $team = explode(".", $file)[0];
    if($team == "GEB"){ $team = "ICB/GEB"; }
    $file = file_get_contents("./reports/".$file);
    $doc = new DOMDocument();
    $doc->loadHTML($file);
    $array = array();
    $arrayIds = array();
    $text_block = $doc->textContent;
    $text = explode("  ", $text_block);
    $line = "";
    $text = array_filter($text);
    $new_text = Array();
    foreach($text as $text_bit){
       if(preg_match('/[(A-z)|(0-9)]/', $text_bit, $matches)){
         $text_bit = preg_replace( "/\r|\n/", "", $text_bit );
         array_push($new_text,$text_bit);
       }
    }
    $i = 0;
    foreach ($new_text as $text_bit) {
      if($text_bit == "Conversations participated in"){
        $output_array[$team]["conversations_participated"] = $new_text[$i+1];
      }
      if($text_bit == "Closed conversations"){
        $output_array[$team]["conversations_closed"] = $new_text[$i+1];

      }
      if($text_bit == "Median time to close"){
        $output_array[$team]["time_closed"] = $new_text[$i+1];
      }
      if($text_bit == "Conversation ratings"){
        $output_array[$team]["conversation_ratings"] = $new_text[$i+1];
      }
      if($text_bit == "Median response time"){
        $output_array[$team]["time_response"] = $new_text[$i+1];
      }
      $i++;
    }

  }
}
print_r($output_array);
$i = 0;
foreach ($output_array as $key => $value) {
  $i++;
  if($i == 1){
$date = date("d-m-Y");
    file_put_contents("report.tsv","$date\nENTITY\tCONVERSATIONS OPEN\tCONVERSATIONS PARTICIPATED IN\tSATISFACTION RATE\tFIRST MEDIAN RESPONSE RATE\tCONVERSATIONS CLOSED\tMEDIAN TIME TO CLOSE THE CONVERSATION\tLONGEST WAITING CUSTOMER\n");
    }
  //calcuating time to hours
  //let's start with median time to close
  $time_closed = explode(" ",$value["time_closed"]);
  $time_closed_new = 0;
  foreach ($time_closed as $time_closed_element) {
    if(substr($time_closed_element,-1) == "d"){
      $time_closed_new = $time_closed_new + substr($time_closed_element,0,-1)*24;
    }
    if(substr($time_closed_element,-1) == "h"){
      $time_closed_new = $time_closed_new + substr($time_closed_element,0,-1);
    }
    if(substr($time_closed_element,-1) == "m"){
      $time_closed_new = $time_closed_new + substr($time_closed_element,0,-1)/60;
    }
  }
  $time_closed_new = round($time_closed_new,1);

  $time_response = explode(" ",$value["time_response"]);
  $time_response_new = 0;
  foreach ($time_response as $time_response_element) {
    if(substr($time_response_element,-1) == "d"){
      $time_response_new = $time_response_new + substr($time_response_element,0,-1)*24;
    }
    if(substr($time_response_element,-1) == "h"){
      $time_response_new = $time_response_new + substr($time_response_element,0,-1);
    }
    if(substr($time_response_element,-1) == "m"){
      $time_response_new = $time_response_new + substr($time_response_element,0,-1)/60;
    }
  }
  $time_response_new = round($time_response_new,1);

  file_put_contents("report.tsv", "$key\t$value[open_conversations]\t$value[conversations_participated]\t$value[conversation_ratings]\t$time_response_new\t$value[conversations_closed]\t$time_closed_new\t$value[longest_waiting] \n",FILE_APPEND);
}
//exec("rm ./reports/*.html");
//exec("rm ./reports/*.txt");


?>

