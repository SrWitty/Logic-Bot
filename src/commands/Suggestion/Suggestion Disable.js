const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const suggestionSchema = require('../../Schemas.js/suggestionSchema');
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion-disable')
    .setDescription(`Disable the suggestion system`),
 
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return await interaction.reply({ content: `You must have the **Manage Channels** permission to use this command!`, ephemeral: true });
    }
 
    const { guildId } = interaction;
 
    const embed = new EmbedBuilder();
 
    try {
      const deleteResult = await suggestionSchema.deleteMany({ Guild: guildId });
      if (deleteResult.deletedCount > 0) {
        embed.setColor("Green")
          .setDescription(`:white_check_mark: The suggestion system has been disabled!`);
      } else {
        embed.setColor("Yellow")
          .setDescription(`:warning: The suggestion system was already disabled!`);
      }
      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      embed.setColor("Red")
        .setDescription(`:x: Failed to disable the suggestion system. Please try again later.`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}