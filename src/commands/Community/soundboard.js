const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('soundboard')
    .setDMPermission(false)
    .setDescription('Play a sound ')
    .addStringOption(option =>
      option.setName('sound')
        .setDescription('Your choice')
        .setRequired(true)
        .addChoices({name:'Bruh',value:'Bruh'},             
                    {name:'Aw Crap',value:'Crap'},
                    {name:'Uwu',value:'Uwu'},              
                    {name:'Summertime Nyan',value:'SummertimeNyan'},
                    {name:'Wow',value:'Wow'},
                    {name:'Taco Bell',value:'TacoBell'},
                    {name:'Fart',value:'Fart'},
                    {name:'Fart Reverb',value:'fartreverb'},
                    {name:'Ben No',value:'benno'},
                    {name:'Amogus',value:'amogus'},
                    {name:'Boi What The Hell',value:'whatthehell'},
                    {name:'Vine Boom',value:'vineboom'},
                    {name:'Are You Serious Rn Bro',value:'seriousrn'},
                    {name:'Sui',value:'sui'},
                    {name:'Nut',value:'nut'},
                    {name:'Emotional Damage',value:'emotional'},
                    {name:'Drip Goku',value:'drip'},
                    {name:'You Died',value:'youdied'},
                    {name:'Augghhh',value:'augh'},
                    {name:'Yeet',value:'yeet'},
                    {name:'Fortnite Death',value:'fd'},
                    {name:'Alert',value:'alert'},
                    {name:'The Rock',value:'rock'},
                    {name:'Spongebob',value:'spongebob'})
    ),
  async execute(interaction) {
    const sound = interaction.options.getString('sound');
    let audioURL;

    if (sound === 'Bruh') {

      audioURL = 'https://www.myinstants.com/media/sounds/movie_1_C2K5NH0.mp3';

    } else if (sound === 'SummertimeNyan') {

      audioURL = 'https://www.myinstants.com/media/sounds/summer-time-anime-love_q5du5Qo.mp3';

    } else if (sound === 'Uwu') {

      audioURL = 'https://www.myinstants.com/media/sounds/sussy-uwu.mp3';

    } else if (sound === 'Crap') {

      audioURL = 'https://www.myinstants.com/media/sounds/gta-san-andreas-ah-shit-here-we-go-again.mp3';

    }  else if (sound === 'sukisuki') {

      audioURL = 'https://www.myinstants.com/media/sounds/1080p-kaguya-sama-wk-03_trim1-online-audio-converter.mp3';

    }  else if (sound === 'Wow') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091781902207287377/anime-wow-sound-effect-mp3cut.mp3';
    
    } else if (sound === 'TacoBell') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091781570504970350/taco-bell-bong-sfx.mp3';

    } else if (sound === 'Fart') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091781957635018966/dry-fart.mp3';
    
    } else if (sound === 'Discord') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091781013866303581/discord-notification.mp3';
      
    } else if (sound === 'fartreverb') {

        audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091781919693344949/fart-with-reverb_2.mp3';
        
    } else if (sound === 'amogus') {

        audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091782476629803098/guy-yelling-among-us-sound-effect.mp3';
        
    } else if (sound === 'spongebob') {

        audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091782455247245362/yt1s_Umv6I50.mp3';
        
    } else if (sound === 'benno') {

        audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091781932381122660/ben-no.mp3';
        
    } else if (sound === 'whatthehell') {

        audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091784619457790002/boi-what-da-hell-boi.mp3';
        
    } else if (sound === 'vineboom') {

        audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091784620103704596/vine-boom_1.mp3';
        
    } else if (sound === 'seriousrn') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1091784619810103516/are-you-serious-right-now-ishowspeed.mp3';
      
    } else if (sound === 'sui') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021623290331147/suiiiiiiiiiii.mp3';
      
    } else if (sound === 'nut') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021623617507378/nut_ZKo5FA9.mp3';
      
    } else if (sound === 'emotional') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021623890128946/emotional-damage-meme.mp3';
      
    } else if (sound === 'drip') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021624175329340/drip-goku-meme-song-original-dragon-ball-super-music-clash-of-gods-in-description.mp3';
      
    } else if (sound === 'youdied') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021624464756758/dark-souls-_you-died_-sound-effect-from-youtube.mp3';
      
    } else if (sound === 'augh') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021624833847357/aughhhhh-aughhhhh.mp3';
      
    } else if (sound === 'yeet') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092027440286674974/yeet_1.mp3';
      
    } else if (sound === 'fd') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021625601413190/tmp_7901-951678082.mp3';
      
    } else if (sound === 'alert') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021625983086712/tindeck_1.mp3';
      
    } else if (sound === 'rock') {

      audioURL = 'https://cdn.discordapp.com/attachments/1080219392337522718/1092021626377359430/the-rock-meme.mp3';
      
    }
      

    if (!interaction.member.voice.channel) {
      await interaction.reply({content:'You must be in a **voice channel** to use this command.',ephemeral:true});
      return;
    }

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

      const audioPlayer = createAudioPlayer();

    connection.subscribe(audioPlayer);

    const audioResource = createAudioResource(audioURL);

    audioPlayer.play(audioResource);

    const message = await interaction.reply({ content: `Playing your **sound effect**..`, fetchReply: true, ephemeral:true });

    audioPlayer.on('stateChange', (oldState, newState) => {

      if (newState.status === 'idle') {

        connection.destroy();

        interaction.editReply({ content: `Your **sound effect** finished playing.`, ephemeral:true });

      }

    });

    audioPlayer.on('error', error => {

      console.error(error);

      connection.destroy();

      message.edit({ content: `An **error** occured whilst playing your **sound effect**!`});

    });

  },

};