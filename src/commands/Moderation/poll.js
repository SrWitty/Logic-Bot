const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const pollschema = require('../../Schemas.js/votes');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll-send')
    .setDescription('send a poll')
    .addStringOption(option => option.setName('topic').setDescription('your topic').setRequired(true).setMinLength(1).setMaxLength(2000)),
    async execute(interaction) {
 
        await interaction.reply({ content: `Your poll has began!`})
        const topic = await interaction.options.getString('topic')
 
        const embed = new EmbedBuilder()
        .setColor("#ecb6d3")
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1101856064045072505/largepink.png')
        .setAuthor({ name: `🤚 Poll System`})
        .setFooter({ text: `🤚 Poll Started`})
        .setTimestamp()
        .setTitle('• Poll Began')
        .setDescription(`> ${topic}`)
        .addFields({ name: `• Upvotes`, value: `> **No votes**`, inline: true})
        .addFields({ name: `• Downvotes`, value: `> **No votes**`, inline: true})
        .addFields({ name: `• Author`, value: `> ${interaction.user}`})
 
        const buttons = new ActionRowBuilder()
        .addComponents(
 
        new ButtonBuilder()
        .setCustomId('up')
        .setLabel(' ')
        .setEmoji('<:tick:1102942811101335593>')
        .setStyle(ButtonStyle.Secondary),
 
        new ButtonBuilder()
        .setCustomId('down')
        .setLabel(' ')
        .setEmoji('<:crossmark:1102943024415260673>')
        .setStyle(ButtonStyle.Secondary),
 
        new ButtonBuilder()
        .setCustomId('votes')
        .setLabel('• Votes')
        .setStyle(ButtonStyle.Secondary)
        )
 
        const msg = await interaction.channel.send({ embeds: [embed], components: [buttons] });
        msg.createMessageComponentCollector();
 
        await pollschema.create({
            Msg: msg.id,
            Upvote: 0,
            Downvote: 0,
            UpMembers: [],
            DownMembers: [],
            Guild: interaction.guild.id,
            Owner: interaction.user.id
        })
    }
}