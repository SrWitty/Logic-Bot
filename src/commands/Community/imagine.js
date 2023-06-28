const { SlashCommandBuilder, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const replicate = require("node-replicate");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("Generate an image based on your prompt")
        .addStringOption(option =>
            option.setName("prompt")
                .setDescription("Your prompt to generate the art")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const prompt = interaction.options.getString("prompt");

        const model = await replicate.model(
            "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb"
        );

        const prediction = await model.predict({
            prompt: prompt
        });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Download")
                    .setStyle("LINK")
                    .setURL(prediction.output[0])
                    .setEmoji("📥"),
                new MessageButton()
                    .setLabel("Support")
                    .setStyle("LINK")
                    .setURL("https://discord.gg/tWaxz5Bj3V")
                    .setEmoji("🛠️")
            );

        const embed = new MessageEmbed()
            .setTitle("Your Prompt:")
            .setDescription(`**${prompt}**`)
            .setImage(prediction.output[0])
            .setColor("#2f3136")
            .setFooter(`Requested by: ${interaction.user.username} | ©️ Space Ai`, interaction.user.displayAvatarURL({ dynamic: true }));

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};
