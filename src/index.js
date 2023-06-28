const { Client, GatewayIntentBits, ModalBuilder, Partials, ActivityType, AttachmentBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ChannelType, Events, MessageType, UserFlagsBitField, InteractionResponse, ReactionUserManager } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel, Partials.Reaction, Partials.Message] })

client.commands = new Collection();

const capschema = require('./Schemas.js/verify');
const { CaptchaGenerator } = require('captcha-canvas');
const verifyusers = require('./Schemas.js/verifyusers');
const remindSchema = require("./Schemas.js/remindSchema");
const levelSchema = require("./Schemas.js/level")
const starschema = require('./Schemas.js/starboard');
const pollschema = require('./Schemas.js/votes');
const reactschema = require('./Schemas.js/reactionroles');

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

const GiveawaysManager = require("./utils/giveaway");

client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: "#a200ff",
      embedColorEnd: "#550485",
      reaction: "🎉",
    },
});


//reminder

setInterval(async () => {
 
    const reminders = await remindSchema.find();
    if(!reminders) return;
    else {
        reminders.forEach(async reminder => {
 
 
            if (reminder.Time > Date.now()) return;
 
            const user = await client.users.fetch(reminder.User);
 
            user?.send({
                content: `${user}, you asked me to remind you about: \`${reminder.Remind}\``
            }).catch(err => {
                return;
            });
 
            await remindSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        })
    }
}, 1000 * 5);


client.on(Events.MessageCreate, async (message, client) => {
 
    const { guild, author } = message;
 
    if (!guild || author.bot) return;
 
    levelSchema.findOne({ Guild: guild.id, User: author.id }, async (err, data) => {
 
        if (err) throw err;
 
        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0
            })
        }
    })
 
    const channel = message.channel;
 
    const give = 1;
 
    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id}).catch(err => {return;})
    if (!data) return;
 
    const requiredXP = data.Level * data.Level * 20 + 20;
 
    if (data.XP + give >= requiredXP) {
 
        data.XP += give 
        data.Level += 1
        await data.save()
 
        if (!channel) return;
 
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Congrats ${author}, you have reached ${data.Level} level! <a:Giveaways:1052611718519459850>`)
            ]
        })
 
    } else {
        data.XP += give
        data.save()
    }
 
 
})

const Logs = require('discord-logs')
Logs(client, {
    debug: true
})
 
// AFK System Code //

const afkSchema = require('./Schemas.js/afkschema');
const { factorialDependencies, leftShift } = require('mathjs');

client.on(Events.MessageCreate, async (message) => {

    if (message.author.bot) return;

    if (message.guild === null) return;
    const afkcheck = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (afkcheck) {
        const nick = afkcheck.Nickname;

        await afkSchema.deleteMany({
            Guild: message.guild.id,
            User: message.author.id
        })
        
        await message.member.setNickname(`${nick}`).catch(Err => {
            return;
        })

        const m1 = await message.reply({ content: `Hey, you are **back**!`, ephemeral: true})
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {
        
        const members = message.mentions.users.first();
        if (!members) return;
        const afkData = await afkSchema.findOne({ Guild: message.guild.id, User: members.id })

        if (!afkData) return;

        const member = message.guild.members.cache.get(members.id);
        const msg = afkData.Message;

        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} is currently AFK, let's keep it down.. \n> **Reason**: ${msg}`, ephemeral: true});
            setTimeout(() => {
                m.delete();
                message.delete();
            }, 4000)
        }
    }
})


// Ping Bot + Fun //

client.on(Events.MessageCreate, async message => {

    if (message.author.bot) return;

    const inputmessage = message.content.toLowerCase();

    if (message.content == '<@1076798263098880116>' || inputmessage === 'hey Elementor Bot' && message.author.id !== '1076798263098880116') {

        const msg = await message.reply({ content: `Hello there **${message.author}** :) Use </help manual:1081529934884917279> to get a list of my features!`, ephemeral: true});
        setTimeout(() => {
            try {
                msg.delete();
                message.delete();
            } catch (err) {
                return;
            }
        }, 5000)

    }

    if (inputmessage.includes('Elementor Bot sucks') && message.author.id === '642530702155579394' && message.author.id !== '1091118468155314306') {

        const msg = await message.reply({ content: `Bro what the hell, I am literaly your son 😭`});
        setTimeout(() => {
            try {
                msg.delete();
                message.delete();
            } catch (err) {
                return;
            }
        }, 5000)

    } else if (inputmessage.includes('Elementor Bot sucks') && message.author.id !== '642530702155579394') {

        const msg = await message.reply({ content: `:(`})
        setTimeout(() => {
            try {
                msg.delete();
                message.delete();
            } catch (err) {
                return;
            }
        }, 5000)
    }
})




