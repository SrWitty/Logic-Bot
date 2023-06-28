const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const ecoS = require('../../Schemas.js/ecoSchema');
 
var timeout = [];
 
module.exports = {
    data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('daily')
    .setDescription('Allows you to claim a random amount of currency each day.'),
 
    async execute(interaction) {
        const { options, guild, user } = interaction;
        
        let data = await ecoS.findOne({ Guild: guild.id, User: user.id });
 
        if (timeout.includes(interaction.user.id) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: "You have **already** claimed your daily amount! Please check back **later**.", ephemeral: true });
 
        if (!data) return await interaction.reply({ content: "You **do not** have an account yet! \n> Do **/economy** to configure your account.", ephemeral: true });
        else {
            const randAmount = Math.round((Math.random() * 3000) + 10);
 
            data.Wallet += randAmount;
            data.save();
 
            const embed = new EmbedBuilder()
                .setAuthor({ name: `🟡 Economy System`})
                .setFooter({ text: `🟡 Daily Claimed`})
                .setColor('Yellow')
                .setTitle('> Daily Allowance Claimed')
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1084019710892449792/largeyellow.png')
                .setDescription(`• Amount: **$${randAmount}**\n• Next claim available: **12 hours**`)
                .setTimestamp();
 
            await interaction.reply({ embeds: [embed] });
 
            timeout.push(interaction.user.id);
            setTimeout(() => {
                timeout.shift();
            }, 43200000);
        }
    }
}