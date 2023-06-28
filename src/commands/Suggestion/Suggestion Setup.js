const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const suggestionSchema = require('../../Schemas.js/suggestionSchema');
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion-setup')
    .setDescription(`Setup the suggestion system`)
    .addChannelOption(option => option.setName('channel').setDescription(`The channel where you want all suggestions to be sent to`).setRequired(true).addChannelTypes(ChannelType.GuildText)),
  async execute(interaction, client) {
    try {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await interaction.reply({ content: `You must have the **Manage Channels** permission to use this command!`, ephemeral: true});
        return;
      }
 
      const { channel, options, guildId } = interaction;
      const suggChannel = options.getChannel('channel');
 
      const embed = new EmbedBuilder()
 
      const data = await suggestionSchema.findOne({ Guild: guildId });
 
      if (!data) {
        await suggestionSchema.create({
          Guild: guildId,
          Channel: suggChannel.id
        })
 
        embed.setColor("Green")
          .setDescription(`:white_check_mark: All suggestions will be sent to ${channel}`)
      } else if (data) {
        const ch = client.channels.cache.get(data.Channel);
        embed.setColor("Blue")
          .setDescription(`:white_check_mark: Your suggestion channel has already been set to ${ch}`)
      }
 
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: `An error occurred while executing this command.`, ephemeral: true });
    }
  }
}