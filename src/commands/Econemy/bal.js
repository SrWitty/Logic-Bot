const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const ecoSchema = require('../../Schemas.js/ecoSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bal')
    .addUserOption(option => option.setName('user').setDescription(`Specified user's balance will be displayed.`).setRequired(false))
    .setDescription('Displays your economy balance.')
    .setDMPermission(false),
    async execute(interaction) {

        const  {user, guild} = interaction;

        const userselected = interaction.options.getUser('user') || interaction.user;

        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: userselected.id});

        if (!Data) return await interaction.reply({ content: `<@${userselected.id}> **has not** opened an account yet, you cannot check an empty balance :( \n> Do **/economy** to open your account.`, ephemeral: true});

        const wallet = Math.round(Data.Wallet);
        const bank = Math.round(Data.Bank);
        const total = Math.round(Data.Wallet) + Math.round(Data.Bank);

        const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1084019710892449792/largeyellow.png')
        .setTimestamp()
        .setAuthor({ name: `🟡 Economy System`})
        .setFooter({ text: `🟡 Balance Displayed`})
        .setTitle(`> ${userselected.username}'s Balance`)
        .addFields({ name: `• Wallet Balance`, value: `> $${wallet}`})
        .addFields({ name: `• Bank Balance`, value: `> $${bank}`})
        .addFields({ name: `• Total Balance`, value: `> $${total}`})

        await interaction.reply({ embeds: [embed] });
    }
}