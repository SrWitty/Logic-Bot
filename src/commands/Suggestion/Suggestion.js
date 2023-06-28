const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const suggestionSchmea = require('../../Schemas.js/suggestionSchema');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription(`Give a suggestion to the server`)
        .addStringOption(option => option.setName('message').setDescription(`Your suggestion`).setMaxLength(1000).setMinLength(1).setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('The suggestion type').setRequired(true)),
    async execute(interaction) {
        const rating = interaction.options.getString('message');
        const stars = interaction.options.getString('type');
 
        try {
            const data = await suggestionSchmea.findOne({ Guild: interaction.guild.id });
            if (!data) {
                await interaction.reply({ content: `The suggestion system has not been set up in this server yet!`, ephemeral: true });
                return;
            }
 
            const interactionEmbed = new EmbedBuilder()
                .setTitle(`Suggstion Posted`)
                .setDescription(`Thanks for leaving a suggestion for this server`)
                .setTimestamp();
 
            const suggestEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Suggestion: ${rating}`)
                .addFields({ name: `Type:`, value: `${stars}` })
                .addFields({ name: `Author:`, value: `${interaction.user.tag} (ID: ${interaction.user.id})` });
 
            const channel = interaction.guild.channels.cache.get(data.Channel);
            if (!channel) {
                await interaction.reply({ content: `The suggestion channel could not be found.`, ephemeral: true });
                return;
            }
 
            await interaction.reply({ embeds: [interactionEmbed] });
            await channel.send({ embeds: [suggestEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `An error occurred while executing this command.`, ephemeral: true });
        }
    }
}