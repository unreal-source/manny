import { SlashCommand } from 'hiei.js'
import { ActionRowBuilder, ApplicationCommandOptionType, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js'
import log from '../../utilities/logger.js'

class AddJob extends SlashCommand {
  constructor () {
    super({
      name: 'job',
      description: 'Post a job opportunity on the job board',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'salary',
          description: 'Post a salary job on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'freelance',
          description: 'Post a freelance job on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'revshare',
          description: 'Post a revenue share job on the job board'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'volunteer',
          description: 'Post volunteer project on the job board'
        }
      ],
      defaultMemberPermissions: PermissionFlagsBits.SendMessages
    })
  }

  async run (interaction) {
    const subcommand = interaction.options.getSubcommand()

    log.info({ event: 'command-used', command: this.name, channel: interaction.channel.name })

    switch (subcommand) {
      case 'salary': {
        const questions = new ModalBuilder()
          .setCustomId('salaryJobModal')
          .setTitle('Post a Salary Job')

        const roleInput = new TextInputBuilder()
          .setCustomId('role')
          .setLabel('Role & company')
          .setPlaceholder('Technical Artist at Acme Games')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(256)

        const locationInput = new TextInputBuilder()
          .setCustomId('location')
          .setLabel('Location')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const responsibilitiesInput = new TextInputBuilder()
          .setCustomId('responsibilities')
          .setLabel('Responsibilities')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const qualificationsInput = new TextInputBuilder()
          .setCustomId('qualifications')
          .setLabel('Qualifications')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const applyInput = new TextInputBuilder()
          .setCustomId('apply')
          .setLabel('How to apply')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const firstRow = new ActionRowBuilder().addComponents([roleInput])
        const secondRow = new ActionRowBuilder().addComponents([locationInput])
        const thirdRow = new ActionRowBuilder().addComponents([responsibilitiesInput])
        const fourthRow = new ActionRowBuilder().addComponents([qualificationsInput])
        const fifthRow = new ActionRowBuilder().addComponents([applyInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow, fifthRow])

        await interaction.showModal(questions)

        break
      }

      case 'freelance': {
        const questions = new ModalBuilder()
          .setCustomId('freelanceJobModal')
          .setTitle('Post a Freelance Job')

        const roleInput = new TextInputBuilder()
          .setCustomId('role')
          .setLabel('Role & company')
          .setPlaceholder('Technical Artist at Acme Games')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(256)

        const locationInput = new TextInputBuilder()
          .setCustomId('location')
          .setLabel('Location')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const responsibilitiesInput = new TextInputBuilder()
          .setCustomId('responsibilities')
          .setLabel('Responsibilities')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const qualificationsInput = new TextInputBuilder()
          .setCustomId('qualifications')
          .setLabel('Qualifications')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const applyInput = new TextInputBuilder()
          .setCustomId('apply')
          .setLabel('How to apply')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const firstRow = new ActionRowBuilder().addComponents([roleInput])
        const secondRow = new ActionRowBuilder().addComponents([locationInput])
        const thirdRow = new ActionRowBuilder().addComponents([responsibilitiesInput])
        const fourthRow = new ActionRowBuilder().addComponents([qualificationsInput])
        const fifthRow = new ActionRowBuilder().addComponents([applyInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow, fifthRow])

        await interaction.showModal(questions)

        break
      }

      case 'revshare': {
        const questions = new ModalBuilder()
          .setCustomId('revShareJobModal')
          .setTitle('Post a Revenue Share Job')

        const roleInput = new TextInputBuilder()
          .setCustomId('role')
          .setLabel('Role & company')
          .setPlaceholder('Technical Artist at Acme Games')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(256)

        const locationInput = new TextInputBuilder()
          .setCustomId('location')
          .setLabel('Location')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const responsibilitiesInput = new TextInputBuilder()
          .setCustomId('responsibilities')
          .setLabel('Responsibilities')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const qualificationsInput = new TextInputBuilder()
          .setCustomId('qualifications')
          .setLabel('Qualifications')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const applyInput = new TextInputBuilder()
          .setCustomId('apply')
          .setLabel('How to apply')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const firstRow = new ActionRowBuilder().addComponents([roleInput])
        const secondRow = new ActionRowBuilder().addComponents([locationInput])
        const thirdRow = new ActionRowBuilder().addComponents([responsibilitiesInput])
        const fourthRow = new ActionRowBuilder().addComponents([qualificationsInput])
        const fifthRow = new ActionRowBuilder().addComponents([applyInput])

        questions.addComponents([firstRow, secondRow, thirdRow, fourthRow, fifthRow])

        await interaction.showModal(questions)

        break
      }

      case 'volunteer': {
        const questions = new ModalBuilder()
          .setCustomId('volunteerJobModal')
          .setTitle('Post a Volunteer Job')

        const titleInput = new TextInputBuilder()
          .setCustomId('title')
          .setLabel('Title')
          .setPlaceholder('Artist needed for mod project')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(256)

        const detailsInput = new TextInputBuilder()
          .setCustomId('details')
          .setLabel('Project Details')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1024)

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1024)

        const firstRow = new ActionRowBuilder().addComponents([titleInput])
        const secondRow = new ActionRowBuilder().addComponents([detailsInput])
        const thirdRow = new ActionRowBuilder().addComponents([contactInput])

        questions.addComponents([firstRow, secondRow, thirdRow])

        await interaction.showModal(questions)

        break
      }
    }
  }
}

export default AddJob
