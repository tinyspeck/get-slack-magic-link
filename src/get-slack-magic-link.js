const puppeteer = require('puppeteer');

async function getMagicLink(workspace, email, password, debug) {
  const browser = await puppeteer.launch({
    headless: !debug,
    slowMo: debug ? 250 : 0
  });
  const page = await browser.newPage();

  await page.goto(`https://${workspace}.slack.com/ssb/signin_redirect/fallback`, { waitUntil: 'networkidle2' });

  await page.click('input[type=email]');
  await page.type('input[type=email]', email);

  await page.click('input[type=password]');
  await page.type('input[type=password]', password);

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]')
  ]);

  await page.waitForSelector('input[type=text]');

  const result = await page.$eval('input[type=text]', el => el.value);

  await browser.close();

  return result;
}

module.exports = {
  getMagicLink
}
