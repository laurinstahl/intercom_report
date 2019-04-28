# intercom_report
Create easy to read high-level reports for multiple intercom teams in one account, using a headless browser.

All important work is stored in the src folder. The files you have to look at are the following:

<h>Setup</h>
1. config.json: Fill your Intercom username and password that has the rights to access all the teams and their reports.

2. teams.json: You need to download this file from Intercom's API. The easiest way is to login to Intercom, monitor the network requests and find the JSON response that includes all teams in an array.

Make sure Chrome Headless works on your machine via the command-line. I implemented this on a RHEL machine installing google-chrome-stable_current_x86_64.rpm. There are different packages for Google Chrome Headless available, it should come with Chrome.

Then you are setup and ready to run

Run
1. get_teams.php: Running this will parse teams.json to create teams_output.json which is needed for the rest to work
2. exec.php: Running this will basically initiate a series of scripts and the respective node scripts which go through a multiple step process to compile all the data that you need:

After successfully run, you will have a report.csv that you can use
