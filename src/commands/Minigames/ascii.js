const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const figlet = require('figlet')
const filter = require('../../filter.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Spice up your chat, with ascii art!')
    .addStringOption(option => option.setName('text').setDescription('Specified text will be converted into art.').setRequired(true).setMaxLength(9)),
    async execute(interaction) {
        const text = interaction.options.getString('text')

        figlet(`${text}`, function (err, data) {

            if (err) {
                return interaction.reply({ content: `**Oops!** Something went **extremely** wrong, try again later!`, ephemeral: true})
            }

            if (filter.words.includes(text)) return interaction.reply({ content: `Your **message** goes against our **TOS**!`, ephemeral: true});

            const embed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setAuthor({ name: `🎨 Ascii Tool`})
            .setFooter({ text: `🎨 Ascii Art Generated`})
            .setDescription(`\`\`\`${data}\`\`\``)
            .setTitle('> Here is your art!')

            interaction.reply({ embeds: [embed] });
        
        });
    }
}