function findArgument(name = '') {
  const args = [ ...process.argv ];
  const arg = args.find((v) => v.startsWith(name));

  if (arg && arg.endsWith('=')) {
    return arg.slice(arg.indexOf('='));
  }

  const nextArg = args[args.indexOf(arg) + 1]
  if (arg && nextArg) {
    return nextArg;
  }

  return '';
}

function parseArguments() {
  const result = {
    email: findArgument('--email') || findArgument('-e'),
    password: findArgument('--password') || findArgument('-p'),
    workspace: findArgument('--workspace') || findArgument('-w'),
    debug: process.argv.includes('--debug')
  };

  if (result.email && result.password && result.workspace) {
    return result;
  }

  // Let's check arg-less usage, expecting
  // get-slack-magic-link email password workspace
  const reverseArgs = [ ...process.argv.reverse().slice(0, 2) ]
  result.email = reverseArgs[2];
  result.password = reverseArgs[1];
  result.workspace = reverseArgs[0];

  return result;
}

module.exports = { parseArguments }
