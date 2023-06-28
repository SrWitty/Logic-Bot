const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('how')
    .setDescription('Calculates how much of specified topic you are.')
    .addSubcommand(command => command.setName('gay').setDescription('Shows how gay you are, results are accurate.').addUserOption(option => option.setName('user').setDescription(`Specified user's gay percentage will be displayed.`)))
    .addSubcommand(command => command.setName('sus').setDescription('Shows how sus you are, results are accurate.').addUserOption(option => option.setName('user').setDescription(`Specified user's sus percentage will be displayed.`)))
    .addSubcommand(command => command.setName('stupid').setDescription('Shows how stupid you are, results are accurate.').addUserOption(option => option.setName('user').setDescription(`Specified user's stupidity percentage will be displayed.`))),
    async execute(interaction) {

        const sub = interaction.options.getSubcommand();
        let target = interaction.options.getUser('user') || interaction.user;
        let randomizer = Math.floor(Math.random() * 101);

        switch (sub) {
            case 'gay':

            const embed = new EmbedBuilder()
            .setTitle(`> How gay is ${target.username}?`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🌈 How Gay Tool`})
            .setFooter({ text: `🌈 Gay Percentage`})
            .setColor('Purple')
            .addFields({ name: `• Percentage`, value: `> ${target} is ${randomizer}% **gay** 🍆`})
            .setTimestamp()

            await interaction.reply({embeds: [embed] });

            break;
            case 'sus':

            const embed1 = new EmbedBuilder()
            .setTitle(`> How sus is ${target.username}?`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🤨 How Sus Tool`})
            .setFooter({ text: `🤨 Sus Percentage`})
            .setColor('DarkRed')
            .addFields({ name: `• Percentage`, value: `> ${target} is ${randomizer}% **sus** 🤨`})
            .setTimestamp()

            await interaction.reply({embeds: [embed1] });

            break;
            case 'stupid':

            const embed2 = new EmbedBuilder()
            .setTitle(`> How stupid is ${target.username}?`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🤓 How stupid Tool`})
            .setFooter({ text: `🤓 stupid Percentage`})
            .setColor('DarkRed')
            .addFields({ name: `• Percentage`, value: `> ${target} is ${randomizer}% **stupid** 🤓`})
            .setTimestamp()

            await interaction.reply({embeds: [embed2] });
        } 
    }
}