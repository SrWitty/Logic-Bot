const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/ecoSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer Coins to another user.')
    .addUserOption(option =>
      option
        .setName('recipient')
        .setDescription('The user to transfer Coins to.')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('The amount to transfer.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('The reason for the transfer.')
        .setRequired(false)
    ),
  async execute(interaction) {
    const sender = interaction.user;
    const recipient = interaction.options.getUser('recipient');
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason');

    if (amount <= 0)
      return await interaction.reply({ content: '**Please enter a valid amount greater than zero.**', ephemeral: true });

    const senderData = await ecoSchema.findOne({ Guild: interaction.guild.id, User: sender.id });
    const recipientData = await ecoSchema.findOne({ Guild: interaction.guild.id, User: recipient.id });

    if (!senderData)
      return await interaction.reply({ content: `<@${sender.id}> **has not** opened an account yet. Open an account using the \`/economy\` command.`, ephemeral: true });

    if (!recipientData)
      return await interaction.reply({ content: `<@${recipient.id}> **has not** opened an account yet. They need to open an account first.`, ephemeral: true });

    if (senderData.Wallet < amount)
      return await interaction.reply({ content: '**You do not have enough Coins in your wallet to complete the transfer.**', ephemeral: true });

    senderData.Wallet -= amount;
    recipientData.Wallet += amount;

    await senderData.save();
    await recipientData.save();

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTimestamp()
      .setAuthor({ name: '💸 Economy System' })
      .setFooter({ text: '💸 Coins Transferred' })
      .setTitle('> Transfer Complete')
      .addFields({ name: '• Sender', value: `> ${sender.username}` })
      .addFields({ name: '• Recipient', value: `> ${recipient.username}` })
      .addFields({ name: '• Amount', value: `> $${amount}` })
      .addFields({ name: '• Reason', value: `> ${reason}` });

    await interaction.reply({ embeds: [embed] });

    const recipientEmbed = new EmbedBuilder()
      .setColor('Green')
      .setTimestamp()
      .setAuthor({ name: '💸 Economy System' })
      .setFooter({ text: '💸 Coins Received' })
      .setTitle('> Coins Received')
      .setDescription(`You have received a transfer of $${amount}`)
      .addFields({ name: '• Sender', value: `> ${sender.username}.` })
      .addFields({ name: '• Reason', value: `> ${reason}` });

    recipient.send({ embeds: [recipientEmbed] });
  },
};
