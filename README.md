# get-slack-magic-link

You got a username, password, and workspace for Slack. You want a magic link. This tool will get one for you
by manually navigating to Slack and getting a magic link. It's using [puppeteer](https://github.com/puppeteer/puppeteer/) to perform the automation.

## Usage (Command Line)

I recommend using this tool with npx. Passing `-q` to npx will
suppress Chrome's download status and is optional.

```
npx -q get-slack-magic-link -e my@mail.com -p myPassword -w myWorkspace
```

Alternative usage:

```
npx -q get-slack-magic-link --email name@domain.com --password myPassword --workspace myWorkspace
npx -q get-slack-magic-link name@domain.com myPassword myWorkspace
```

To enable debugging, pass a `--debug` parameter. It'll show Chrome running and will slow operations
down by 250ms.

## Usage (Library)

```js
const { getMagicLink } = require('get-slack-magic-link);

async myFunction() {
  const magicLink = await getMagicLink(email, password, workspace);
}
```

# License

MIT
