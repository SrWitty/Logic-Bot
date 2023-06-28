const { EmbedBuilder, Events } = require("discord.js");
 
function handleLogs(client) {
 
    const logSchema = require("../Schemas.js/logschema");
 
    function send_log(guildId, embed) {
        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data || !data.Channel) return;
            const LogChannel = client.channels.cache.get(data.Channel);
 
            if (!LogChannel) return;
            embed.setTimestamp();
 
            try {
                LogChannel.send({ embeds: [embed] });
            } catch(err) {
                console.log('Error sending log!');
            }
        });
    }
 
    client.on("messageDelete", function (message) {
 
        try {
            if (message.guild === null) return;
            if (message.author.bot) return;
 
            const embed = new EmbedBuilder()
            .setTitle('> Message Deleted')
            .setColor('DarkRed')
            .setTimestamp()
            .addFields({ name: `• Author`, value: `> <@${message.author.id}> - *${message.author.tag}*`})
            .addFields({ name: `• Channel`, value: `> ${message.channel}`})
            .addFields({ name: `• Deleted Message`, value: `> ${message.content}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Message Deleted`})
 
            return send_log(message.guild.id, embed);
        } catch (err) {
            console.log(`Couldn't log deleted msg`)
        }
 
    });
 
    // Channel Topic Updating 
    client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
 
        try {
            if (channel.guild === null) return;
 
            const embed = new EmbedBuilder()
            .setTitle('> Topic Changed')
            .setColor('DarkRed')
            .setTimestamp()
            .addFields({ name: `• Channel`, value: `> ${channel}`})
            .addFields({ name: `• Old Topic`, value: `> ${oldTopic}`})
            .addFields({ name: `• New Topic`, value: `> ${newTopic}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Topic Update`})
 
            return send_log(channel.guild.id, embed);
 
        } catch (err) {
            console.log('Err logging topic update')
        }
    });
 
    // Channel Permission Updating
    client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {
 
        try {
            if (channel.guild === null) return;
 
            const embed = new EmbedBuilder()
            .setTitle('> Channel Updated')
            .setColor('DarkRed')
            .setTimestamp()
            .addFields({ name: `• Channel`, value: `> ${channel}`})
            .addFields({ name: `• Changes`, value: `> Channel's permissions/name were updated`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Permissions Update`})
 
            return send_log(channel.guild.id, embed);
        } catch (err) {
            console.log('Err logging channel update')
        }
    })
 
    // unhandled Guild Channel Update
    client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
 
        try {
 
        if (oldChannel.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> Channel Updated')
            .setColor('DarkRed')
            .setTimestamp()
            .addFields({ name: `• Channel`, value: `> ${oldChannel}`})
            .addFields({ name: `• Changes`, value: `> **PixelVal** couldn't find any changes!`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Channel Update`})
 
        return send_log(oldChannel.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging unhandled channel update')
    }
 
    });
 
    // Member Started Boosting
    client.on("guildMemberBoost", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`> ${member.user.username} started Boosting`)
            .setColor('Purple')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Server`, value: `> ${member.guild.name}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Boosting Started`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging member boost start')
    }
 
    })
 
    // Member Unboosted
    client.on("guildMemberUnboost", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`> ${member.user.username} stopped Boosting`)
            .setColor('Purple')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Server`, value: `> ${member.guild.name}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Boosting Stopped`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging member boost stop')
    }
 
    })
 
    // Member Got Role
    client.on("guildMemberRoleAdd", (member, role) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`> ${member.user.username} was given a Role`)
            .setColor('Purple')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Role`, value: `> ${role}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Role Given`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging role give')
    }
 
    })
 
    // Member Lost Role
    client.on("guildMemberRoleRemove", (member, role) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`> ${member.user.username} lost a Role`)
            .setColor('Purple')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Role`, value: `> ${role}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Role Removed`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging role remove')
    }
 
    })
 
    // Nickname Changed
    client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
 
        try {
 
        const embed = new EmbedBuilder()
            .setTitle('> Nickname Updated')
            .setColor('DarkBlue')
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Nickname Changed`})
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Old Nickname`, value: `> ${oldNickname || '**None**'}`})
            .addFields({ name: `• New Nickname`, value: `> ${newNickname || '**None**'}`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging nick update')
    }
 
    })
 
    // Member Joined
    client.on("guildMemberAdd", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> User Joined')
            .setColor('Green')
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Member ID`, value: `> ${member.user.id}`})
            .addFields({ name: `• Member Tag`, value: `> ${member.user.tag}`})
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 User Joined`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging member add')
    }
 
    });
 
    // Member Left
    client.on("guildMemberRemove", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> User Left')
            .setColor('DarkRed')
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• Member ID`, value: `> ${member.user.id}`})
            .addFields({ name: `• Member Tag`, value: `> ${member.user.tag}`})
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 User Left`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging member leave')
    }
 
    });
 
    // Server Boost Level Up
    client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle(`> ${guild.name} advanced a Boosting Level`)
        .setColor('Purple')
        .setTimestamp()
        .addFields({ name: `• Info`, value: `> **${guild.name}** advanced from level **${oldLevel}** to **${newLevel}**!`})
        .addFields({ name: `• Server`, value: `> ${member.guild.name}`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Boosting Level Up`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging boost level up')
    }
 
    })
 
    // Server Boost Level Down
    client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle(`> ${guild.name} lost a Boosting Level`)
        .setColor('Purple')
        .setTimestamp()
        .addFields({ name: `• Info`, value: `> **${guild.name}** lost a level, from **${oldLevel}** to **${newLevel}**!`})
        .addFields({ name: `• Server`, value: `> ${member.guild.name}`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Boosting Level Down`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging level down')
    }
 
    })
 
    // Banner Added
    client.on("guildBannerAdd", (guild, bannerURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name}'s Banner was Updated`)
            .setColor('Purple')
            .addFields({ name: `• Banner URL`, value: `> ${bannerURL}`})
            .setImage(bannerURL)
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Banner Updated`})
            .setTimestamp()
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging banner change')
    }
 
    })
 
    // AFK Channel Added
    client.on("guildAfkChannelAdd", (guild, afkChannel) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> AFK channel Added')
        .setColor('DarkRed')
        .addFields({ name: `• AFK Channel`, value: `> ${afkChannel}`})
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 AFK Channel Added`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging afk channel add')
    }
 
    })
 
    // Guild Vanity Add
    client.on("guildVanityURLAdd", (guild, vanityURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Vanity URL Added')
        .setColor('Green')
        .setTimestamp()
        .addFields({ name: `• Vanity URL`, value: `> ${vanityURL}`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Vanity Created`})
 
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging vanity add')
    }
 
    })
 
    // Guild Vanity Remove
    client.on("guildVanityURLRemove", (guild, vanityURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Vanity URL Removed')
        .setColor('DarkRed')
        .addFields({ name: `• Old Vanity`, value: `> ${vanityURL}`})
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Vanity Removed`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging vanity remove')
    }
 
    })
 
    // Guild Vanity Link Updated
    client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Vanity URL Updated')
        .setColor('DarkRed')
        .addFields({ name: `• Old Vanity`, value: `> ${oldVanityURL}`})
        .addFields({ name: `• New Vanity`, value: `> ${newVanityURL}`})
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Vanity Updated`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging vanity update')
    }
 
    })
 
    // Message Pinned
    client.on("messagePinned", (message) => {
 
        try {
 
        if (message.guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Message Pinned')
        .setColor('Purple')
        .setTimestamp()
        .addFields({ name: `• Pinner`, value: `> ${message.author}`})
        .addFields({ name: `• Message`, value: `> ${message.content}`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Message Pinned`})
 
        return send_log(message.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging pin add')
    }
 
    })
 
    // Message Edited
    client.on("messageContentEdited", (message, oldContent, newContent) => {
 
        try {
 
        if (message.guild === null) return;
        if (message.author.bot) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Message Edited')
        .setColor('Purple')
        .setTimestamp()
        .addFields({ name: `• Member`, value: `> ${message.author}`})
        .addFields({ name: `• Old Message`, value: `> ${oldContent}`})
        .addFields({ name: `• New Message`, value: `> ${newContent}`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Message Edited`})
 
 
 
        return send_log(message.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging message edit')
    }
 
    })
 
    // Role Position Updated
    client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
 
        try {
 
        if (role.guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Role position Updated')
        .setColor('DarkRed')
        .addFields({ name: `• Role`, value: `> ${role}`})
        .addFields({ name: `• Old Position`, value: `> ${oldPosition}`})
        .addFields({ name: `• New Position`, value: `> ${newPosition}`})
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Role Position Updated`})
 
    return send_log(role.guild.id, embed);
 
} catch (err) {
    console.log('Err logging role pos update')
}
 
    })
 
    // Role Permission Updated
    client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
 
        try {
 
        if (role.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> Role permissions Updated')
            .setColor('DarkRed')
            .addFields({ name: `• Role`, value: `> ${role}`})
            .addFields({ name: `• Old Permissions`, value: `> ${oldPermissions}`})
            .addFields({ name: `• New Permissions`, value: `> ${newPermissions}`})
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Role Permissions Updated`})
 
        return send_log(role.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging role perms update')
    }
 
    })
 
    // VC Switch
    client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> Voice channel Switched')
            .setColor('Purple')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${member.user}`})
            .addFields({ name: `• From`, value: `> ${oldChannel}`})
            .addFields({ name: `• To`, value: `> ${newChannel}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Voice Swtich`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging vc switch')
    }
 
    })
 
    // Role Created
    client.on("roleCreate", (role) => {
 
        try {
 
        if (role.guild === null) return;
 
            const embed = new EmbedBuilder()
            .setTitle('> Role Created')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `• Role Name`, value: `> ${role.name}`})
            .addFields({ name: `• Role ID`, value: `> ${role.id}`})
            .addFields({ name: `• Role HEX`, value: `> ${role.hexColor}`})
            .addFields({ name: `• Role Pos`, value: `> ${role.position}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Role Created`})
 
        return send_log(role.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging role create')
    }
 
    });
 
    // Role Deleted
    client.on("roleDelete", (role) => {
 
        try {
 
        if (role.guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('> Role Deleted')
        .setColor('DarkRed')
        .setTimestamp()
        .addFields({ name: `• Role Name`, value: `> ${role.name}`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setAuthor({ name: `🚧 Logging System`})
        .setFooter({ text: `🚧 Role Deleted`})
 
    return send_log(role.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging role delete')
    }
 
 
    });
 
    // User Banned
    client.on("guildBanAdd", ({guild, user}) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> User Banned')
            .setColor('DarkRed')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${user}`})
            .addFields({ name: `• Member ID`, value: `> ${user.id}`})
            .addFields({ name: `• Member Tag`, value: `> ${user.tag}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 User Banned`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging ban add')
    }
 
    });
 
    // User Unbanned
    client.on("guildBanRemove", ({guild, user}) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> User Unbanned')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `• Member`, value: `> ${user}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 User Unbanned`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging ban remove')
    }
 
    });
 
    // Channel Created
    client.on("channelCreate", (channel) => {
 
        try {
 
        if (channel.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> Channel Created')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `• Channel`, value: `> ${channel}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Channel Created`})
 
        return send_log(channel.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging channel create')
    }
 
    });
 
    // Channel Deleted
    client.on("channelDelete", (channel) => {
 
        try {
 
        if (channel.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('> Channel Deleted')
            .setColor('DarkRed')
            .setTimestamp()
            .addFields({ name: `• Channel`, value: `> ${channel}`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setAuthor({ name: `🚧 Logging System`})
            .setFooter({ text: `🚧 Channel Deleted`})
 
        return send_log(channel.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging channel delete')
    }
 
    });
}
 
module.exports = { handleLogs };