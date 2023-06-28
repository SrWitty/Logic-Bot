const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pp')
        .setDescription('Displays the size of your pp.'),
    async execute(interaction) {
        const penisSize = Math.floor(Math.random() * 10) + 1;
        let penismain = '8';
        for (let i = 0; i < penisSize; i++) {
            penismain += '=';
        }


        const penisEmbed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setTimestamp()
            .setTitle(`${interaction.user.username}'s PP Size 😳`)
            .setFooter({ text: `🍆 PP Size`})
            .setAuthor({ name: `🍆 PP Displayed`})
            .setDescription(`> Your PP size is  **${penismain}D**`);

        await interaction.reply({ embeds: [penisEmbed] });
    },
}; 