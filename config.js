export default {
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
      category: process.env.ARCHIVE_CATEGORY
    },
    automod: {
      notifications: process.env.AUTOMOD_NOTIFICATION_CHANNEL
    },
    jobs: {
      category: process.env.JOBS_CATEGORY,
      permanentJobs: process.env.PERMANENT_JOBS_CHANNEL,
      contractJobs: process.env.CONTRACT_JOBS_CHANNEL,
      unpaidGigs: process.env.UNPAID_GIGS_CHANNEL,
      hireFreelancer: process.env.HIRE_FREELANCER_CHANNEL,
      hireStudio: process.env.HIRE_STUDIO_CHANNEL
    },
    logs: {
      memberLog: process.env.MEMBER_LOG_CHANNEL,
      modLog: process.env.MOD_LOG_CHANNEL
    }
  },
  roles: {
    moderator: process.env.MODERATOR_ROLE,
    muted: process.env.MUTED_ROLE,
    voice: process.env.VOICE_ROLE
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
