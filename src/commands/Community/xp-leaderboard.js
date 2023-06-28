const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, DiscordAPIError } = require('discord.js');
const levelSchema = require("../../Schemas.js/level");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp-leaderboard')
    .setDescription('This gets a servers xp leaderboard'),
    async execute(interaction) {
 
        const { guild, client } = interaction;
 
        let text = "";
 
        const embed1 = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`<:redcheck:1015276845077364848>  No one is on the leaderboard yet...`)
 
        const Data = await levelSchema.find({ Guild: guild.id})
            .sort({ 
                XP: -1,
                Level: -1
            })
            .limit(10)
 
            if (!Data) return await interaction.reply({ embeds: [embed1]})
 
            await interaction.deferReply()
 
            for(let counter = 0; counter < Data.length; ++counter) {
                let { User, XP, Level } = Data[counter]
 
                    const value = await client.users.fetch(User) || "Unknown Member"
 
                    const member = value.tag;
 
                    text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`
 
                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
                        .setDescription(`\`\`\`${text}\`\`\``)
                        .setTimestamp()
                        .setFooter({ text: `XP Leaderboard` })
 
                   interaction.editReply({ embeds: [embed] })
 
            } 
 
    }
}