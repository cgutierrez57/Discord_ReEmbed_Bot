const { DiscordAPIError, BaseGuildTextChannel } = require("discord.js");
const { exec } = require("child_process");
const twitbackup = require("../webclients/TwitterBackup");

function safeReply(message, newMessage) {
  try {
    if (
      message.channel instanceof BaseGuildTextChannel )
     {
      
      return message.reply(newMessage);
    }
  } catch (exception) {
    if (exception instanceof DiscordAPIError) {
      const rateLimitLimit = error.headers.get("X-RateLimit-Limit");
      const rateLimitRemaining = error.headers.get("X-RateLimit-Remaining");
      const rateLimitReset = error.headers.get("X-RateLimit-Reset");

      if (rateLimitLimit && rateLimitRemaining && rateLimitReset) {
          console.log(`Rate limited. Limit: ${rateLimitLimit}, Remaining: ${rateLimitRemaining}, Reset: ${rateLimitReset}`);
      }
      return;
    }
    throw exception;
  }
}


const htmlEntities = {
    nbsp: " ",
    cent: "¢",
    pound: "£",
    yen: "¥",
    euro: "€",
    copy: "©",
    reg: "®",
    lt: "<",
    gt: ">",
    quot: '"',
    amp: "&",
    apos: "'"
  };

  function parseHtmlEntities(str) {
    return str.replace(/&([^;]+);/g, function (entity, entityCode) {
      var match;
  
      if (entityCode in htmlEntities) {
        return htmlEntities[entityCode];
      } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
        return String.fromCharCode(parseInt(match[1], 16));
      } else if ((match = entityCode.match(/^#(\d+)$/))) {
        return String.fromCharCode(~~match[1]);
      } else {
        return entity;
      }
    });
  }

  function sh(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        console.log(command);
        if (error){
          console.log("sh error");
          reject(error);
        }
        console.log("sh resolved");
        if(stdout === '[twitter][error] AuthorizationError: NSFW Tweet'){
          twitbackup(command);
        }
        resolve(stdout);
        
      });
    });
  }


  module.exports = {
    parseHtmlEntities,
    sh,
    safeReply,
  }
  