// invite logger

const inviteSchema = require('./Schemas.js/inviteSchema');
 
const invites = new Collection();
const wait = require("timers/promises").setTimeout;
 
client.on('ready', async () => {
 
    await wait(2000);
 
    client.guilds.cache.forEach(async (guild) => {
 
        const clientMember = guild.members.cache.get(client.user.id);
 
        if (!clientMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
 
        const firstInvites = await guild.invites.fetch().catch(err => {console.log(err)});
 
        invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
 
    })
})
 
client.on(Events.GuildMemberAdd, async member => {
 
    const Data = await inviteSchema.findOne({ Guild: member.guild.id});
    if (!Data) return;
 
    const channelID = Data.Channel;
 
    const channel = await member.guild.channels.cache.get(channelID);
 
    const newInvites = await member.guild.invites.fetch();
 
    const oldInvites = invites.get(member.guild.id);
 
    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
 
    if (!invite) return await channel.send(`${member.user.tag} joined the server using an unknown invite.  This could possibly a vanity invite link if your server has one.`)
 
    const inviter = await client.users.fetch(invite.inviter.id);
 
    inviter 
        ? channel.send(`${member.user.tag} joined the server using the invite ${invite.code} from ${inviter.tag}.  The invite was used ${invite.uses} times since its creation`)
        : channel.send(`${member.user.tag} joined the server but I can't find what invite they used to do it`);
})

// AUTO PUBLISHER //
 
client.on(Events.MessageCreate, async message => {
 
    if (message.channel.type !== ChannelType.GuildAnnouncement) return;
    if (message.author.bot) return;
    if (message.content.startsWith('.')) return;
    else {
 
        const data = await publishschema.findOne({ Guild: message.guild.id });
        if (!data) return;
        if (!data.Channel.includes(message.channel.id)) return;
 
        try {
            message.crosspost();
        } catch (err) {
            return;
        }
 
    }
})


//poll//



client.on(Events.InteractionCreate, async i => {
 
    if (!i.guild) return;
    if (!i.message) return;
    if (!i.isButton) return;
 
    const data = await pollschema.findOne({ Guild: i.guild.id, Msg: i.message.id });
    if (!data) return;
    const msg = await i.channel.messages.fetch(data.Msg)
 
        if (i.customId === 'up') {
 
            if (i.user.id === data.Owner) return await i.reply({ content: `❌ You **cannot** upvote your own **poll**!`, ephemeral: true });
            if (data.UpMembers.includes(i.user.id)) return await i.reply({ content: `❌ You have **already** upvoted this **poll**`, ephemeral: true});
 
            let downvotes = data.Downvote;
            if (data.DownMembers.includes(i.user.id)) {
                downvotes = downvotes - 1;
            }
 
            const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `• Upvotes`, value: `> **${data.Upvote + 1}** Votes`, inline: true}, { name: `• Downvotes`, value: `> **${downvotes}** Votes`, inline: true}, { name: `• Author`, value: `> <@${data.Owner}>`});
 
            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('up')
                .setEmoji('<:tick:1102942811101335593>')
                .setLabel(`${data.Upvote + 1}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('down')
                .setEmoji('<:crossmark:1102943024415260673>')
                .setLabel(`${downvotes}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('votes')
                .setLabel('• Votes')
                .setStyle(ButtonStyle.Secondary)
            )
 
            await i.update({ embeds: [newembed], components: [buttons] })
 
            data.Upvote++
 
            if (data.DownMembers.includes(i.user.id)) {
                data.Downvote = data.Downvote - 1;
            }
 
            data.UpMembers.push(i.user.id)
            data.DownMembers.pull(i.user.id)
            data.save();
 
        }
 
        if (i.customId === 'down') {
 
            if (i.user.id === data.Owner) return await i.reply({ content: `❌ You **cannot** downvote your own **poll**!`, ephemeral: true });
            if (data.DownMembers.includes(i.user.id)) return await i.reply({ content: `❌ You have **already** downvoted this **poll**`, ephemeral: true});
 
            let upvotes = data.Upvote;
            if (data.UpMembers.includes(i.user.id)) {
                upvotes = upvotes - 1;
            }
 
            const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `• Upvotes`, value: `> **${upvotes}** Votes`, inline: true}, { name: `• Downvotes`, value: `> **${data.Downvote + 1}** Votes`, inline: true}, { name: `• Author`, value: `> <@${data.Owner}>`});
 
            const buttons = new ActionRowBuilder()
            .addComponents(
 
                new ButtonBuilder()
                .setCustomId('up')
                .setEmoji('<:tick:1102942811101335593>')
                .setLabel(`${upvotes}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('down')
                .setEmoji('<:crossmark:1102943024415260673>')
                .setLabel(`${data.Downvote + 1}`)
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('votes')
                .setLabel('• Votes')
                .setStyle(ButtonStyle.Secondary)
            )
 
            await i.update({ embeds: [newembed], components: [buttons] })
 
            data.Downvote++
 
            if (data.UpMembers.includes(i.user.id)) {
                data.Upvote = data.Upvote - 1;
            }
 
            data.DownMembers.push(i.user.id);
            data.UpMembers.pull(i.user.id);
            data.save();
 
        }
 
        if (i.customId === 'votes') {
 
            let upvoters = [];
            await data.UpMembers.forEach(async member => {
                upvoters.push(`<@${member}>`)
            })
 
            let downvoters = [];
            await data.DownMembers.forEach(async member => {
                downvoters.push(`<@${member}>`)
            })
 
            const embed = new EmbedBuilder()
            .setTitle('> Poll Votes')
            .setColor("#ecb6d3")
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1101856064045072505/largepink.png')
            .setAuthor({ name: `🤚 Poll System`})
            .setFooter({ text: `🤚 Poll Members`})
            .setTimestamp()
            .addFields({ name: `• Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || 'No upvoters'}`, inline: true})
            .addFields({ name: `• Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || 'No downvoters'}`, inline: true})
 
            await i.reply({ embeds: [embed], ephemeral: true })
        }
})


// Counting System //

client.on(Events.MessageCreate, async message => {

    const countschema = require('./Schemas.js/counting');
    if (message.guild === null) return;
    const countdata = await countschema.findOne({ Guild: message.guild.id });
    let reaction = "";

    if (!countdata) return;

    let countchannel = client.channels.cache.get(countdata.Channel);

    if (message.author.bot) return;
    if (message.channel.id !== countchannel.id) return;

    if (countdata.Count > 98) {
        reaction = '✔️'
    } else if (countdata.Count > 48) {
        reaction = '☑️'
    } else {
        reaction = '✅'
    }
    
    if (message.author.id === countdata.LastUser) {

        message.reply({ content: `You **cannot** count alone! You **messed up** the counter at **${countdata.Count}**! Back to **0**.`});
        countdata.Count = 0;
        countdata.LastUser = ' ';

        try {
            message.react('❌')
        } catch (err) {
        
        }

    } else {

        if (message.content - 1 < countdata.Count && countdata.Count === 0 && message.author.id !== countdata.LastUser) {

            message.reply({ content: `The **counter** is at **0** by default!`})
            message.react('⚠')
    
        } else if (message.content - 1 < countdata.Count || message.content === countdata.Count || message.content > countdata.Count + 1 && message.author.id !== countdata.LastUser) {
            message.reply({ content: `You **messed up** the counter at **${countdata.Count}**! Back to **0**.`})
            countdata.Count = 0;

            try {
                message.react('❌')
            } catch (err) {
                
            }
    
        } else if (message.content - 1 === countdata.Count && message.author.id !== countdata.LastUser) {
                
            countdata.Count += 1;

            try {
                message.react(`${reaction}`)
            } catch (err) {
                
            }
    
            countdata.LastUser = message.author.id;
        }

    }
    
    countdata.save();
})

// VERIFICATION CAPTCHA SYSTEM CODE //

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.guild === null) return;

    const verifydata = await capschema.findOne({ Guild: interaction.guild.id });
    const verifyusersdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

    if (interaction.customId === 'verify') {

        if (!verifydata) return await interaction.reply({ content: `The **verification system** has been disabled in this server!`, ephemeral: true});

        if (verifydata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: 'You have **already** been verified!', ephemeral: true})
        else {

            let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
            let result = Math.floor(Math.random() * letter.length);
            let result2 = Math.floor(Math.random() * letter.length);
            let result3 = Math.floor(Math.random() * letter.length);
            let result4 = Math.floor(Math.random() * letter.length);
            let result5 = Math.floor(Math.random() * letter.length);

            const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5];
            console.log(cap)

            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: `${cap}`, size: 60, color: "green"})
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: "green" })

            const buffer = captcha.generateSync();
            
            const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png`});
            
            const verifyembed = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: `✅ Verification Proccess`})
            .setFooter({ text: `✅ Verification Captcha`})
            .setTimestamp()
            .setImage('attachment://captcha.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
            .setTitle('> Verification Step: Captcha')
            .addFields({ name: `• Verify`, value: '> Please use the button bellow to \n> submit your captcha!'})

            const verifybutton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('✅ Enter Captcha')
                .setStyle(ButtonStyle.Success)
                .setCustomId('captchaenter')
            )

            const vermodal = new ModalBuilder()
            .setTitle('Verification')
            .setCustomId('vermodal')

            const answer = new TextInputBuilder()
            .setCustomId('answer')
            .setRequired(true)
            .setLabel('• Please sumbit your Captcha code')
            .setPlaceholder('Your captcha code')
            .setStyle(TextInputStyle.Short)

            const vermodalrow = new ActionRowBuilder().addComponents(answer);
            vermodal.addComponents(vermodalrow);

            try {
                const vermsg = await interaction.reply({ embeds: [verifyembed], components: [verifybutton], ephemeral: true, files: [verifyattachment] });

                const vercollector = vermsg.createMessageComponentCollector();

                vercollector.on('collect', async i => {

                    if (i.customId === 'captchaenter') {
                        i.showModal(vermodal);
                    }

                })

            } catch (err) {
                return;
            }

            if (verifyusersdata) {

                await verifyusers.deleteMany({
                    Guild: interaction.guild.id,
                    User: interaction.user.id
                })

                await verifyusers.create ({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Key: cap
                })

            } else {

                await verifyusers.create ({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Key: cap
                })

            }
        } 
    }
})

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'vermodal') {

        const userverdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
        const verificationdata = await capschema.findOne({ Guild: interaction.guild.id });

        if (verificationdata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: `You are **already** verified within this server!`, ephemeral: true});
        
        const modalanswer = interaction.fields.getTextInputValue('answer');
        if (modalanswer === userverdata.Key) {

            const verrole = await interaction.guild.roles.cache.get(verificationdata.Role);

            try {
                await interaction.member.roles.add(verrole);
            } catch (err) {
                return await interaction.reply({ content: `There was an **issue** giving you the **<@&${verificationdata.Role}>** role, try again later!`, ephemeral: true})
            }


            await capschema.updateOne({ Guild: interaction.guild.id }, { $push: { Verified: interaction.user.id }});

            try {
                await interaction.reply({ content: 'You have been **verified!**', ephemeral: true});
            } catch (err) {
                return;
            }

        } else {
            await interaction.reply({ content: `**Oops!** It looks like you **didn't** enter the valid **captcha code**!`, ephemeral: true})
        }
    }
})

