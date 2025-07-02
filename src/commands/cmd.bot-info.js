import metadata from '../../package.json'
import { dedent } from '../utilities/string-util.js'
import {
  ActionRowBuilder,
  ContainerBuilder,
  MessageFlags,
  PermissionFlagsBits,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder
} from 'discord.js'

export default {
  interaction: 'slash',
  name: 'about',
  description: 'Learn more about Manny',
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  async execute ({ interaction, client, components }) {
    await client.application.fetch()
    const name = client.application.name
    const description = client.application.description
    const version = metadata.version
    const sourceCodeButton = components.get('button:view-source-code')
    const issuesButton = components.get('button:report-issue')
    const patronageButton = components.get('button:become-patron')

    return interaction.reply({
      components: [
        new ContainerBuilder()
          .addSectionComponents(
            new SectionBuilder()
              .setThumbnailAccessory(
                new ThumbnailBuilder()
                  .setURL(client.user.displayAvatarURL())
              )
              .addTextDisplayComponents(
                new TextDisplayBuilder()
                  .setContent(dedent`
                    # ${name} ${version}
                    ${description}
                    ### Features
                    - Allows members to stream in voice chat
                    - Manages the job board
                    - Answers frequently-asked questions
                    - Provides information about the server
                    - Generates random game ideas`)
              )
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing('Small')
              .setDivider(false)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(dedent`
                ### Credits
                Created by pfist. Code contributed by Matt Boatswain and KaosSpectrum.`)
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing('Large')
              .setDivider(true)
          )
          .addActionRowComponents(
            new ActionRowBuilder()
              .addComponents(sourceCodeButton.data, issuesButton.data, patronageButton.data)
          )
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    })
  }
}
