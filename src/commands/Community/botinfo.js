const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js');
const { performance } = require('perf_hooks');
const os = require('os');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription(`Shows LogicBot's information.`)
    .addSubcommand(command => command.setName('stats').setDescription('Shows some basic statistics about Elementor Bot.'))
    .addSubcommand(command => command.setName('specs').setDescription('Shows the specifications that Elementor Bot uses.'))
    .addSubcommand(command => command.setName('ping').setDescription(`Displays the bot's ping... Pong.. PANG!!`))
    .addSubcommand(command => command.setName('online').setDescription(`Shows the online status of Elementor Bot, a great way to see if our bot works!`)),
    async execute(interaction, client) {
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
        case 'stats':
 
        let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);
 
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
 
        let uptime = `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`;
 
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/JP3UaweEsn"),
 
            new ButtonBuilder()
            .setLabel('Bot Invite')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1049707375952679032&permissions=137439292488&scope=bot%20applications.commands")
        )
 
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`> Bot's Statistics`)
        .setAuthor({ name: '🤖 Bot Statistics Tool'})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
        .setFooter({ text: `🤖 LogicBot's statistics`})
        .setTimestamp()
        .addFields({ name: '• Servers Count', value: `> ${client.guilds.cache.size}`, inline: true})
        .addFields({ name: '• Members Count', value: `> ${servercount}`, inline: true})
        .addFields({ name: '• Latency', value: `> ${Math.round(client.ws.ping)}ms`, inline: false})
        .addFields({ name: '• Uptime', value: `> ${uptime}`, inline: false})
 
        await interaction.reply({ embeds: [embed], components: [button] })
 
        break;
        case 'specs':
 
        const usage2 = process.memoryUsage();
        const usage = process.cpuUsage();
        const usagePercent = usage.system / usage.user * 100;
        const usagePercent2 = usage2.system / usage2.user * 100;
        const memoryUsed = (os.totalmem - os.freemem)/1000000000
        const memoryTotal = os.totalmem()/1000000000
        const specsembed = new EmbedBuilder()
        .setTitle('> System Usage')
        .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
        .setAuthor({ name: `💻 Bot Specs`})
        .setColor("DarkRed")
        .setFooter({ text: `💻 Bot Specs initialized`})
        .addFields({name: `• Memory:`, value: `> ${(memoryUsed/memoryTotal * 100).toFixed(1)}%`})
        .addFields({name: '• OS:', value: `> ${os.type}`})
        .addFields({name: `• OS Version:`, value: `> ${os.release}`})
        .addFields({name: '• CPU: ', value: `> ${usagePercent.toFixed(1)}%`, inline: true})
        .addFields({name: '• CPU Type (Arch): ', value: `> ${os.arch}`, inline: true})
        .setTimestamp()
        await interaction.reply({embeds: [specsembed]})
 
        break;
        case 'ping':
 
        const embedping = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle('Connection between Elementor Bot \nand your client')
        .setDescription( `> Pong: ${Math.round(client.ws.ping)}ms`)
        .setFooter({ text: `🏓 Ping recorded`})
        .setTimestamp()
        .setAuthor({ name: `🏓 Ping Command`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        await interaction.reply({ embeds: [embedping] })
 
        break;
        case 'online':
 
        const embedonline = new EmbedBuilder()
        .setColor("Green")
        .setTitle('The bot is **online!**')
        .setDescription('> Elementor Bot is fuctioning correctly.')
        .setFooter({ text: `🟢 Online command succeeded`})
        .setTimestamp()
        .setAuthor({ name: `🟢 Online Command`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
 
        await interaction.reply({ embeds: [embedonline] })
 
        }
    }
}