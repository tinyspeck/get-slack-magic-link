const puppeteer = require('puppeteer');
const url = require('url');

async function getMagicLink(workspace, email, password, otp, debug) {
  console.log(`INFO: debug=${debug}`)
  const browser = await puppeteer.launch({
    headless: !debug,
    slowMo: debug ? 250 : 0
  });
  const context = browser.defaultBrowserContext();
  context.overridePermissions(`https://${workspace}.slack.com`, ['clipboard-read']);
  const page = await browser.newPage();

  await page.goto(`https://${workspace}.slack.com/ssb/signin_redirect/fallback`, { waitUntil: 'networkidle2' });

  current_url = await page.url();
  myURL = url.parse(current_url);
  context.overridePermissions(`https://${myURL.domain}`, ['clipboard-read']);

  // Do we have to choose netween enterprise SSO or guest account ?
  // If yes, we choose guest account.
  console.log("DEBUG: looking for SSO/Guest choice")
  try {
    await page.waitForSelector('a[data-clog-params="click_target=enterprise_member_guest_account_signin_link"]');
    await page.click('a[data-clog-params="click_target=enterprise_member_guest_account_signin_link"]');
  } catch (error) {
    console.log("INFO: No SSO/Guest account choice")
  }

  // log into form
  await page.click('input[type=email]');
  await page.type('input[type=email]', email);

  await page.click('input[type=password]');
  await page.type('input[type=password]', password);

  await page.evaluate(`document.querySelector('#signin_btn').click()`);

  // Now, do we have to type an OTP token ?
  try {

    await page.waitForSelector('input[autocomplete="one-time-password"]');
    console.log("INFO: found OTP selector");

    if(!otp) {
      throw new Error('FATAL: Login requires an OTP but no OTP token was given');
    }

    console.debug('DEBUG: clicking on otp selector');
    await page.click('input[autocomplete="one-time-password"]');
    console.debug('DEBUG: typing OTP in otp selector');
    await page.type('input[autocomplete="one-time-password"]', otp);

  } catch (error) {
    console.log("INFO: Error or no OTP input found")
  }

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
