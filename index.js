const Discord = require("discord.js");
const makeMessage = require("./makeMessage");

const discord = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent
  ],
});

discord.on('ready', ()=> {

    console.log('CrispyBot alive');
    discord.user.setPresence({
        status: "online",
        activities: [{ name: process.env.STATUS ?? "figuring things out", type: 0}]
    });
});

discord.on('messageCreate', (message) => {//some silly things
    if(message.content.toLowerCase() === 'hello'){
        message.reply("hello!");
    }
    if(message.content.toLowerCase() == 'henlo'){
        message.reply("henlo lizer\nhello you STINKY LIZARD\ngo eat a flie ugly\n");
    }
});

discord.on("messageCreate", makeMessage);//where the magic happens





discord.login('YOUR_BOT_TOKEN');
