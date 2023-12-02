const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const htmlEntities = {//ran into weird errors going through util
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
const linkToRemoveRegex = /https:\/\/t\.co\/[a-zA-Z0-9.]+$/;
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

class TwitterPostBackup {
    constructor(data) {
        if (data) {
            this.date = new Date(data.createdAt);
            this.id = parseInt(data.id);
            this.userID = parseInt(data.tweetBy.id);
            this.userName = data.tweetBy.userName;
            this.nickName = data.tweetBy.fullName;
            this.content = parseHtmlEntities(data.fullText.toString());
            this.content = this.content.replace(linkToRemoveRegex, '').trim();
            this.content = this.content.replace('.', '\n');
            this.retweets = parseInt(data.retweetCount);
            this.likes = parseInt(data.likeCount);
            this.reply = parseInt(data.replyCount);
            //let mediaURL = [];
            const mediaURL = data.media;
            if (Array.isArray(mediaURL) && mediaURL.length > 0) {
                mediaURL.forEach((media) => {
                    if (media.url.startsWith('https://pbs.twimg')) {
                        this.imageUrls = this.imageUrls || [];
                        this.imageUrls.push(media.url);
                    } else if (media.url.startsWith('https://video.twimg')) {
                        this.videoUrls = this.videoUrls || [];
                        this.videoUrls.push(media.url);
                    }
                });
            }
            console.log("userName: ", this.userName);
        }
      }
        
    
      getDiscordAttachments(spoiler) {
        console.log("so this is where i want to go");
        if (this.videoUrls) {
            return this.videoUrls.map((url) => {
                return fetch(url, {
                  headers: {
                    headers: this._headers
                  }
                })
                  .then((response) => response.buffer())
                  .then((image) => {
                    console.log("returning attachment");
                    return new AttachmentBuilder(image, { name: `${spoiler ? "SPOILER_" : ""}${this.videoUrls}.mp4` });
                  });
              });
        } else if (this.imageUrls) {
          return this.imageUrls.map((url) => {
            return fetch(url, {
              headers: {
                headers: this._headers
              }
            })
              .then((response) => response.buffer())
              .then((image) => {
                console.log("returning attachment");
                return new AttachmentBuilder(image, { name: `${spoiler ? "SPOILER_" : ""}${this.imageUrls}.jpg` });
              });
          });
        } else return;
      }

      getDiscordEmbed(){
        const embed = new EmbedBuilder();
        embed.setColor(0x0099FF)
        if(this.reply && this.reply > 0){
          embed.addFields({ name: "💬", value:
          this.reply.toString(), inline: true});
        }
        if(this.retweets && this.retweets > 0){
          embed.addFields({ name: "🔁", value:
          this.retweets.toString(), inline: true });
        }
        if(this.likes && this.likes > 0){
          embed.addFields({ name: "❤️", value:
          this.likes.toString(), inline: true});
        }
        embed.setTimestamp(this.date);
        embed.setTitle(`${this.nickName} (@${this.userName})`)
        embed.setURL(`https://twitter.com/${this.userName}`)

        if(!this.content == ''){
            embed.setDescription(this.content);
        }
        embed.setFooter({ text: "Twitter", iconURL: 'https://img.icons8.com/color/48/twitter--v1.png' });
      

        return embed;
      }

}

module.exports = TwitterPostBackup;