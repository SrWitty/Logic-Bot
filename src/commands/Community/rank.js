const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const levelSchema = require("../../Schemas.js/level");
const Canvacord = require(`canvacord`)
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Gets a members level/rank')
    .addUserOption(option => option.setName('user').setDescription(`The member you want to check the rank of`).setRequired(false)),
    async execute(interaction, client) {
 
        const { options, user, guild } = interaction;
 
        const Member = options.getMember('user') || user;
 
        const member = guild.members.cache.get(Member.id);
 
        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id});
 
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`<:redcheck:1015276845077364848>  ${member} has not gained any XP yet`)
        if (!Data) return await interaction.reply({ embeds: [embed] })
 
        await interaction.deferReply();
 
        const Required = Data.Level * Data.Level * 20 + 20;
 
        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forceStatic: true }))
            .setBackground("IMAGE", "https://media.discordapp.net/attachments/978035586168418334/1055177852577910855/Sunset.jpg?width=645&height=484")
            .setCurrentXP(Data.XP)
            .setRequiredXP(Required)
            .setRank(1, "Rank", false)
            .setLevel(Data.Level, "Level")
            .setProgressBar("BLUE", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
 
        const Card = await rank.build();
 
        const attachment = new AttachmentBuilder(Card, { name: "rank.png"})
 
        const embed2 = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${member.user.username}'s Rank Card`)
        .setImage("attachment://rank.png")
 
        await interaction.editReply({ embeds: [embed2], files: [attachment] })
 
 
 
 
    }
}