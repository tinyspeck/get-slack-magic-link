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
  const { workspace, email, password, debug } = parseArguments()

  if (!workspace || !email || !password) {
    console.log(`One or more parameters are missing.`);
    printHelp();
    process.exit(-1);
  }

  const magicLink = await getMagicLink(workspace, email, password, debug);

  console.log(magicLink);
}

main();
