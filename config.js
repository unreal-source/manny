const config = {
  commands: {
    defaultPrefix: '!'
  },
  automod: {
    newAccountAge: '30m',
    joinCount: 10,
    joinInterval: '1m',
    notifChannel: '',
    ignoredChannels: []
  },
  infractions: {
    modRole: '',
    mutedRole: ''
  },
  logs: {
    category: '',
    channels: {
      memberLog: '495053365655633920',
      modLog: '551658054849003540'
    }
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
    expired: ':alarm_clock:',
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
  jobs: {
    category: '692565207184048129',
    channels: {
      permanentJobs: '692565224984805436',
      contractJobs: '692565242374389820',
      unpaidGigs: '692565261559136296',
      hireFreelancer: '695155145306013697',
      hireStudio: '695155159692738570'
    }
  },
  archive: {
    category: '758833108727365652'
  },
  meta: {
    links: {
      github: 'https://github.com/unreal-slackers',
      twitter: 'https://twitter.com/unrealslackers',
      website: 'https://unrealslackers.org'
    }
  }
}

export default config
