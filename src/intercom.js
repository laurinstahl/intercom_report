const fs = require("fs");
const moment = require("moment");
const config = require("./config/config.json");
const { needsIntercomLogin, intercomLogin } = require("./common");


//https://app.intercom.io/a/apps/jadbzc02/respond/reporting/performance?rangeEnd=2018-01-11T23%3A59%3A59%2B01%3A00&rangeStart=2018-01-05T00%3A00%3A00%2B01%3A00&teammateId=1547239

module.exports = async function scrapeIntercom(browser) {
  try {
    console.log("=== Scraping Intercom 1===");
    const url = `https://app.intercom.io/admins/sign_in`; // dr=7__ Last Month
    const mainTab = await browser.newTab({ privateTab: false });
    // Navigate to a URL
    await mainTab.goTo(url);

    console.log("loggin in");
    console.log("clicking #admin_email");
    await mainTab.fill("#admin_email", "laurin.stahl+intercom@aiesec.net");
    console.log("clicking #admin_password");
    await mainTab.click("#admin_password");
    await mainTab.type("#admin_password", "nixgibts");
    console.log("clicking .js-login-button");
    await mainTab.click(".js-login-button");
    console.log("clickingavatar");
    await mainTab.waitForSelectorToLoad(".avatar__media");
    //await mainTab.click("#avatar__media"); //ember2464
    console.log("Read The File");
    var fs = require('fs');
    var teams = JSON.parse(fs.readFileSync("./config/teams_output.json"));
    var today = new Date();
    var last_week = new Date(today - 7*24*60*60*1000);
    for (var key in teams) {
        if (teams.hasOwnProperty(key)) {
            console.log(key + " -> " + teams[key]);
            var url_team = "https://app.intercom.io/a/apps/jadbzc02/respond/reporting/performance?rangeEnd="+today+"&rangeStart="+last_week+"&teammateId="+teams[key];
            await mainTab.goTo(url_team);

            await mainTab.waitForSelectorToLoad(".reporting__report-card");
            console.log("Getting data ...");
            const productiveHoursThisMonth = (await mainTab.evaluate(() => {
              const selectorHtml = document.querySelector(
                ".reporting__report-card"
              );
              return selectorHtml.innerHTML;
            })).result.value;

            console.log("Writing Team "+key+".html");
            fs.appendFileSync(
              key+`.html`,
              `${productiveHoursThisMonth}`
            );
        }
}
	console.log("close script");
            process.exit();

    /*await mainTab.waitForSelectorToLoad("#ember2464"); //ember4191
    await mainTab.click("#ember2464"); //ember2464
    await mainTab.waitForSelectorToLoad("#ember4191"); //ember4191
    await mainTab.saveScreenshot(`output.png`, {
      selector: ".reporting__report"
    });
    //card reporting__report-card o__top o__has-rows o__centers-horizontally
    /*await mainTab.wait(2000); // skip animation
    await mainTab.type("input[name=password]", config.google.password);
    await mainTab.click("#passwordNext");*/
    await mainTab.wait(30000);

//    await mainTab.click("m__login__button");


    /*if (await needsIntercomLogin(mainTab)) {
      console.log("Logging in ...");
      await intercomLogin(mainTab);
    } else {
      console.log("Already logged in ...");
    }

    // Wait some time! (2s)
    await mainTab.wait(2000);
    await mainTab.goTo(url);
    console.log('Waiting for graph to load ...')
    await mainTab.waitForSelectorToLoad(".unread__container left-nav__unread-container");

    console.log("Saving Screenshot ...");
    await mainTab.wait(2000);
    await mainTab.saveScreenshot(`${config.outputDir}admob-income`, {
      selector: ".GKBRQK-B-j"
    });
    */
  } catch (err) {
    console.log("ERROR!", err);
  }
};
