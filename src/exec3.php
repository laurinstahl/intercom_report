<?php
//moving newly generated files
system("google-chrome-stable --headless --remote-debugging-port=9222 > /dev/null &");
sleep(10);
system("node index3.js");
system("pgrep chrome | xargs kill -9");
system("php create_report.php");

?>

