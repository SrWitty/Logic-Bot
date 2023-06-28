const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const capschema = require('../../Schemas.js/verify');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verify')
    .setDMPermission(false)
    .setDescription('Configure your verification system using captcha.')
    .addSubcommand(command => command.setName('setup').setDescription('Sets up the verification system for you.').addRoleOption(option => option.setName('role').setDescription('Specified role will be given to users who are verified.').setRequired(true)).addChannelOption(option => option.setName('channel').setDescription('Specified channel will be your verify channel').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)).addStringOption(option => option.setName('content').setDescription('Specified message will be included in the verification embed.').setRequired(false).setMinLength(1).setMaxLength(1000)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables your verification system.'))
    .addSubcommand(command => command.setName('bypass').setDescription('Bypasses specified user from the verification process.').addUserOption(option => option.setName('user').setDescription('Specified user will bypass the verification process.').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Unverifies specified user from your server..').addUserOption(option => option.setName('user').setDescription('Specified user will be unverified.').setRequired(true))),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        const data = await capschema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'setup':

            const role = await interaction.options.getRole('role');
            const channel = await interaction.options.getChannel('channel');
            const message = await interaction.options.getString('content') || 'Click the button bellow to verify!';

            if (data) return await interaction.reply({ content: `You **already** have a verification system **set up**! \n> Do **/verify disable** to undo.`, ephemeral: true});
            else {

                await capschema.create({
                    Guild: interaction.guild.id,
                    Role: role.id,
                    Channel: channel.id,
                    Message: 'empty',
                    Verified: []
                })

                const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('verify')
                    .setLabel('✅ Verify')
                    .setStyle(ButtonStyle.Success)
                )

                const verify = new EmbedBuilder()
                .setColor('Green')
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
                .setTimestamp()
                .setTitle('• Verification Message')
                .setAuthor({ name: `✅ Verification Proccess`})
                .setFooter({ text: `✅ Verification Prompt`})
                .setDescription(`> ${message}`)

                interaction.reply({ content: `Your **verification system** has been set up!`, ephemeral: true});
                const msg = await channel.send({ embeds: [verify], components: [buttons] });

                await capschema.updateOne({ Guild: interaction.guild.id }, { $set: { Message: msg.id }});
            }

            break;
            case 'disable':

            if (!data) return await interaction.reply({ content: `The **verification system** has not been **set up** yet, cannot delete **nothing**..`, ephemeral: true});
            else {

                await capschema.deleteMany({ Guild: interaction.guild.id });
                const deletemsg = await client.channels.cache.get(data.Channel).messages.fetch(data.Message);
                await deletemsg.delete();

                await interaction.reply({ content: `Your **verification system** has successfully been **disabled**!`, ephemeral: true});
                
            }

            break;
            case 'bypass':

            const displayuser = await interaction.options.getUser('user');
            const user = await interaction.options.getMember('user');

            if (!data) return await interaction.reply({ content: `You **have not** set up the **verification system** yet! \n> Do **/verify setup** to set it up.`, ephemeral: true});
            else {

                if (!user) return await interaction.reply({ contnet: `The user ${displayuser} **doesn't** exist within your server.`, ephemeral: true});

                if (data.Verified.includes(displayuser.id)) return await interaction.reply({ content: `That user has **already** completed the verification process!`, ephemeral: true})
                else {
                    await capschema.updateOne({ Guild: interaction.guild.id }, { $push: { Verified: displayuser.id }});

                    const role = await interaction.guild.roles.cache.get(data.Role);

                    try {
                        await user.roles.add(role);
                    } catch (err) {
                        return await interaction.reply({ content: `I **couldn't** give ${displayuser} their **verification** role! Check my **permissions** and **role position** and try again.`, ephemeral: true});
                    }
                    
                    await interaction.reply({ content: `The user ${displayuser} has **successfuly** bypassed the **verification process**!`, ephemeral: true});
                }
            }

            break;
            case 'remove':

            const displayuser1 = await interaction.options.getUser('user');
            const user1 = await interaction.options.getMember('user');

            if (!data) return await interaction.reply({ content: `You **have not** set up the **verification system** yet! \n> Do **/verify setup** to set it up.`, ephemeral: true});
            else {

                if (!user1) return await interaction.reply({ content: `The user ${displayuser1} **doesn't** exist within your server.`, ephemeral: true});

                if (!data.Verified.includes(displayuser1.id)) return await interaction.reply({ content: `That user has **yet to** complete the verification process!`, ephemeral: true})
                else {
                    await capschema.updateOne({ Guild: interaction.guild.id }, { $pull: { Verified: displayuser1.id }});

                    const role = await interaction.guild.roles.cache.get(data.Role);

                    try {
                        await user.roles.remove(role);
                    } catch (err) {
                        return await interaction.reply({ content: `I **couldn't** remove ${displayuser1}'s **verification** role! Check my **permissions** and **role position** and try again.`, ephemeral: true});
                    }
                    
                    await interaction.reply({ content: `The user ${displayuser1} has **successfuly** been **unverified**!`, ephemeral: true});
                }
            }
        }
    }
}