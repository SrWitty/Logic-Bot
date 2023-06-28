const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/economy');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDMPermission(false)
    .setDescription('Withdraws specified amount of money from your bank into your wallet.')
    .addStringOption(option => option.setName('amount').setDescription('Specified amount of currency will be transfered to your wallet.').setRequired(true)),
    async execute(interaction) {

        const amount = interaction.options.getString('amount');
        const { options, user, guild } = interaction;
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id });

        if (!Data) return await interaction.reply({ content: `You **do not** have an account to do that. \n> Do **/economy** to create an account.`, ephemeral: true});
        if (amount.startsWith('-')) return await interaction.reply({ content: `You **cannot** withdraw negative values.`, ephemeral: true})

        if (amount.toLowerCase() === 'all') {
            if(Data.Bank === 0) return await interaction.reply({ content: `You **can not** withdraw any money because your bank is **empty**.`, ephemeral: true});

            Data.Wallet += Data.Bank;
            Data.Bank = 0;

            const embed1 = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`Withdraw Successful`)
            .setAuthor({ name: `🟡 Economy System`})
            .setDescription(`> ${user.username} has withdrawn all of \n> their money from their bank`)
            .setFooter({ text: '🟡 Currency Withdrawn from Bank'})
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1084019710892449792/largeyellow.png')

            await Data.save();

            return await interaction.reply({ embeds: [embed1] })
        } else {
            const Converted = Number(amount);
            
            if(isNaN(Converted) === true) return await interaction.reply({ content: `The number inputed **is not valid**. \n> Inputed value must be a **number** or alternetely **all**.`, ephemeral: true});

            if (Data.Bank < parseInt(Converted) || Converted === Infinity) return await interaction.reply({ content: `Eligible funds. You **cannot** transfer more than your **banks**'s balance to your wallet.`, ephemeral: true});

            Data.Wallet += parseInt(Converted);
            Data.Bank -= parseInt(Converted);
            Data.Bank = Math.abs(Data.Bank);

            await Data.save();

            const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`Withdraw Successful`)
            .setAuthor({ name: `🟡 Economy System`})
            .setDescription(`> ${user.username} has withdrawn \n> $**${parseInt(Converted)}** from their bank`)
            .setFooter({ text: '🟡 Currency Withdrawn from Bank'})
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1084019710892449792/largeyellow.png')

            return await interaction.reply({ embeds: [embed]})
        }

    }
}