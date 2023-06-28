const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require("../../Schemas.js/level");;
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp-reset')
    .setDescription('Resets ALL of the server members xp & levels'),
    async execute(interaction, client) {
 
                const perm = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`<:redcheck:1015276845077364848>  You don't have permission to reset xp levels in this server`)
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })
 
                const { guildId } = interaction;
 
                const embed = new EmbedBuilder()
 
                levelSchema.deleteMany({ Guild: guildId}, async (err, data) => {
 
                    embed.setColor("Blue")
                    .setDescription(`<:orangecheck:1015276791889408070>  The xp system in your server has been reset`)
 
                    return interaction.reply({ embeds: [embed] });
                })
    }
}