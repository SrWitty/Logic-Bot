const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const countingschema = require('../../Schemas.js/counting.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('counting')
    .setDMPermission(false)
    .setDescription('Config your counting system.')
    .addSubcommand(command => command.setName('setup').setDescription('Sets up the counting system for you.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will be your counting channel.').setRequired(true).addChannelTypes(ChannelType.GuildText)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables the counting system for your server.')),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        const sub = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');
        const data = await countingschema.findOne({ Guild: interaction.guild.id });

        switch (sub) {

            case 'setup':

            if (data) return await interaction.reply({ content: `You **already** have a counting system set up in this server!`, ephemeral: true})
            else {

                countingschema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Count: 0,
                    LastUser: ' ',
                })

                const embed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setTimestamp()
                .setTitle('> Counting Setup')
                .setAuthor({ name: `🔢 Counting System`})
                .setFooter({ text: `🔢 Counting was Setup`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
                .addFields({ name: `• System Setup`, value: `> Your channel (${channel}) was set up to be \n> your counting channel!`})

                await interaction.reply({ embeds: [embed]})
                channel.send('This channel has been **set up** to be a **counting** channel!').catch(err => {
                    return;
                })
            }

            break;

            case 'disable':

            if (!data) return await interaction.reply({ content: `No **counting system** found, cannot delete nothing..`, ephemeral: true})
            else {

                await countingschema.deleteMany({ Guild: interaction.guild.id});

                await interaction.reply({ content: `Your **counting system** has been disabled!`, ephemeral: true})

            }
        }
    }
}