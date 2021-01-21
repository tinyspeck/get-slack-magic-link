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

  // log into form
  await page.click('input[type=email]');
  await page.type('input[type=email]', email);

  await page.click('input[type=password]');
  await page.type('input[type=password]', password);

  await page.evaluate(`document.querySelector('#signin_btn').click()`);

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
