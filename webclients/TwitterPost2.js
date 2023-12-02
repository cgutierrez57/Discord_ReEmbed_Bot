const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const { parseHtmlEntities } = require("../util/util");

class TwitterPost {
    constructor(data) {

        if(Array.isArray(data) && data.length > 0){
            data.forEach(item => {
                if(Array.isArray(item) && item.length > 0){
                    const itemType = item[0];
                   
                    if(itemType === 2){
                        console.log("we are in the 3");
                        const tweetData = item[1];
                        this.date = this.date || [];
                        this.date = new Date(tweetData.date);
                        this.id = BigInt(tweetData.conversation_id);
                        this.userID = tweetData.user.id;
                        this.userName = tweetData.user.name;
                        this.nickName = tweetData.user.nick;
                        this.content = parseHtmlEntities(tweetData.content);
                        this.retweets = tweetData.retweet_count;
                        this.likes = tweetData.favorite_count;
                        this.reply = tweetData.reply_count;
                        console.log("username ", this.userName);
                        
                    } else if(itemType === 3){
                        const mediaURL = item[1];
                        console.log('Media URL: ', mediaURL);

                        if(mediaURL.startsWith('https://pbs.twimg')){
                            this.imageUrls = this.imageUrls || [];
                            this.imageUrls.push(mediaURL);
                        } else if(mediaURL.startsWith('https://video.twimg')){
                            this.videoUrls = this.videoUrls || [];
                            this.videoUrls.push(mediaURL);
                        }
                    }
                }
            });
        }
        
    }
    getDiscordAttachments(spoiler) {
      console.log("should i be here");
        if (this.videoUrls) {
            return this.videoUrls.map((url) => {
                return fetch(url, {
                  headers: {
                    headers: this.headers
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
                headers: this.headers
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
module.exports = TwitterPost;