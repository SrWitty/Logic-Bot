const mongoose = require('mongoose');
const mongodbURl = process.env.MONGODBURL;


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        if (!mongodbURl) return console.error('No MongoDB URL provided!');

        await mongoose.connect(mongodbURl || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        if (mongoose.connect) {
            console.log('Connected to MongoDB!')
        }

     const activities_list = [
         `/help on ${client.guilds.cache.size} servers!`,
         `with ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users!`
     ];

     setInterval(() => {
        const status = activities_list[Math.floor(Math.random() * activities_list.length)];
        client.user.setPresence({ activities: [{name: `${status}`}], status: 'dnd'});
     }, 60000);
           
    },
};