const puppeteer = require('puppeteer');

async function getMagicLink(workspace, email, password, debug) {
  const browser = await puppeteer.launch({
    headless: !debug,
    slowMo: debug ? 50 : 0
  });
  const context = browser.defaultBrowserContext();
  context.overridePermissions(`https://${workspace}.slack.com`, ['clipboard-read']);
  const page = await browser.newPage();

  await page.goto(`https://${workspace}.slack.com/ssb/signin_redirect/fallback`, { waitUntil: 'networkidle2' });

  try {
    await page.waitForTimeout(5000);
    await page.waitForSelector('#onetrust-accept-btn-handler');
    await page.click('#onetrust-accept-btn-handler');
  } catch (error) {
    console.log("Cookie consent popup did not appear, continuing...");
  }

  // log into form
  await page.click('input[type=email]');
  await page.type('input[type=email]', email);

  await page.click('input[type=password]');
  await page.type('input[type=password]', password);

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]')
  ]);

  // click button to copy sign-in link to clipboard
  await page.waitForSelector('button[type=button]', {visible: true});
  await page.click('button[type=button]');
  // fetch active text in clipboard
  const copiedText = await page.evaluate(`(async () => await navigator.clipboard.readText())()`)
  await browser.close();

  return copiedText;
}

module.exports = {
  getMagicLink
}
