const { Client, SlashCommandBuilder, NumberPrompt, ChannelType } = require('discord.js');
const ecoSchema = require('../../Schemas.js/ecoSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addbalance')
    .setDescription('Add an amount to a user\'s wallet balance.')
    .addUserOption(option => option.setName('user').setDescription('The user to add the amount to.').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The amount to add to the user\'s wallet balance.').setRequired(true)),
  async execute(interaction) {
    const userselected = interaction.options.getUser('user');
    const amount = interaction.options.getNumber('amount');

    if ( interaction.user.id !== '1091118468155314306') {
      return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    let data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: userselected.id });

    if (!data) {
      return await interaction.reply({ content: `<@${userselected.id}> does not have an account yet.`, ephemeral: true });
    }

    data.Wallet += amount;

    await data.save();

    return await interaction.reply({ content: `<@${userselected.id}>'s wallet balance has been increased by $${amount}.`, ephemeral: true });
  }
}
