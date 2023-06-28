const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'),
  weather = require('weather-js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Gets the weather of a given area.')
    .addStringOption((option) =>
      option
        .setName('location')
        .setDescription('The location to check the weather of')
        .setRequired(true)
        .setMaxLength(100)
    )
    .addStringOption((option) =>
      option
        .setName('scale')
        .setDescription('Select your preferable temperature scale')
        .addChoices(
          {
            name: 'Fahrenheit',
            value: 'F'
          },
          {
            name: 'Celsius',
            value: 'C'
          }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const location = interaction.options.getString('location'),
      scale = interaction.options.getString('scale');

    try {
      await weather.find(
        { search: location, deegreeType: scale },
        async function (err, result) {
          if (err) {
            console.log('err');
            await interaction.editReply({
              content: 'Could not get the **weather data**, something went wrong..'
            });
          } else if (result.length == 0) {
            await interaction.editReply({
              content: `I **could not** find the weather data of "**${location}**"..`
            });
          } else {
            const temp = result[0].current.temperature,
              type = result[0].current.skytext,
              name = result[0].location.name,
              feel = result[0].current.feelslike,
              icon = result[0].current.imageUrl,
              wind = result[0].current.winddisplay,
              day = result[0].current.day,
              alert = result[0].location.alert || 'None';

            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor('Yellow')
                  .setTitle(`> Current weather of \n> "${name}"`)
                  .setAuthor({ name: `☀ Weather Tool`})
                  .setFooter({ text: `☀ Weather Forecasted`})
                  .setTimestamp()
                  .setThumbnail(icon)
                  .addFields(
                    { name: '• Temperature', value: `> ${temp}`, inline: true },
                    { name: '• Feels Like', value: `> ${feel}`, inline: true },
                    { name: '• Weather', value: `> ${type}`, inline: true },
                    { name: '• Current Allert', value: `> ${alert}`, inline: true },
                    { name: '• Week Day', value: `> ${day}`, inline: true },
                    { name: '• Wind Speed & Direction', value: `> ${wind}`, inline: true }
                  )
              ]
            });
          }
        }
      );
    } catch (err) {
      await interaction.editReply({
        content: `I **could not** find the weather data of "**${location}**"..`
      });
    }
  }
};
