const config = {
  commands: {
    defaultPrefix: '!',
    jobPrefix: '$'
  },
  automod: {
    newAccountAge: '30m',
    joinCount: 1
  },
  strikes: {
    muteLevels: {
      1: '10m',
      2: '1h'
    }
  },
  channels: {
    archive: {
    },
    automod: {
    },
    jobs: {
    },
    logs: {
    }
  },
  roles: {
    moderator: '335496981621506048',
    muted: '720439694784987239',
    voice: '776887405793640481'
  },
  meta: {
    links: {
      github: 'https://github.com/unreal-slackers',
      twitter: 'https://twitter.com/unrealslackers',
      website: 'https://unrealslackers.org',
      appeals: 'https://appeals.unrealslackers.org'
    }
  }
}

export default config
