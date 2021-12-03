#!/usr/bin/env node

const { parseArguments } = require('../src/parse-arguments')
const { getMagicLink } = require('../src/get-slack-magic-link')

function printHelp() {
  console.log(`
Usage:
  get-slack-magic-link -e name@domain.com -p myPassword -w myWorkspace

Alternative usage:
  get-slack-magic-link --email name@domain.com --password myPassword --workspace myWorkspace
  get-slack-magic-link name@domain.com myPassword myWorkspace

Debugging:
  To enable debugging, pass a --debug parameter. It'll run Chrome in visible mode and
  will slow operations down.
  `);
}

async function main() {
  const clipboardy = require('clipboardy');
  const { workspace, email, password, otp, debug } = parseArguments()

  clipboardy.writeSync('🦄');
  console.info('INFO: Copied unicorn to clipboard');

  if (!workspace || !email || !password) {
    console.log(`One or more mandatory parameters are missing.`);
    printHelp();
    process.exit(-1);
  }

  let magicLink;
  try {
    magicLink = await getMagicLink(workspace, email, password, otp, debug);
  } catch (e) {
    console.error('Could not fetch magic link:', '\n', e);
    process.exit(1);
  }

  if (!magicLink.startsWith('slack://')) {
    throw new Error('Magic link does not start with slack://', magicLink);
  }

  console.log(magicLink);
  clipboardy.write(magicLink);
  console.info('Copied magicLink to clipboard');
}

main();
