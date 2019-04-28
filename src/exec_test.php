<?php
//moving newly generated files
system("google-chrome-stable --headless --remote-debugging-port=9222 > /dev/null &");
system("node index_test.js");
system("pgrep chrome | xargs kill -9");


?>