client.on(Events.GuildMemberRemove, async member => {
    try {
        await capschema.updateOne({ Guild: member.guild.id }, { $pull: { Verified: member.id }});
    } catch (err) {
        console.log(`Couldn't delete verify data`)
    }
})


// Starboard System //

client.on(Events.MessageReactionAdd, async (reaction, err) => {

    if (reaction.emoji.name === '⭐') {

        try {
            await reaction.fetch();
        } catch (error) {
            return;
        }

        const stardata = await starschema.findOne({ Guild: reaction.message.guild.id });
        const reactions = reaction.message.reactions.cache.get('⭐').count;

        const messagedata = await starmessageschema.findOne({ Message: reaction.message.id })
        if (messagedata) {

            const reactmessage = await client.channels.cache.get(messagedata.Channel).messages.fetch(messagedata.Reaction);
            const newreactions = reactions;
            const receivedEmbed = await reactmessage.embeds[0];

            try {
                const newembed = EmbedBuilder.from(receivedEmbed).setFields({ name: `• Stars`, value: `> ${newreactions} ⭐`});
                reactmessage.edit({ embeds: [newembed]}).catch(err);
            } catch (err) {
                return;
            }
        }

        const id = reaction.message.id;

        if (!stardata) return;

        if (reactions > stardata.Count) {

            if (reaction.message.channel.id === stardata.Channel) return;
            if (stardata.SentMessages.includes(id)) return;
            if (stardata.BanUser.includes(reaction.message.author.id)) return;

            const starembed = new EmbedBuilder()
            .setColor('Yellow')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1084019710892449792/largeyellow.png')
            .setAuthor({ name: `⭐ Starboard System`})
            .setTimestamp()
            .setFooter({ text: `⭐ Starred Message`})
            .setTitle(`• Message by: ${reaction.message.author.tag}`)
            .setDescription(`${reaction.message.content || 'No message given.'}`)
            .addFields({ name: `• Stars`, value: `> ${reactions} ⭐`})

            if (reaction.message.attachments.size > 0) {

                try {
                    starembed.setImage(`${reaction.message.attachments.first()?.url}`);
                } catch (err) {
                    console.log(`Couldn't set image for starboard.`);
                }

            }
           
            const starchannel = await reaction.message.guild.channels.cache.get(stardata.Channel);

            const starmsg = await starchannel.send({ embeds: [starembed] }).catch(err);

            await starmessageschema.create({
                Reaction: starmsg.id,
                Message: reaction.message.id,
                Channel: stardata.Channel
            })
            
            try {
                starmsg.react('⭐');
            } catch (err) {
                console.log('Error occured when reacting to a star message!')
            }

            await starschema.updateOne({ Guild: reaction.message.guild.id }, { $push: { SentMessages: id }});

        }
    }  
})

