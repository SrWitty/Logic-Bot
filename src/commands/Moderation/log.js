const {SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType}= require('discord.js');
const logSchema = require("../../Schemas.js/logschema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Configure your logging system.")
    .addSubcommand(command => command.setName('setup').setDescription('Sets up your logging system.').addChannelOption(option => option.setName("channel").setDescription("Specified channel will receive logs.").setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables your logging system.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
 
        const sub = await interaction.options.getSubcommand();
        const data = await logSchema.findOne({ Guild: interaction.guild.id });
 
        switch (sub) {
            case 'setup':
 
            if (data) return await interaction.reply({ content: `You have **already** set up the logging system! \n> Do **/logs disable** to undo.`, ephemeral: true});
            else {
 
                const logchannel = interaction.options.getChannel("channel") || interaction.channel;
 
                const setupembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTimestamp()
                .setAuthor({ name: `🚧 Logging System`})
                .setFooter({ text: `🚧 Logging Enabled`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                .setTitle('> Logging Enabled')
                .addFields({ name: `• Logging was Enabled`, value: `> Your logging system has been set \n> up successfuly. Your channel will \n> now receive alerts for actions taken \n> in your server!`})
                .addFields({ name: `• Channel`, value: `> ${logchannel}`})
 
                await interaction.reply({ embeds: [setupembed] });
 
                await logSchema.create({
                    Guild: interaction.guild.id,
                    Channel: logchannel.id
                })
            }
 
            break;
            case 'disable':
 
            if (!data) return await interaction.reply({ content: `You have **not** set up the logging system! \n> Do **/logs setup** to set it up.`, ephemeral: true});
            else {
 
                const disableembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTimestamp()
                .setAuthor({ name: `🚧 Logging System`})
                .setFooter({ text: `🚧 Logging Disabled`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                .setTitle('> Logging Disabled')
                .addFields({ name: `• Logging was Disabled`, value: `> Your logging system has been disabled \n> successfuly. Your logging channel will \n> no longer receive alerts for actions taken \n> in your server!`})
 
                await interaction.reply({ embeds: [disableembed] });
 
                await logSchema.deleteMany({ Guild: interaction.guild.id })
            }
        }          
    }
}