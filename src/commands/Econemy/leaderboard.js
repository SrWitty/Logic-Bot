const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder, ChannelType } = require('discord.js');
const levelSchema = require ("../../Schemas.js/level");
const fetch = require("node-fetch");
const levelschema = require('../../Schemas.js/levelsetup');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDMPermission(false)
    .setDescription(`Displays the Rank leaderboard.`),
    async execute(interaction) {

        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });
        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `The **Administrators** of this server **have not** set up the **leveling system** yet!`, ephemeral: true});

        const { guild, client } = interaction;

        let text = ` `;

        const embed1 = new EmbedBuilder()
        .setColor("Purple")
        .setAuthor({ name: '⬆ No rank results found'})
        .setTitle('No results found')
        .setDescription('> No one is on the **leaderboard**!')
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
        .setFooter({ text: '⬆ Rank Leaderboard'})

        const Data = await levelSchema.find({ Guild: guild.id})
        .sort ({
            XP: -1,
            Level: -1
        })
        .limit(10)

        if (!Data) return await interaction.reply({ embeds: [embed1]})

        await interaction.deferReply();

        for (let counter = 0; counter < Data.length; ++counter) {
            
            let { User, XP, Level } = Data[counter];

            const value = await client.users.fetch(User) || 'Unknown Member'

            const member = value.tag;
            
            text += `#**${counter + 1}** ${member} - **XP:** ${XP} - **Level:** ${Level} \n`

            const leaderboardembed = new EmbedBuilder()
            .setColor('Purple')
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setTitle(`> ${interaction.guild.name}'s Leaderboard`)
            .setDescription(`${text}`)
            .setFooter({ text: `⬆ Rank Leaderboard`})
            .setAuthor({ name: '⬆ Rank results Found'})

            interaction.editReply({ embeds: [leaderboardembed] })
        }
    }
}