client.on(Events.MessageReactionRemove, async (reaction, err) => {

    if (reaction.guild === 'null') return;

    if (reaction.emoji.name === '⭐') {

        try {
            await reaction.fetch();
        } catch (error) {
            return;
        }

        const stardata = await starschema.findOne({ Guild: reaction.message.guild.id });
        
        const reactions = reaction.message.reactions.cache.get('⭐').count;

        const messagedata = await starmessageschema.findOne({ Message: reaction.message.id })
        if (messagedata) {

            const reactmessage = await client.channels.cache.get(messagedata.Channel).messages.fetch(messagedata.Reaction);
            const newreactions = reactions;
            const receivedEmbed = await reactmessage.embeds[0];

            if (reactions < stardata.Count) {

                try {
                    const newembed1 = EmbedBuilder.from(receivedEmbed).setFields({ name: `• Stars`, value: `> Not enough ⭐`});
                    reactmessage.edit({ embeds: [newembed1]}).catch(err);
                } catch (err) {
                    return;
                }

            } else {
                try {
                    const newembed2 = EmbedBuilder.from(receivedEmbed).setFields({ name: `• Stars`, value: `> ${newreactions} ⭐`});
                    reactmessage.edit({ embeds: [newembed2]}).catch(err);
                } catch (err) {
                    return;
                }
            }
        }  
    }
})


