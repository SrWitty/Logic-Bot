const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('who-is')
    .setDMPermission(false)
    .addUserOption(option => option.setName('user').setDescription("The user who you are targetting.").setRequired(false))
    .setDescription('Get the information of a User within your Guild!'),
    async execute (interaction) {

        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id)
        const icon = user.displayAvatarURL();
        const tag = user.tag;
        
        const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: tag, iconURL: icon})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .addFields({ name: "• Username", value: `> ${user}`, inline: false})
        .addFields({ name: "• Roles", value: `> ${member.roles.cache.map(r => r).join(' ')}`, inline: false})
        .addFields({ name: "• Joined Server", value: `> <t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true})
        .addFields({ name: "• Joined Discord", value: `> <t:${parseInt(user.createdAt / 1000)}:R>`, inline: true})
        .setFooter({ text: `🔎 User ID: ${user.id}`})
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}