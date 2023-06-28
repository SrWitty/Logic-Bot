const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fetch = require("node-fetch")

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dictionary')
    .setDescription('Get information about a word!')
    .addStringOption(option => option.setName('word').setDescription('The word you want to look up on the dictionary.').setRequired(true).setMaxLength(100)),
    async execute (interaction) {

        const word = interaction.options.getString('word');

        if (timeout.includes(interaction.user.id) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You are on cooldown! You **cannot** execute /dictionary.', ephemeral: true})
        
        let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

        if (data.statusText == `Not found`) {
            return interaction.reply({ content: 'That word **does not** exist.', ephemeral: true});
        }

        let info = await data.json();
        let result = info[0];

        let embedInfo = await result.meanings.map((data, index) => {

            let definition =  data.definitions[0].definition || 'No definition **found**.';
            let example = data.definitions[0].example || 'No example **found**.';

            return {
                name: data.partOfSpeech.toUpperCase(),
                value: `> • Definition: ${definition} \n> • Example: ${example}`
            };


        });

        const embed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle(`> The word "${result.word}" was looked up in the Dictionary!`)
        .addFields(embedInfo)
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
        .setFooter({ text: ('📜 Dictionary Playground')})
        .setAuthor({ name: ('📜 The Dictionary has found the Definition!')})


        await interaction.reply({embeds: [embed]});

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 10000)
    }
}