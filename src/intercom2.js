const fs = require("fs");
const moment = require("moment");
const config = require("./config/config.json");
const { needsIntercomLogin, intercomLogin } = require("./common");


//https://app.intercom.io/a/apps/jadbzc02/respond/reporting/performance?rangeEnd=2018-01-11T23%3A59%3A59%2B01%3A00&rangeStart=2018-01-05T00%3A00%3A00%2B01%3A00&teammateId=1547239


module.exports = async function scrapeIntercom2(browser) {
  try {
    console.log("=== Scraping Intercom 2 ===");
    //const date = moment().subtract(1, "month").format("YYYY-MM");
    const url = `https://app.intercom.io/admins/sign_in`; // dr=7__ Last Month
    const mainTab = await browser.newTab({ privateTab: false });

    // Navigate to a URL
    await mainTab.goTo(url);

    console.log("loggin in");
    await mainTab.fill("#admin_email", "laurin.stahl+intercom@aiesec.net");
    //await mainTab.click("#identifierNext");
    await mainTab.click("#admin_password");
    await mainTab.type("#admin_password", "nixgibts");
console.log("clicking .js-login-button");
    await mainTab.click(".js-login-button");    //await mainTab.fill("#identifierId", "laurinl@ai.aiesec.org");
    //console.log("clicking #ember1825");
    //await mainTab.waitForSelectorToLoad("#ember1825");
    //await mainTab.click("#ember1825"); //ember2464
    console.log("waiting for avatar to load");
    await mainTab.waitForSelectorToLoad(".avatar__media");
    console.log("go to inbox");
    var url_team = "https://app.intercom.io/a/apps/jadbzc02/inbox/inbox/2376101";
    await mainTab.goTo(url_team);
    await mainTab.waitForSelectorToLoad(".submenu__sections__section__items__show-more");
console.log("Clicking on dropdown ...");
    await mainTab.click(".btn__tertiary__deemphasized"); //ember2464 team__dropdown
    await mainTab.waitForSelectorToLoad(".js__nav-vertical__all-inboxes");
    console.log("Getting data ...");
    const productiveHoursThisMonth = (await mainTab.evaluate(() => {
      const selectorHtml = document.querySelector(
        ".js__nav-vertical__all-inboxes"
      );
      return selectorHtml.innerHTML;
    })).result.value;

    console.log("Writing Open Conversations.html");
    fs.appendFileSync(
      `Writing Open Conversations.html`,
      `${productiveHoursThisMonth}`
    );
    //await mainTab.waitForSelectorToLoad(".saubmenu__sections__section__items__show-more");
    await browser.close();
    console.log("close script");
    process.exit();
  } catch (err) {
    console.log("ERROR!", err);
  }
};

