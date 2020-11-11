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
        short: 'Get a randomly-generated game idea.',
        syntax: '!gameidea'
      },
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES']
    })
  }

  exec (message) {
    const templates = [
      'A game where you {verb} {object:plural} to {goal}.',
      'A game where you {verb} {object:plural} to {goal}. The twist: {diversifier}.',
      'A game where you {verb} {object:singular} on {setting:on}.',
      'A game where you {verb} {object:singular} on {setting:on}. The twist: {diversifier}.',
      'A game where the world is dominated by {supernatural:plural}, and the last hope for humanity is {person:singular} with {object:singular}.',
      'A game where the world is dominated by {supernatural:plural}, and the last hope for humanity is {person:singular} with {object:singular}. To make matters worse, {diversifier}.',
      'A game where {person:plural} {verb} {supernatural:plural} in {setting:in}.',
      'A game where {person:plural} {verb} {supernatural:plural} in {setting:in}. The twist: {diversifier}.',
      'A game where you feed {object:plural} to {supernatural:singular} in order to {goal}.',
      'A game where you feed {object:plural} to {supernatural:singular} in order to {goal}. To make things more interesting, {diversifier}.',
      'A game where you fight waves of {supernatural:plural} in {setting:in}.',
      'A game where you fight waves of {supernatural:plural} in {setting:in}, but there\'s a catch: {diversifier}.',
      'A game where {person:plural} compete with {supernatural:plural} in {setting:in}.',
      'A game where {person:plural} compete with {supernatural:plural} in {setting:in}. The twist: {diversifier}.',
      'A game about {animal:singular} with {object:plural} that will stop at nothing to {goal}.',
      'A game about {animal:singular} with {object:plural} that will stop at nothing to {goal}. On top of that, {diversifier}.',
      'A game about {person:singular} searching {setting:in} for {object:plural}.',
      'A game about {person:singular} searching {setting:in} for {object:plural}. The twist: {diversifier}.',
      'You are {person:singular} in {setting:in}. Armed only with {object:singular} and your wits, you must {goal}.',
      'You are {person:singular} in {setting:in}. Armed only with {object:singular} and your wits, you must {goal}. To make matters worse, {diversifier}.',
      'An {style:an} {genre:a} that takes place in {setting:in}.',
      'An {style:an} {genre:an} that takes place in {setting:in}. The twist: {diversifier}.',
      'A {style:a} {genre:a} where you {verb} {supernatural:singular} in {setting:in}.',
      'A {style:a} {genre:an} where you {verb} {supernatural:singular} in {setting:in}, but {diversifier}.'
    ]

    return message.util.send(generate(_.randomElement(templates)))
  }
}

export default GameIdeaCommand
