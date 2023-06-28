const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode of a channel')
    .addIntegerOption(option => option.setName('duration').setDescription('The time of the slowmode').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel you want to set the slowmode of').addChannelTypes(ChannelType.GuildText).setRequired(false)),
    async execute (interaction) {
 
        const { options } = interaction;
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;
 
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${channel} now has ${duration} seconds of **slowmode**`)
 
        channel.setRateLimitPerUser(duration).catch(err => {
            return;
        });
 
        await interaction.reply({ embeds: [embed] });
    }
}