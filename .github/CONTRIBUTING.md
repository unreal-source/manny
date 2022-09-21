# Contributing
If you want to contribute new code to the project, please follow the steps outlined below.

## Setup
1. Install the latest LTS release of [Node.js](https://nodejs.org/en/) and the latest version of [Git](https://git-scm.com/).
2. Fork & clone the repository, and make sure you're working on the **main** branch.
3. Run `npm install` to install dependencies.
4. Write your code!

## Linting
We use [Standard](https://standardjs.com/) to enforce a consistent coding style. You can run `npm test` to lint your code before committing, or you can install a plugin for your editor of choiceto make things even more efficient. See the Resources section below for more information.

## Testing
In most cases you probably want to test your new feature or bug fix on a Discord server before submitting a Pull Request. To do that:

1. Visit the [Discord Developer Dashboard](https://discordapp.com/developers/applications/) and create a new application.
2. Go to Settings → Bot and click **Add Bot** to create a bot user for your application.
3. On the same page, copy your bot's token.
4. Create a `.env` file in the root directory and add the following lines:
```
TOKEN=your bot token
GUILD=your server ID
```
5. If you haven't already, create a new Discord server for testing and invite your bot to it.
6. Run the bot with `npm run dev`.

If you're working on a feature that requires database access, you'll need to set up a local [Postgres](https://www.postgresql.org/) server and add the URL to your `.env` file:
```
DATABASE_URL=your database URL
```

## Submitting your code
When you're ready, [submit a Pull Request](https://github.com/unreal-slackers/manny/compare) and wait for your changes to be reviewed!

## Resources
- Discord.js - [Docs](https://discord.js.org/#/docs/discord.js/stable/general/welcome) | [Guide](https://discordjs.guide/) | [Source](https://github.com/discordjs/discord.js)
- Prisma - [Docs](https://www.prisma.io/docs/) | [Source](https://github.com/prisma/prisma)
- Standard - [Docs](https://standardjs.com/) | [Source](https://github.com/standard/standard)
