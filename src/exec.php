<?php
//moving newly generated files
system("google-chrome-stable --headless --remote-debugging-port=9222 > /dev/null &");

system("node index.js");
system("pgrep chrome | xargs kill -9");

system("php exec2.php");

system("php exec3.php");

//sleep(60);

//system("php create_report.php");

?>

