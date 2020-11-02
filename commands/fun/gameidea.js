import { Command } from 'discord-akairo'
import { generate } from '../../utilities/GameIdeaGenerator'
import _ from '../../utilities/Util'

class GameIdeaCommand extends Command {
  constructor () {
    super('gameidea', {
      aliases: ['gameidea', 'game'],
      category: 'Fun',
      description: {
        name: 'Game Idea',
        content: 'Generate a random game idea',
        usage: '!gameidea'
      },
      channel: 'guild'
    })
  }

  exec (message) {
    const templates = [
      'A {style:a} {genre:a} where you {verb} {supernatural:plural} with {object:plural} in {setting:in}',
      'A {style:a} {genre:a} where {person:plural} take on a horde of {supernatural:plural}, with a twist: {diversifier}'
    ]

    return message.channel.send(generate(_.randomElement(templates)))
  }
}

export default GameIdeaCommand
