// Role All Command by Antinity#0001.
// Thanks for requesting this code, I had a lot of fun creating this command.

const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("role")
      .setDescription("Manage roles for a member.")
      .addSubcommand((subcommand) =>
            subcommand
          .setName("all")
          .setDescription("Add a role to all member in the server.")
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("Select the role to assign to the member.")
              .setRequired(true)
          )
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
    
      const subcommand = interaction.options.getSubcommand();
      let role = interaction.options.getRole("role");
  
      if (subcommand === "all") {
      
        const done = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `:white_check_mark: ${role} role has been assigned to all members.\nPlease note that it might take a while for the roles to be assigned.`
          );
          
         const fail = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`<:cross:1082334173915775046> Unable to assign ${role} role to all members.`);
  
        try {
          await interaction.guild.members.cache.forEach((member) =>
            member.roles.add(role)
          );
  
          await interaction.reply({ embeds: [done] });
        } catch (error) {
          interaction.reply({ embeds: [fail], ephemeral: true });
        }
      }
    },
  };