const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Embed } = require('discord.js');
const fetch = require("node-fetch")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('memes')
    .setDescription('Get a random meme, for free! What more to ask..'),
    async execute(interaction) {

        async function meme() {
            await fetch(`https://www.reddit.com/r/memes/random.json`)
            .then (async r => {

                let meme = await r.json();
                let title = meme[0].data.children[0].data.title;
                let image = meme[0].data.children[0].data.url;
                let author = meme[0].data.children[0].data.author;

                const embed = new EmbedBuilder()
                .setColor("DarkBlue")
                .setTitle(`> Random meme Generated!`)
                .addFields({ name: '• Your Legendary Meme', value: `> ${title}`})
                .setImage(`${image}`)
                .setAuthor({ name: `😂 Random Meme Tool`})
                .setFooter({ text: `😂 Memes Playground`})
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')

                await interaction.reply({ embeds: [embed]})

            })
        }
        
        meme();
    }
}