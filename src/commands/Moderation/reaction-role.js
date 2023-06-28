const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const reactschema = require('../../Schemas.js/reactionroles');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reaction-role')
    .setDescription('Configure your reaction role messages.')
    .setDMPermission(false)
    .addSubcommand(command => command.setName('add').setDescription('Adds a reaction role emoji to a message.').addStringOption(option => option.setName('message-id').setDescription('Specified message ID will receive the reaction role emoji.').setMinLength(1).setMaxLength(200).setRequired(true)).addRoleOption(option => option.setName('role').setDescription('Specified role will be given to members.').setRequired(true)).addStringOption(option => option.setName('emoji').setDescription('Specified emoji will be your reaction emoji.').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Remove a reaction role emoji to a message.').addStringOption(option => option.setName('message-id').setDescription(`Specified message ID will be the message which will have it's reaction disabled.`).setMinLength(1).setMaxLength(200).setRequired(true)).addStringOption(option => option.setName('emoji').setDescription('Specified emoji will be removed from your message.').setRequired(true))),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        const id = await interaction.options.getString('message-id');
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'add':

            const adddata = await reactschema.find({ MessageID: id });
            const role = await interaction.options.getRole('role');
            const emoji = await interaction.options.getString('emoji');

            try {
                await interaction.channel.messages.fetch(id);
            } catch (err) {
                return await interaction.reply({ content: `An **error** occured, message **not** found! \n> You need to **execute** this command in the same channel as the **message** you are trying to add a **reaction role** to!`, ephemeral: true})             
            }
            
            await interaction.deferReply();

            await Promise.all(adddata.map(async data => {
                if (data.Roles === role.id) return await interaction.editReply({ content: `Specified role already **exists** as a **reaction role** for this **message**!`, ephemeral: true});

                const reactedemoji = await interaction.guild.emojis.cache.find(emoji1 => emoji1.name === emoji);
                if (!reactedemoji) return await interaction.editReply({ content: `🔎 Searching for your **emoji**.. no results yet!`, ephemeral: true})

                if (data.Emoji === reactedemoji.id) return await interaction.editReply({ content: `Specified emoji has already **been used** as a **reaction emoji** for this **message**!`, ephemeral: true});
            }))

            const reactemoji = await interaction.guild.emojis.cache.find(emoji1 => emoji1.name === emoji);

            await reactschema.create({
                Roles: role.id,
                MessageID: id,
                Emoji: reactemoji.id
            })
            
            const addembed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTimestamp()
            .setTitle('> Reaction role Added')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setFooter({ text: `💳 Reaction Role Added`})
            .setAuthor({ name: `💳 Reaction Role Tool`})
            .addFields({ name: `• Reaction Emoji`, value: `> ${reactemoji}`})
            .addFields({ name: `• Reaction Role`, value: `> ${role}`})
            .addFields({ name: `• Message ID`, value: `> ${id}`})

            await interaction.editReply({ embeds: [addembed], content: `` });
            const msg = await interaction.channel.messages.fetch(id);

            try {
                await msg.react(reactemoji);
            } catch (err) {
                return;
            }

            break;
            case 'remove':

            const removeemoji = await interaction.options.getString('emoji');

            const removereactemoji = await interaction.guild.emojis.cache.find(emoji1 => emoji1.name === removeemoji);
            if (!removereactemoji) return await interaction.reply({ content: `That emoji **does not** exist!`, ephemeral: true})

            const removedata = await reactschema.findOne({ MessageID: id, Emoji: removereactemoji.id });
            if (!removedata) return await interaction.reply({ content: `You **have not** set up your message to use specified **emoji**!`, ephemeral: true});

            await reactschema.deleteOne({ MessageID: id, Emoji: removereactemoji.id})

            const removembed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTimestamp()
            .setTitle('> Reaction role Removed')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setFooter({ text: `💳 Reaction Role Removed`})
            .setAuthor({ name: `💳 Reaction Role Tool`})
            .addFields({ name: `• Reaction Emoji`, value: `> ${removereactemoji}`})
            .addFields({ name: `• Message ID`, value: `> ${id}`})

            await interaction.reply({ embeds: [removembed] });
            const removemsg = await interaction.channel.messages.fetch(id);

            try {
                await removemsg.reactions.cache.get(removereactemoji.id).remove();
            } catch (err) {
                return;
            }
        }
    }
}