//Node Modules
const discord = require('discord.js');
const fs = require('fs');

//import required Files
const botinfo = require('./botinfo.json')

//Bot Setup
const bot = new discord.Client({disableEveryone: true});
bot.commands = new discord.Collection();

//Command Handler
fs.readdir('commands/', (err, files) => {
    if(err){console.log(err)}
    var jsfile = files.filter(f => f.split('.').pop() === 'js');
    global.jsfile = jsfile
    if(jsfile.length <= 0){
        return(console.log('ERROR: No Commands Found'));
    }
    jsfile.forEach((f, i)=> {
        var props = require(`./commands/${f}`);
        if(!props.help || !props.help.name || !props.help.description){
            return(console.log(`ERROR: ${f} is Invalid`))
        }else{
            console.log(`SUCCESS: ${f} has Been Loaded!`)
            bot.commands.set(props.help.name, props)
        }
    })
})

//Ready Function
bot.on('ready', () => {
    console.log(`${bot.user.username} Is now online!`)
});

//Message (Server) Function
bot.on('message', async (message) => {
    if(message.author.bot || message.channel.type === 'dm'){return}
    var prefix = botinfo.prefix
    var messageArray = message.content.split(' ');
    var cmd = messageArray[0].toLowerCase();
    var args = messageArray.slice(1);

    var commandFile = bot.commands.get(cmd.slice(prefix.length));
    if(cmd.startsWith(prefix)){
        if(commandFile){commandFile.run(bot, message, args)}
    }
});

//Bot Login
bot.login(botinfo.token)