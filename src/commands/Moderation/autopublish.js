const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const publishschema = require('../../Schemas.js/autopublish');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('auto')
    .setDMPermission(false)
    .setDescription('Configure your auto publisher system.')
    .addSubcommand(command => command.setName('publisher-add').setDescription('Adds a channel to the auto publisher channel list.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will be added to the publisher channel list.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement)))
    .addSubcommand(command => command.setName('publisher-remove').setDescription('Removes a channel from the auto publisher channel list.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will be removed from the publisher channel list.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement)))
    .addSubcommand(command => command.setName('publisher-remove-all').setDescription('Removes all channels from the auto publisher channel list')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        const sub = interaction.options.getSubcommand();
        const channel = await interaction.options.getChannel('channel');
 
        switch (sub) {
 
            case 'publisher-add':
 
            const data = await publishschema.findOne({ Guild: interaction.guild.id });
 
            const addembed = new EmbedBuilder()
            .setColor("#ecb6d3")
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1101856064045072505/largepink.png')
            .setAuthor({ name: `📢 Auto Publisher`})
            .setFooter({ text: `📢 Publisher Added`})
            .setTimestamp()
            .setTitle('> Channel Added')
            .addFields({ name: `• Publisher Added`, value: `> Added your channel to the list!`})
            .addFields({ name: `• Channel`, value: `> ${channel}`})
 
            if (!data) {
 
                await interaction.reply({ embeds: [addembed] })
 
                await publishschema.create({
                    Guild: interaction.guild.id,
                    Channel: [ ]
                })
 
                await publishschema.updateOne({ Guild: interaction.guild.id }, { $push: { Channel: channel.id }});
 
            } else {
 
                if (data.Channel.includes(channel.id)) return await interaction.reply({ content: `The channel ${channel} is **already** in the **publisher** list!`, ephemeral: true });
                else {
                    await interaction.reply({ embeds: [addembed] });
                    await publishschema.updateOne({ Guild: interaction.guild.id }, { $push: { Channel: channel.id }});
                }
 
            }
 
            break;
            case 'publisher-remove':
 
            const data1 = await publishschema.findOne({ Guild: interaction.guild.id });
 
            if (!data1) {
 
                return await interaction.reply({ content: `You have **not** added **any** channels to the **publisher system**, cannot remove **nothing**..`, ephemeral: true})
 
            } else {
 
                if (!data1.Channel.includes(channel.id)) return await interaction.reply({ content: `The channel ${channel} is **not** in the **publisher** list!`, ephemeral: true });
                else {
 
                    const removeembed = new EmbedBuilder()
                    .setColor("#ecb6d3")
                    .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1101856064045072505/largepink.png')
                    .setAuthor({ name: `📢 Auto Publisher`})
                    .setFooter({ text: `📢 Publisher Removed`})
                    .setTimestamp()
                    .setTitle('> Channel Removed')
                    .addFields({ name: `• Publisher Removed`, value: `> Removed your channel from the list!`})
                    .addFields({ name: `• Channel`, value: `> ${channel}`})
 
 
                    await interaction.reply({ embeds: [removeembed] });
                    await publishschema.updateOne({ Guild: interaction.guild.id }, { $pull: { Channel: channel.id }});
                }
 
            }
 
            break;
            case 'publisher-remove-all':
 
            const data4 = await publishschema.findOne({ Guild: interaction.guild.id });
 
            if (!data4) {
                return await interaction.reply({ content: `You have **not** added **any** channels to the **publisher system**, cannot remove **nothing**..`, ephemeral: true})
            } else {
                await interaction.reply({ content: `**All** your **announcement** channels have been **removed** from the **publisher** channel list.`, ephemeral: true});
 
                await publishschema.deleteMany({
                    Guild: interaction.guild.id
                })
            }
        }
    }
}
 
 
 
 