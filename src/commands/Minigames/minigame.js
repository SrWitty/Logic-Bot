const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { TwoZeroFourEight, Minesweeper, Snake, Hangman, TicTacToe, Wordle } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('minigame')
    .setDescription('Starts a minigame for you.')
    .setDMPermission(false)
    .addSubcommand(command => command.setName('8ball').setDescription('Asks 8ball a specified question.').addStringOption(option => option.setName('question').setDescription('Specified question will be asked by you to the 8ball').setRequired(true).setMaxLength(200)))
    .addSubcommand(command => command.setName('2048').setDescription('Starts a game of the classic game, 2048.'))
    .addSubcommand(command => command.setName('minesweeper').setDescription('Starts a game of explosive minesweeper.'))
    .addSubcommand(command => command.setName('snake').setDescription('Starts a game of snake for you.'))
    .addSubcommand(command => command.setName('hangman').setDescription('Starts a game of hangman for you.'))
    .addSubcommand(command => command.setName('tic-tac-toe').setDescription('Starts a game of tic-tac-toe for you.').addUserOption(option => option.setName('opponent').setDescription('Specified user will be your opponent.').setRequired(true)))
    .addSubcommand(command => command.setName('wordle').setDescription('Starts a game of worlde for you.'))
    .addSubcommand(command => command.setName('would-you-rather').setDescription('Gives you 2 options, what do you choose?')),
    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case '8ball':

            const question = interaction.options.getString('question');
            const choice = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful.", "Jason said no, I must agree with him :(", "Jason said yes, I must agree with him :)"]
            const ball = Math.floor(Math.random() * choice.length)

            const embed = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: '🎱 8ball has got the answer'})
            .setTitle(`> The question "${question}" \n> was sumbited`)
            .addFields({ name: `• Roll the ball`, value: `> Roll the ball to find out what \n> the 8ball has to say`})
            .setTimestamp()
            .setFooter({ text: '🎱 8ball Playground'})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')

            const embed2 = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: '🎱 8ball has got the answer'})
            .setTitle(`> The question "${question}" was \n> judged by the 8ball`)
            .addFields({ name: `• 8ball's answer`, value: `> ${choice[ball]}`})
            .setTimestamp()
            .setFooter({ text: '🎱 8ball Playground'})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('button')
                .setLabel('🎱 Roll the 8ball')
                .setStyle(ButtonStyle.Primary)
            )

            const msg = await interaction.reply({ embeds: [embed], components: [button]});
            const collector = msg.createMessageComponentCollector();

            collector.on('collect', async i => {
                if (i.customId == 'button') {
                    i.update({ embeds: [embed2], components: []})
                }
            })

            break;
            case '2048':

            const Game = new TwoZeroFourEight({
                message: interaction,
                embed: {
                  title: '2048',
                  color: '#5865F2'
                },
                emojis: {
                  up: '⬆️',
                  down: '⬇️',
                  left: '⬅️',
                  right: '➡️',
                },
                timeoutTime: 60000,
                buttonStyle: 'SUCCESS',
                playerOnlyMessage: 'You **cannot** use this menu!'
              });
              
              Game.startGame();
              Game.on('gameOver', result => {
                return;
            });

            break;
            case 'minesweeper':

            const Game1 = new Minesweeper({
                message: interaction,
                embed: {
                  title: 'Minesweeper',
                  color: '#5865F2',
                  description: 'Click on the buttons to reveal the blocks.'
                },
                emojis: { flag: '🚩', mine: '💣' },
                mines: 5,
                timeoutTime: 60000,
                winMessage: 'You won the Game! You successfully avoided all the mines.',
                loseMessage: 'You lost the Game! Beaware of the mines next time :(',
                playerOnlyMessage: 'You **cannot** use this menu!'
              });
              
              Game1.startGame();
              Game1.on('gameOver', result => {
                return
            });

            break;
            case 'snake':

            const Game2 = new Snake({
                message: interaction,
                embed: {
                  title: 'Snake Game',
                  overTitle: 'Game Over',
                  color: '#5865F2'
                },
                emojis: {
                  food: '🍎',
                  up: '⬆️', 
                  down: '⬇️',
                  left: '⬅️',
                  right: '➡️',
                },
                snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
                foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
                stopButton: 'Stop',
                timeoutTime: 60000,
                playerOnlyMessage: 'You **cannot** use this menu.'
            });
              
            Game2.startGame();
            Game2.on('gameOver', result => {
                return;
            });

            break;
            case 'hangman':

            const Game3 = new Hangman({
                message: interaction,
                embed: {
                    title: '> You have started a game of Hangman!',
                    color: '#32a852'
                },
                hangman: { hat: "🎩", head: "😟", shirt: "👕", pants: "👖", boots: "🥾🥾"},
                timeoutTime: 60000,
                themeWords: "all",
                winMessage: "> You won! The word was **{word}**",
                loseMessage: "> You lost! The word was **{word}**",
                playerOnlyMessage: "Only **{player}** can use this menu!",
            })
    
            Game3.startGame();
            Game3.on('gameOver', result => {
                return;
            })

            break;
            case 'tic-tac-toe':

            const enemy = interaction.options.getUser('opponent');
            if (interaction.user.id === enemy.id) return await interaction.reply({ content: `You **cannot** play with yourself, silly goose..`, ephemeral: true});
            if (enemy.bot) return await interaction.reply({ content: `You **cannot** play with a bot, silly goose..`, ephemeral: true});

            const game = new TicTacToe({
                message: interaction,
                isSlashGame: true,
                opponent: interaction.options.getUser('opponent'),

                embed: {
                    title: '> Tic Tac Toe',
                    color: 'DarkBlue',
                    statusTitle: '• Status',
                    overTitle: '• Game Over',
                    image: 'https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png'
                },

                emojis: {
                    xButton: '❌',
                    oButton: '🔵',
                    blankButton: '➖'
                },

                mentionUser: true,
                timeoutTime: 120000,
                xButtonStyle: 'DANGER',
                oButtonStyle: 'PRIMARY',
                turnMessage: '> **{player}**, it is your turn!.',
                winMessage: '> **{player}** won the TicTacToe Game!',
                tieMessage: '> The game turned out to be a tie!',
                timeoutMessage: '> The game went unfinished! no one won the game!',
                playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
            });

            try {
                await game.startGame();
            } catch (err) {
                await interaction.reply('There was an error starting the game!');
            }

            game.on('gameOver', result => {
                return;
            })
            
            break;
            case 'wordle':

            const Game4 = new Wordle({
                message: interaction,
                isSlashGame: false,
                embed: {
                    title: '> You have started a game of Worlde! \n> Type out your guesses in the chat.',
                    color: '#32a852'
                },
                customword: null,
                timeoutTime: 120000,
                winMessage: `> • You **won**! The word was: **{word}**`,
                loseMessage: `> • You **lost**! The word was: **{word}**`,
                playerOnlyMessage: 'Only **{player}** can use this menu!'
            });
            
            Game4.startGame();
            Game4.on('gameOver', result => {
                return;
            })

            break;
            case 'would-you-rather':

            const questions = ["> Would you rather eat a bug or a fly?","Would you rather lick the floor or a broom?","Would you rather eat ice cream or cake?","Would you rather clean a toliet or a babys diaper","Would you rather lick your keyboard or mouse?","Would you rather wash your hair with mash potatoes or cranberry sauce?","Would you rather team up with Wonder Woman or Captain Marvel?","Would you rather want to find true love or win lottery next month?","Would you rather be forced to sing along or dance to every song you hear?"," Would you rather have everyone you know be able to read your thoughts or for everyone you know to have access to your Internet history?","Would you rather be chronically under-dressed or overdressed?","Would you rather lose your sight or your memories?","Would you rather have universal respect or unlimited power?","Would you rather give up air conditioning and heating for the rest of your life or give up the Internet for the rest of your life?","Would you rather swim in a pool full of Nutella or a pool full of maple syrup?","Would you rather labor under a hot sun or extreme cold?","Would you rather stay in during a snow day or build a fort?","Would you rather buy 10 things you don’t need every time you go shopping or always forget the one thing that you need when you go to the store?","Would you rather never be able to go out during the day or never be able to go out at night?","Would you rather have a personal maid or a personal chef?","Would you rather have beyoncé’s talent or Jay-Z‘s business acumen?","Would you rather be an extra in an Oscar-winning movie or the lead in a box office bomb?","Would you rather vomit on your hero or have your hero vomit on you?","Would you rather communicate only in emoji or never be able to text at all ever again?","Would you rather be royalty 1,000 years ago or an average person today?","Would you rather lounge by the pool or on the beach?","Would you rather wear the same socks for a month or the same underwear for a week?","Would you rather work an overtime shift with your annoying boss or spend full day with your mother-in-law?","Would you rather cuddle a koala or pal around with a panda?","Would you rather have a sing-off with Ariana Grande or a dance-off with Rihanna?","Would you rather watch nothing but Hallmark Christmas movies or nothing but horror movies?","Would you rather always be 10 minutes late or always be 20 minutes early?","Would you rather have a pause or a rewind button in your life?","Would you rather lose all your teeth or lose a day of your life every time you kissed someone?","Would you rather drink from a toilet or pee in a litter box?","Would you rather be forced to live the same day over and over again for a full year, or take 3 years off the end of your life?","Would you rather never eat watermelon ever again or be forced to eat watermelon with every meal?","Would you rather go to Harvard but graduate and be jobless, or graduate from another college and work for Harvard","Would you rather the aliens that make first contact be robotic or organic?","Would you rather lose the ability to read or lose the ability to speak?","Would you rather have a golden voice or a silver tongue?","Would you rather be covered in fur or covered in scales?","Would you rather be in jail for a year or lose a year off your life?","Would you rather have one real get out of jail free card or a key that opens any door?","Would you rather know the history of every object you touched or be able to talk to animals?","Would you rather be married to a 10 with a bad personality or a 6 with an amazing personality?","Would you rather be able to talk to land animals, animals that fly, or animals that live under the water?","Would you rather have all traffic lights you approach be green or never have to stand in line again?","Would you rather spend the rest of your life with a sailboat as your home or an RV as your home?","Would you rather marry someone pretty but stupid or clever but ugly?","Would you rather give up all drinks except for water or give up eating anything that was cooked in an oven?","Would you rather be able to see 10 minutes into your own future or 10 minutes into the future of anyone but yourself?","Would you rather have to fart loudly every time you have a serious conversation or have to burp after every kiss?","Would you rather become twice as strong when both of your fingers are stuck in your ears or crawl twice as fast as you can run?","Would you rather have everything you draw become real but be permanently terrible at drawing or be able to fly but only as fast as you can walk?","Would you rather thirty butterflies instantly appear from nowhere every time you sneeze or one very angry squirrel appear from nowhere every time you cough?","Would you rather vomit uncontrollably for one minute every time you hear the happy birthday song or get a headache that lasts for the rest of the day every time you see a bird (including in pictures or a video)?","Would you rather eat a sandwich made from 4 ingredients in your fridge chosen at random or eat a sandwich made by a group of your friends from 4 ingredients in your fridge?","Would you rather everyone be required to wear identical silver jumpsuits or any time two people meet and are wearing an identical article of clothing they must fight to the death?","Would you rather have to read aloud every word you read or sing everything you say out loud?","Would you rather wear a wedding dress/tuxedo every single day or wear a bathing suit every single day?","Would you rather be unable to move your body every time it rains or not be able to stop moving while the sun is out?","Would you rather have all dogs try to attack you when they see you or all birds try to attack you when they see you?","Would you rather be compelled to high five everyone you meet or be compelled to give wedgies to anyone in a green shirt?","Would you rather have skin that changes color based on your emotions or tattoos appear all over your body depicting what you did yesterday?","Would you rather randomly time travel +/- 20 years every time you fart or teleport to a different place on earth (on land, not water) every time you sneeze?","Would you rather there be a perpetual water balloon war going on in your city/town or a perpetual food fight?","Would you rather have a dog with a cat’s personality or a cat with a dog’s personality?","If you were reborn in a new life, would you rather be alive in the past or future?","Would you rather eat no candy at Halloween or no turkey at Thanksgiving?","Would you rather date someone you love or date someone who loves you?","Would you rather lose the ability to lie or believe everything you’re told?","Would you rather be free or be totally safe?","Would you rather eat poop that tasted like chocolate, or eat chocolate that tasted like crap?","Would you rather Look 10 years older from the neck up, or the neck down?","Would you rather be extremely underweight or extremely overweight?","Would you rather Experience the beginning of planet earth or the end of planet earth?","Would you rather have three kids and no money, or no kids with three million dollars?","Would you rather be the funniest person in the room or the most intelligent?","Would you rather have a Lamborghini in your garage or a bookcase with 9000 books and infinite knowledge?","Would you rather Reverse one decision you make every day or be able to stop time for 10 seconds every day?","Would you rather win $50,000 or let your best friend win $500,000?","Would you rather Run at 100 mph or fly at ten mph?","Would you rather Continue with your life or restart it?","Would you rather be able to talk your way out of any situation, or punch your way out of any situation?","Would you rather have free Wi-Fi wherever you go or have free coffee where/whenever you want?","Would you rather have seven fingers on each hand or have seven toes on each foot?","Would you rather live low life with your loved one or rich life all alone?","Would you rather have no one to show up for your wedding or your funeral?","Would you rather Rule the world or live in a world with absolutely no problems at all?","Would you rather go back to the past and meet your loved ones who passed away or go to the future to meet your children or grandchildren to be?","Would you rather Speak your mind or never speak again?","Would you rather live the life of a king with no family or friends or live like a vagabond with your friends or family?","Would you rather know how you will die or when you will die?","Would you rather Speak all languages or be able to speak to all animals?","Would you rather get away with lying every time or always know that someone is lying?","Would you rather Eat your dead friend or kill your dog and eat it when you are marooned on a lonely island?","Would you rather have a billion dollars to your name or spend $1000 for each hungry and homeless person?","Would you rather end death due to car accidents or end terrorism?","Would you rather end the life a single human being or 100 cute baby animals?","Would you rather end hunger or end your hunger?","Would you rather give up your love life or work life?","Would you rather live in an amusement park or a zoo?","Would you rather be a millionaire by winning the lottery or by working 100 hours a week?","Would you rather read minds or accurately predict future?","Would you rather eat only pizza for 1 year or eat no pizza for 1 year?","Would you rather visit 100 years in the past or 100 years in the future?","Would you rather be invisible or be fast?","Would you rather Look like a fish or smell like a fish?","Would you rather Play on Minecraft or play FIFA?","Would you rather Fight 100 duck-sized horses or 1 horse-sized duck?","Would you rather have a grapefruit-sized head or a head the size of a watermelon?","Would you rather be a tree or have to live in a tree for the rest of your life?","Would you rather live in space or under the sea?","Would you rather lose your sense of touch or your sense of smell?","Would you rather be Donald Trump or George Bush?","Would you rather have no hair or be completely hairy?","Would you rather wake up in the morning looking like a giraffe or a kangaroo?","Would you rather have a booger hanging from your nose for the rest of your life or earwax planted on your earlobes?","Would you rather have a sumo wrestler on top of you or yourself on top of him?"];
            const randomize = questions[Math.floor(Math.random() * questions.length)]
 
            const embed3 = new EmbedBuilder()
            .setTitle('• Would You Rather')
            .setDescription(`> ${randomize}`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setAuthor({ name: `🤔 Would You Rather`})
            .setFooter({ text: `🤔 Random Question initialized`})
            .setColor("DarkBlue")
            .setTimestamp()
        
            const embed1 = new EmbedBuilder()
            .setTitle('Would You Rather')
            .setDescription('> You chose **option 1**')
            .setAuthor({ name: `🤔 Would You Rather`})
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setFooter({ text: `🤔 Random Question chosen`})
            .setColor("DarkBlue")
            .setTimestamp()
        
            const embed5 = new EmbedBuilder()
            .setTitle('Would You Rather')
            .setAuthor({ name: `🤔 Would You Rather`})
            .setDescription('> You chose **option 2**')
            .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
            .setFooter({ text: `🤔 Random Question chosen`})
            .setColor("DarkBlue")
            .setTimestamp()
 
            const button1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('option1')
                .setLabel('Option 1')
                .setStyle(ButtonStyle.Success), 
                new ButtonBuilder()
                .setCustomId('option2')
                .setLabel('Option 2')
                .setStyle(ButtonStyle.Danger),
            
            )
 
            const message = await interaction.reply({embeds: [embed3], components: [button1]})
            const collector1 = await message.createMessageComponentCollector();
            collector1.on('collect', async i => {
            if (i.customId === 'option1') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: "You **cannot** use this menu.", ephemeral: true})
                }
                await i.update({embeds: [embed1], components: []})
            }
 
            if (i.customId === 'option2') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: "You **cannot** use this menu.", ephemeral: true})
                }
                await i.update({embeds: [embed5], components: []})
            }
        })
        }
    }
}