import { Listener } from 'discord-akairo'

class MissingPermissionsListener extends Listener {
  constructor () {
    super('missingPermissions', {
      event: 'missingPermissions',
      emitter: 'commandHandler'
    })
  }

  exec (message, command, type, missing) {
    return this.client.log.error(`Missing Permissions >> ${command} >> ${type} >> ${missing}`)
  }
}

export default MissingPermissionsListener