// REACTION ROLE CODE //

client.on(Events.MessageReactionAdd, async (reaction, member) => {

    try {
        await reaction.fetch();
    } catch (error) {
        return;
    }

    if (!reaction.message.guild) return;
    else {

        const reactionroledata = await reactschema.find({ MessageID: reaction.message.id });

        await Promise.all(reactionroledata.map(async data => {
            if (reaction.emoji.id !== data.Emoji) return;
            else {

                const role = await reaction.message.guild.roles.cache.get(data.Roles);
                const addmember = await reaction.message.guild.members.fetch(member.id);

                if (!role) return;
                else {

                    try {
                        await addmember.roles.add(role)
                    } catch (err) {
                        return console.log(err);
                    }

                    try {

                        const addembed = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setAuthor({ name: `💳 Reaction Role Tool`})
                        .setFooter({ text: `💳 Role Added`})
                        .setTitle('> You have been given a role!')
                        .setTimestamp()
                        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                        .addFields({ name: `• Role`, value: `> ${role.name}`, inline: true}, { name: `• Emoji`, value: `> ${reaction.emoji}`, inline: true}, { name: `• Server`, value: `> ${reaction.message.guild.name}`, inline: false})
                        addmember.send({ embeds: [addembed] })
    
                    } catch (err) {
                        return;
                    }
                }
            }
        }))
    }
})

client.on(Events.MessageReactionRemove, async (reaction, member) => {

    try {
        await reaction.fetch();
    } catch (error) {
        return;
    }

    if (!reaction.message.guild) return;
    else {

        const reactionroledata = await reactschema.find({ MessageID: reaction.message.id });

        await Promise.all(reactionroledata.map(async data => {
            if (reaction.emoji.id !== data.Emoji) return;
            else {

                const role = await reaction.message.guild.roles.cache.get(data.Roles);
                const addmember = await reaction.message.guild.members.fetch(member.id);

                if (!role) return;
                else {

                    try {
                        await addmember.roles.remove(role)
                    } catch (err) {
                        return console.log(err);
                    }

                    try {

                        const removeembed = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setAuthor({ name: `💳 Reaction Role Tool`})
                        .setFooter({ text: `💳 Role Removed`})
                        .setTitle('> You have removed from a role!')
                        .setTimestamp()
                        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                        .addFields({ name: `• Role`, value: `> ${role.name}`, inline: true}, { name: `• Emoji`, value: `> ${reaction.emoji}`, inline: true}, { name: `• Server`, value: `> ${reaction.message.guild.name}`, inline: false})
                        addmember.send({ embeds: [removeembed] })
    
                    } catch (err) {
                        return;
                    }
                }
            }
        }))
    }
})




///error///

client.on('error', error => {
    console.error('The WebSocket encountered an error:', error);
  });
  
  process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
  });