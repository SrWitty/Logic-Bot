const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const quotes = require('../../quotes.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Gives you a random famous quote.'),
    async execute(interaction) {

        const randomizer = Math.floor(Math.random() * quotes.length);

        const embed = new EmbedBuilder()
        .setColor('DarkBlue')
        .setAuthor({ name: `🤔 Quote Carpet`})
        .setFooter({ text: `🤔 Quote Fetched`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
        .setTimestamp()
        .addFields({ name: `• Quote`, value: `> ${quotes[randomizer].text}`})
        .addFields({ name: `• Author`, value: `> ${quotes[randomizer].from}`})

        await interaction.reply({ embeds: [embed] });
    }
}