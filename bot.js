var Discord = require('discord.io');
const { add } = require('winston');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
 });
 bot.on('ready', function (evt) {
     logger.info('Connected');
     logger.info('Logged in as: ');
     logger.info(bot.username + ' - (' + bot.id + ')');
 });

 var data = {55: "Go outside!",
             69: "Is the highest number",
             47: "Is 52",
             4: "Beats 47",
             1: "Beats 100",
             3: "Beats 69",
             83: "Go to sleep!",
             10: "Roll again!",
             93: "Make a cup of tea",
             17: "You must random and everyone else ignores your number",
             5: "You must play Meepo. (Unranked)",
             50: "Flip the ranking order (Lowest number is now pos 1 etc.)"
};

function checkRoll(roll, channelID){
    if(roll in data){
        bot.sendMessage({
            to:channelID,
            message: `${roll}: ${data[roll]}`
        })
    }
    else {
        bot.sendMessage({
            to:channelID,
            message: "No rule found."
        })
    }
}

function addRule(roll, text, channelID){
    if(roll !== null || roll in data){
        var regex = /\D+/g;
        console.log(text);
        var rule = text.match(regex)[1].trim();
        data[roll] = rule;
        bot.sendMessage({
            to:channelID,
            message: `Rule added - ${roll}: ${rule}`
        })
    }
    else {
        bot.sendMessage({
            to:channelID,
            message: "Error in adding rule."
        })
    }
}

function removeRule(roll, channelID){
    if(roll in data){
        bot.sendMessage({
            to:channelID,
            message: `Rule for ${roll} removed: ${data[roll]}`
        });
        delete data[roll];
    }
}

function rollNumber(channelID){
    var num = Math.floor(Math.random() * 100) + 1;
    bot.sendMessage({
        to:channelID,
        message: `Your roll: ${num}`
    })
}

function listRules(channelID){
    var rules;
    for(number in Object.keys(data)){
        if(data[number] !== undefined){
            rules += `${number}: ${data[number]} \n`
        }
    }
    bot.sendMessage({
        to:channelID,
        message: `Current Rules: ${rules}`
    })
}

 bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var roll = args[1];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'check':
                checkRoll(roll, channelID)
            break;
            case 'add':
                var rule = args[2];
                addRule(roll, message, channelID);
            break;
            case 'remove':
                removeRule(roll, channelID);
            break;
            case 'roll':
                var num = rollNumber(channelID);
                checkRoll(num, channelID);
            break;
            case 'rules':
                listRules(channelID)
            break;
            // Just add any case commands if you want to..
         }
     }
});