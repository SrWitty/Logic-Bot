const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const profileschema = require('../../Schemas.js/interactions');
const interact = require('../../interaction.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('interact')
    .setDMPermission(false)
    .setDescription('Interact with a buddy of yours!')
    .addSubcommand(command => command.setName('hug').setDescription('Hug specified user.').addUserOption(option => option.setName('user').setDescription('Specified user will be hugged.').setRequired(true)))
    .addSubcommand(command => command.setName('slap').setDescription('Slap specified user.').addUserOption(option => option.setName('user').setDescription('Specified user will be slapped.').setRequired(true)))
    .addSubcommand(command => command.setName('kill').setDescription('Kill specified user.').addUserOption(option => option.setName('user').setDescription('Specified user will be killed.').setRequired(true)))
    .addSubcommand(command => command.setName('kiss').setDescription('Kiss specified user.').addUserOption(option => option.setName('user').setDescription('Specified user will be kissed.').setRequired(true)))
    .addSubcommand(command => command.setName('yell').setDescription('Yells at user.').addUserOption(option => option.setName('user').setDescription('Specified user will be yelled at.').setRequired(true)))
    .addSubcommand(command => command.setName('profile').setDescription(`Lists specified user's profile.`).addUserOption(option => option.setName('user').setDescription('Specified user will have their profile listed.').setRequired(false))),
    async execute(interaction) {

        const user = await interaction.options.getMember('user') || interaction.member;
        const displayuser = await interaction.options.getUser('user') || interaction.user;

        if (!user) return await interaction.reply({ content: `The user ${displayuser} **does not** exist within your server :(`, ephemeral: true});

        const sub = interaction.options.getSubcommand();
        let data = await profileschema.findOne({ User: interaction.user.id });
        let interactdata = await profileschema.findOne({ User: displayuser.id });

        switch (sub) {
            case 'hug':

            if (interaction.user.id === displayuser.id) {

                await interaction.reply({ content: `You tried **giving yourself** a **hug**, it **didn't** work 💔`, ephemeral: true});
                await interaction.channel.send({ content: `${interaction.user} tried **giving themselves** a **hug**, but they were **too** fat to do so 💔`});
                
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 1,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0,
                        Yell: 0,
                        YellGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                }
                
            } else {

                const randomizer = Math.floor(Math.random() * interact.hug.length);

                const hugembed = new EmbedBuilder()
                .setColor('Purple')
                .setTimestamp()
                .setTitle('> Gave a Hug!')
                .setFooter({ text: `❤️ Hug Given!`})
                .setAuthor({ name: `❤️ Interaction System`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
                .setImage(interact.hug[randomizer])
                .addFields({ name: `• Hug Given`, value: `> ${interaction.user} has given \n> ${displayuser} a hug! ❤️`})

                await interaction.reply({ embeds: [hugembed], content: `${displayuser}` });

                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 0,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0,
                        Yell: 0,
                        YellGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { HugGive: data.HugGive + 1 }});
                }
    
                if (!interactdata) {
                    interactdata = await profileschema.create({
                        User: displayuser.id,
                        HugGive: 0,
                        Hug: 1,
                        Fail: 0,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0,
                        Yell: 0,
                        YellGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: displayuser.id }, { $set: { Hug: interactdata.Hug + 1}});
                }
                
            }

            break;
            case 'profile':

            if (!interactdata) return await interaction.reply({ content: `That user **has not** been given any **statistics** yet!`, ephemeral: true});
            else {

                const statembed = new EmbedBuilder()
                .setColor('Purple')
                .setTimestamp()
                .setAuthor({ name: `❤️ Interaction System`})
                .setFooter({ text: `❤️ Profile Displayed`})
                .setTitle(`> ${displayuser.username}'s Profile`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
                .addFields(
                    { name: `• Statistics Received`, value: `> • **Hugs**: ${interactdata.Hug} \n> • **Slaps**: ${interactdata.Slap} \n> • **Kills**: ${interactdata.Kill} \n> • **Kisses**: ${interactdata.Kiss} \n> • **Yells**: ${interactdata.Yell}`, inline: true},
                    { name: `• Statistics Given`, value: `> • **Hugs**: ${interactdata.HugGive} \n> • **Slaps**: ${interactdata.SlapGive} \n> • **Kills**: ${interactdata.KillGive} \n> • **Kisses**: ${interactdata.KissGive} \n> • **Yells**: ${interactdata.YellGive}`, inline: true},
                    { name: `• Failures`, value: `> • **Fails**: ${interactdata.Fail} \n> • **Real Errors**: ${interactdata.Err}`, inline: false}
                )

                await interaction.reply({ embeds: [statembed] });
            }

            break;
            case 'slap':

            if (interaction.user.id === displayuser.id) {

                await interaction.reply({ content: `You tried **slapping yourself**, you are weird.. 👋`, ephemeral: true});
                await interaction.channel.send({ content: `${interaction.user} tried **slapping themselves**, for some reason.. 👋`});
                
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 1,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0,
                        Yell: 0,
                        YellGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                }
                
            } else {

                const results = [
                    { name: `${interaction.user} **slapped** ${displayuser}!`, result: `s`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> but ${displayuser} responded with an \n> **explosive** punch!`, result: `f`},
                    { name: `${interaction.user} triggered raging mode, \n> ${displayuser}'s **attempts** to avoid \n> the **slap** went unoticed.`, result: `s`},
                    { name: `${interaction.user} tried to **slap** ${displayuser} but \n> ${displayuser} dodged the **attack**, \n> what a fail! (oh yeah, ${displayuser} slapped \n> you back)`, result: `f`},
                    { name: `${interaction.user} **couldn't** slap ${displayuser} at \n> first, but **JASO0ON** helped \n> them out! **What a save :o**`, result: `s`},
                    { name: `${interaction.user} tried to **slap** ${displayuser}, \n> but **JASO0ON** felt mercy and \n> **slapped** ${interaction.user} instead :(`, result: `f`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> they will **remember** that..`, result: `s`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> how rudeful!`, result: `s`},
                    { name: `Looks like an **error** occured, hm.. \n> perhaps the **GIF** generator is in \n> another **castle**!`, result: `e`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> lol.. **W** play 😎`, result: `s`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> will they take their **revenge**?`, result: `s`}
                ]

                const randomizer = Math.floor(Math.random() * interact.slap.length);
                const failchance = Math.floor(Math.random() * results.length);

                const slapembed = new EmbedBuilder()
                .setColor('Purple')
                .setTimestamp()
                .setTitle('> Ooo, a SLAP!')
                .setFooter({ text: `👋 Slap Given!`})
                .setAuthor({ name: `👋 Interaction System`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png')
                .setImage(interact.slap[randomizer])

                if (results[failchance].result === 'f') {
                    slapembed.addFields({ name: `• Slap Given`, value: `> ${results[failchance].name}`})
                }

                if (results[failchance].result === 's') {
                    slapembed.addFields({ name: `• Slap Given`, value: `> ${results[failchance].name}`})
                }

                if (results[failchance].result === 'e') {
                    slapembed.addFields({ name: `• Slap Error?`, value: `> ${results[failchance].name}`})
                    slapembed.setImage('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')

                    if (!data) {

                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 1,
                            Kiss: 0,
                            KissGive: 0,
                            Yell: 0,
                            YellGive: 0
                        })
                        
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { Err: data.Err + 1 }});
                    }
                }

                await interaction.reply({ embeds: [slapembed], content: `${displayuser}` });


                if (results[failchance].result === 'e') return;
                else {

                    if (results[failchance].result === 's') {

                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 1,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { SlapGive: data.SlapGive + 1 }});
                        }
            
                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 1,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { Slap: interactdata.Slap + 1}});
                        }

                    } else if (results[failchance].result === 'f') {

                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 1,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Slap: data.Slap + 1 }});
                        }

                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 1,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { SlapGive: interactdata.SlapGive + 1}});
                        }
                    }
                }
            }

            break;
            case 'kill':

            if (interaction.user.id === displayuser.id) {

                await interaction.reply({ content: `You tried **killing yourself**, emotional damage? 🔪`, ephemeral: true});
                await interaction.channel.send({ content: `${interaction.user} tried **killing themselves**, give them some support.. 🔪`});
                
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 1,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0,
                        Yell: 0,
                        YellGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                }
                
            } else {

                const results = [
                    { name: `${interaction.user} **killed** ${displayuser}!`, result: `s`},
                    { name: `${interaction.user} **tried to kill** ${displayuser}, \n> but ${displayuser} responded with an \n> **explosive** punch!`, result: `f`},
                    { name: `${interaction.user} triggered raging mode, \n> ${displayuser}'s **attempts** to avoid \n> the **knife** went unoticed.`, result: `s`},
                    { name: `${interaction.user} tried to **kill** ${displayuser} but \n> ${displayuser} dodged the **attack**, \n> what a fail! (oh yeah, ${displayuser} killed \n> you)`, result: `f`},
                    { name: `${interaction.user} **couldn't** kill ${displayuser} at \n> first, but **JASO0ON** helped \n> them out! **Group murder babbyyy!**`, result: `s`},
                    { name: `${interaction.user} tried to **kill** ${displayuser}, \n> but **JASO0ON** felt mercy and \n> **killed** ${interaction.user} instead :(`, result: `f`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> they will **remember** that..`, result: `s`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> how evil!`, result: `s`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> lol.. **skill issue** 😎`, result: `s`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> will they take their **revenge** (they won't, \n> they are dead)`, result: `s`}
                ]

                const randomizer = Math.floor(Math.random() * interact.kill.length);
                const failchance = Math.floor(Math.random() * results.length);

                const killembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTimestamp()
                .setTitle('> A murder!')
                .setFooter({ text: `🔪 Killed a Guy`})
                .setAuthor({ name: `🔪 Interaction System`})
                .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
                .setImage(interact.kill[randomizer])

                if (results[failchance].result === 'f') {
                    killembed.addFields({ name: `• Murder Failed`, value: `> ${results[failchance].name}`})
                }

                if (results[failchance].result === 's') {
                    killembed.addFields({ name: `• Kill Confirmed`, value: `> ${results[failchance].name}`})
                }

                await interaction.reply({ embeds: [killembed], content: `${displayuser}` });

                if (results[failchance].result === 's') {

                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 1,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { KillGive: data.KillGive + 1 }});
                        }
            
                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 1,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { Kill: interactdata.Kill + 1}});
                        }

                    } else if (results[failchance].result === 'f') {

                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 1,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Slap: data.Kill + 1 }});
                        }

                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 1,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0,
                                Yell: 0,
                                YellGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { KillGive: interactdata.KillGive + 1}});
                    }
                } 
            }

            break;
            case 'kiss':

            if (interaction.user.id === displayuser.id) {
                await interaction.reply({ content: `You tried **kissing yourself**, down bad? 💋`, ephemeral: true});
                return await interaction.channel.send({ content: `${interaction.user} tried **kissing themselves**, bro is single fr.. 💋`});
            }

            const results = [
                { name: `${interaction.user} **kissed** ${displayuser}!`, result: `s`},
                { name: `${interaction.user} **tried to kiss** ${displayuser}, \n> but ${displayuser} responded with an \n> **explosive** slap to the face!`, result: `f`},
                { name: `${interaction.user} triggered raging mode, \n> ${displayuser}'s **attempts** to avoid \n> the **kiss** went unoticed.`, result: `s`},
                { name: `${interaction.user} tried to **kiss** ${displayuser} but \n> ${displayuser} dodged their **mouth**, \n> what a fail! (oh yeah, ${displayuser} reported \n> you for sexual harassment)`, result: `f`},
                { name: `${interaction.user} **couldn't** kiss ${displayuser} at \n> first, but **JASO0ON** helped \n> them out! **We all need a little help!**`, result: `s`},
                { name: `${interaction.user} tried to **kill** ${displayuser}, \n> but **JASO0ON** felt mercy and \n> **kissed** ${interaction.user} instead, what`, result: `f`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> they **liked** that..`, result: `s`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> how romantic!`, result: `s`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> lol.. **W** rizz 😎`, result: `s`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> will they do it back?`, result: `s`}
            ]

            const randomizer = Math.floor(Math.random() * interact.kiss.length);
            const failchance = Math.floor(Math.random() * results.length);

            const kissembed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTimestamp()
            .setTitle('> A wonderful kiss!')
            .setFooter({ text: `💋 Kiss Occured`})
            .setAuthor({ name: `💋 Interaction System`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
            .setImage(interact.kiss[randomizer])

            if (results[failchance].result === 'f') {
                kissembed.addFields({ name: `• You were rejected`, value: `> ${results[failchance].name}`})
            }

            if (results[failchance].result === 's') {
                kissembed.addFields({ name: `• You kissed someone`, value: `> ${results[failchance].name}`})
            }

            await interaction.reply({ embeds: [kissembed], content: `${displayuser}` });

            

            if (results[failchance].result === 's') {

                    if (!data) {
                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 0,
                            KissGive: 1,
                            Yell: 0,
                            YellGive: 0
                        })
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { KissGive: data.KissGive + 1 }});
                    }
        
                    if (!interactdata) {
                        interactdata = await profileschema.create({
                            User: displayuser.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 1,
                            KissGive: 0,
                            Yell: 0,
                            YellGive: 0
                        })
                    } else {
                        await profileschema.updateOne({ User: displayuser.id }, { $set: { Kiss: interactdata.Kiss + 1}});
                    }

                } else if (results[failchance].result === 'f') {

                    if (!data) {
                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 1,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 0,
                            KissGive: 0,
                            Yell: 0,
                            YellGive: 0
                        })
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                    }
            } 

            break;
            case 'yell':

            if (interaction.user.id === displayuser.id) {
                await interaction.reply({ content: `You tried **yelling at yourself**, you need therapy.. 🗣`, ephemeral: true});
                return await interaction.channel.send({ content: `${interaction.user} tried **yelling at themselves**, can someone get him a therapist.. 🗣`});
            }

            const results1 = [
                { name: `${interaction.user} **yelled at** ${displayuser}!`, result: `s`},
                { name: `${interaction.user} **yelled at** ${displayuser}, how rude!`, result: `s`},
            ]

            const randomizer1 = Math.floor(Math.random() * interact.yell.length);
            const failchance1 = Math.floor(Math.random() * results1.length);

            const yellembed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTimestamp()
            .setTitle('> My ears!')
            .setFooter({ text: `🗣 YELLING`})
            .setAuthor({ name: `🗣 Interaction System`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setImage(interact.yell[randomizer1])
            .addFields({ name: `• Yelled at someone`, value: `> ${results1[failchance1].name}`})
            

            await interaction.reply({ embeds: [yellembed], content: `${displayuser}` });

                    if (!data) {
                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 0,
                            KissGive: 0,
                            Yell: 0,
                            YellGive: 1
                        })
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { YellGive: data.YellGive + 1 }});
                    }
        
                    if (!interactdata) {
                        interactdata = await profileschema.create({
                            User: displayuser.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 0,
                            KissGive: 0,
                            Yell: 1,
                            YellGive: 0
                        })
                    } else {
                        await profileschema.updateOne({ User: displayuser.id }, { $set: { Yell: interactdata.Yell + 1}});
                    }
        }
    }
}