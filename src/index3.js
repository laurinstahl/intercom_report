const HeadlessChrome = require("simple-headless-chrome");
const fs = require("fs");
const scrapeIntercom3 = require("./intercom3");

const config = require("./config/config.json");

const browser = new HeadlessChrome({
  headless: true,
  deviceMetrics: {
    width: 1920,
    height: 1080
  }
});

const mkdirSync = function(dirPath) {
  try {
    fs.mkdirSync(dirPath);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
};

async function scrapeSites() {
  try {
    await browser.init();
    // clear file
    mkdirSync(config.outputDir);
    fs.writeFileSync(`${config.outputDir}results.txt`, "");
    //await scrapeRescueTime(browser);
    //await scrapeAdSense(browser);
    //await scrapeAnalytics(browser);
    //await scrapeIntercom(browser);
    //await scrapeIntercom2(browser);
    await scrapeIntercom3(browser);

  } catch (err) {
    console.log("ERROR!", err);
  } finally {
    await browser.close();
  }
}

scrapeSites();
