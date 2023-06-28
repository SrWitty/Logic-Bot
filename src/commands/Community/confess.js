const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const confessschema = require('../../Schemas.js/confess');
var timeoutv = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('confess')
    .setDMPermission(false)
    .setDescription('Confess something privately or set up the confession system.')
    .addSubcommand(command => command.setName('send').setDescription('Confess specified message privately.').addStringOption(option => option.setName('message').setDescription('Specified message will be sent privately.').setMinLength(1).setMaxLength(4000).setRequired(true)))
    .addSubcommand(command => command.setName('setup').setDescription('Sets up your confession system.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will be your confession channel.').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)).addChannelOption(option => option.setName('logs').setDescription('Enable logs for your confession system.').setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)).addIntegerOption(option => option.setName('timeout').setDescription('Set your timeout time for this command (in Seconds).').setRequired(false).setMinValue(5).setMaxValue(86400)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables your confession system.')),
    async execute(interaction, err) {

        const sub = interaction.options.getSubcommand();
        const confessdata = await confessschema.findOne({ Guild: interaction.guild.id });

        switch (sub) {
            case 'setup':

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

            const channel = interaction.options.getChannel('channel');
            const logs = interaction.options.getChannel('logs');
            const timeout = interaction.options.getInteger('timeout') || 5;
            const time = timeout * 1000;

            if (confessdata) return await interaction.reply({ content: `You **already** have a confessions channel **set up!** \n> Do **/confess disable** to undo.`, ephemeral: true});
            else {

                if (logs) {

                    await confessschema.create({
                        Guild: interaction.guild.id,
                        Timeout: time,
                        Channel: channel.id,
                        Logs: logs.id
                    })

                } else {

                    await confessschema.create({
                        Guild: interaction.guild.id,
                        Timeout: time,
                        Channel: channel.id,
                        Logs: ' '
                    })

                }

                const setupembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle('> Confession System set up')
                .setTimestamp()
                .setAuthor({ name: `🕵️‍♀️ Confession System`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                .setFooter({ text: `🕵️‍♀️ Channel Set Up`})
                .addFields({ name: `• System was set up`, value: `> Your channel (${channel}) will \n> now act as your confession \n> channel!`})
                .addFields({ name: `• Options`, value: `> **Logs:** ${logs} \n> **Timeout:** ${timeout}s`})

                await interaction.reply({ embeds: [setupembed] });
            }

            break;
            case 'disable':

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

            if (!confessdata) return await interaction.reply({ content: `You **do not** have a confessions channel **set up!** \n> Do **/confess setup** to set one up.`, ephemeral: true});
            else {

                await confessschema.deleteMany({ Guild: interaction.guild.id });

                const disableembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle('> Confession System Disabled')
                .setAuthor({ name: `🕵️‍♀️ Confession System`})
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                .setFooter({ text: `🕵️‍♀️ Confession System Disabled`})
                .addFields({ name: `• System was disabled`, value: `> Your channel (<#${confessdata.Channel}>) will \n> no longer work as your \n> confession channel!`})

                await interaction.reply({ embeds: [disableembed] });
            }

            break;
            case 'send':

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && timeoutv.includes(interaction.member.id)) return await interaction.reply({ content: 'You are on cooldown! You **cannot** execute **/confess send**.', ephemeral: true})

            const timeouttime = confessdata.Timeout;

            timeoutv.push(interaction.user.id);
            setTimeout(() => {
                timeoutv.shift();
            }, timeouttime)

            let message = interaction.options.getString('message');
            const confesschannel = await interaction.guild.channels.cache.get(confessdata.Channel);

            if (!confesschannel) {
                return await interaction.reply({ content: `The **confess** channel is **corrupted**! Please ask your server's **Administrators** to set up the system again!`, ephemeral: true});
            }

            if (!message) {
                message = 'User **did not** provide a message'
            }

            const messageembed = new EmbedBuilder()
            .setColor('DarkRed')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setFooter({ text: `🕵️‍♀️ Message Received`})
            .setAuthor({ name: `🕵️‍♀️ Confession System`})
            .setTimestamp()
            .setTitle('> Anonymous Says:')
            .setDescription(`${message}`)

            await confesschannel.send({ embeds: [messageembed] }).catch(err);

            if (confessdata.Logs) {

                const logschannel = await interaction.guild.channels.cache.get(confessdata.Logs);
                if (!logschannel) return await interaction.reply({ content: `Your **message** has been sent **successfuly**!`, ephemeral: true});

                const logembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                .setAuthor({ name: `🕵️‍♀️ Confession System`})
                .setFooter({ text: `🕵️‍♀️ Log Collected`})
                .setTimestamp()
                .setTitle(`> ${interaction.user.tag} Sent:`)
                .setDescription(`${message}`)

                await logschannel.send({ embeds: [logembed] }).catch(err);

                await interaction.reply({ content: `🕵️‍♀️ Your **message** has been sent **successfuly**!`, ephemeral: true})

            } else {

                await interaction.reply({ content: `🕵️‍♀️ Your **message** has been sent **successfuly**!`, ephemeral: true})

            }   
        }
    }
}