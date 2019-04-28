const fs = require("fs");
const moment = require("moment");
const config = require("./config/config.json");
const { needsIntercomLogin, intercomLogin } = require("./common");


//https://app.intercom.io/a/apps/jadbzc02/respond/reporting/performance?rangeEnd=2018-01-11T23%3A59%3A59%2B01%3A00&rangeStart=2018-01-05T00%3A00%3A00%2B01%3A00&teammateId=1547239

module.exports = async function scrapeIntercom(browser) {
  try {
    console.log("=== Scraping Intercom 3===");
    //const date = moment().subtract(1, "month").format("YYYY-MM");
    const url = `https://app.intercom.io/admins/sign_in`; // dr=7__ Last Month
    const mainTab = await browser.newTab({ privateTab: false });

    // Navigate to a URL
    await mainTab.goTo(url);
console.log("loggin in");
    await mainTab.fill("#admin_email", "laurin.stahl+intercom@aiesec.net");
    //await mainTab.click("#identifierNext");
    console.log("clicking #admin_password");
    await mainTab.click("#admin_password");
    await mainTab.type("#admin_password", "nixgibts");
    console.log("clicking .js-login-button");
    await mainTab.click(".js-login-button");    //await mainTab.fill("#identifierId", "laurinl@ai.aiesec.org");
    console.log("waiting for avatar to load");
    await mainTab.waitForSelectorToLoad(".avatar__media");
    //console.log("clicking #ember1825");
    //await mainTab.waitForSelectorToLoad("#ember1825");
    //await mainTab.click("#ember1825"); //ember2464
    	

    console.log("Read The File");
    var fs = require('fs');
    var teams = JSON.parse(fs.readFileSync("./config/teams_output.json"));
    var today = new Date();
    var last_week = new Date(today - 7*24*60*60*1000);
    var i = 0;
    for (var key in teams) {
        if (teams.hasOwnProperty(key)) {
            i++;

            console.log(key + " -> " + teams[key]);
            var url_team = "https://app.intercom.io/a/apps/jadbzc02/inbox/inbox/"+teams[key];
            await mainTab.goTo(url_team);
            console.log("Trying to click 'Newest'");
            await mainTab.waitForSelectorToLoad(".f__custom-select__box");
            await mainTab.evaluate(() => {
              var selector = document.querySelectorAll(".f__custom-select__box");
              for (var i = 0; i < selector.length; i++) {
                selector[i].id = "newest_"+i;
              }
            });
            console.log("Clicking 'Newest'");
            await mainTab.click("#newest_1");
            console.log("Trying to click 'Waiting longest'");
            await mainTab.waitForSelectorToLoad(".dropdown__list-item");
            await mainTab.evaluate(() => {
              var selector = document.querySelectorAll(".dropdown__list-item");
              for (var i = 0; i < selector.length; i++) {
                selector[i].id = "dropdown_"+i;
              }
            });
            //if(i == 1){
              await mainTab.waitForSelectorToLoad("#dropdown_2");
              console.log("Clicking 'Waiting longest'");
              await mainTab.click("#dropdown_2");
            //}

            await mainTab.wait(2000);

            console.log("Catching the text");
            const longest_waiting = (await mainTab.evaluate(() => {
              const selectorHtml = document.querySelectorAll(
                ".conversation__list__timestamp"
              )[0];
              return selectorHtml.innerText;
            })).result.value;
            console.log(longest_waiting);
            fs.appendFileSync(
              `output_waiting_longest.txt`,
              `${key};${longest_waiting}\n`
            );
        }
    }

  await browser.close();
    console.log("close script");
    process.exit();
  } catch (err) {
    console.log("ERROR!", err);
  }
  console.log("QUIT 1");
};
console.log("QUIT 2");

