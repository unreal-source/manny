# Contributing to Quin

## Reporting bugs or suggesting improvements
If you find a bug or have an idea for improving the bot, first check the current [issues]() and [PRs](). If you don't see your bug or suggestion, feel free to [submit a new issue]().

If you want to ask a question, please join us on [Discord](https://discord.gg/unreal-slackers) and ask in the #server-feedback channel.

## Contributing code
If you want to contribute new code to the project, please follow these steps:

1. Install the latest LTS release of [Node.js](https://nodejs.org/en/) and the latest version of [Git](https://git-scm.com/).
2. Fork this repository to your personal account.
3. Clone the repository to your local machine.
4. Install the required dependencies. `npm install`
5. Write your code!

> Remember to run `npm test` before committing your new code. We use [Standard](https://standardjs.com/) to enforce a consistent coding style. See the Links section below for more information.

While it's not required, in most cases you'll want to test your new functionality or bug fix on Discord before submitting a Pull Request. To do that, follow these extra steps before writing your code:

1. Visit the [Discord Developer Dashboard](https://discordapp.com/developers/applications/) and create a new application.
2. In your new application, go to Settings > Bot and click **Add Bot** to create a bot user for your application.
3. On the same page, click **Copy** to copy your bot's token.
4. If you haven't already, spin up a new Discord server and invite your bot to it.
5. Run the bot locally: `node -r esm quin -t <your-app-token>`

When you're ready, [submit a Pull Request](https://github.com/unreal-slackers/quin/compare) and wait for your changes to be reviewed!

## Links
- Discord.js - [Docs](https://discord.js.org/#/docs/main/stable/general/welcome) | [Guide](https://discordjs.guide/) | [Source](https://github.com/discordjs/discord.js)
- Akairo - [Docs](https://discord-akairo.github.io/#/docs/main/stable/class/AkairoClient) | [Guide](https://discord-akairo.github.io/#/docs/main/stable/general/welcome) | [Source](https://github.com/discord-akairo/discord-akairo)
- Standard - [Docs](https://standardjs.com/) | [Source](https://github.com/standard/standard)
