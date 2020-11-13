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
      category: '758833108727365652'
    },
    automod: {
      notifications: '275091426038251540'
    },
    jobs: {
      category: '692565207184048129',
      permanentJobs: '692565224984805436',
      contractJobs: '692565242374389820',
      unpaidGigs: '692565261559136296',
      hireFreelancer: '695155145306013697',
      hireStudio: '695155159692738570'
    },
    logs: {
      memberLog: '495053365655633920',
      modLog: '551658054849003540'
    }
  },
  roles: {
    moderator: '335496981621506048',
    muted: '720439694784987239',
    voice: '776887405793640481'
  },
  embeds: {
    colors: {
      red: '#f03e3e',
      orange: '#fd7e14',
      yellow: '#ffe066',
      green: '#69db7c',
      cyan: '#66d9e8',
      blue: '#4dabf7',
      violet: '#9775fa',
      pink: '#faa2c1'
    }
  },
  prefixes: {
    archive: ':card_box:',
    ban: ':no_entry_sign:',
    bot: ':robot:',
    edit: ':pencil:',
    expired: ':alarm_clock:',
    info: ':mag_right:',
    join: ':inbox_tray:',
    leave: ':outbox_tray:',
    lock: ':lock:',
    mute: ':clock2:',
    purge: ':broom:',
    strike: ':triangular_flag_on_post:',
    undo: ':arrow_right_hook:',
    unlock: ':unlock:',
    warning: ':warning:'
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
