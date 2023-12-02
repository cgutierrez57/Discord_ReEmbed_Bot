const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { parseHtmlEntities, sh } = require("../util/util");
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');


class RedditPost {


    constructor(data) {
        if(Array.isArray(data) && data.length > 0){
            data.forEach(item => {
                if(Array.isArray(item) && item.length > 0){
                    const itemType = item[0];
                    
                    if(itemType === 2){
                        console.log("we are in the 2");
                        const redditData = item[1];
                        this.date = new Date(redditData.date);

                        this.userName = redditData.author;
                        this.redditName = redditData.subreddit_name_prefixed;
                        this.title = redditData.title;
                        this.upvotes = redditData.ups;
                        this.url = redditData.url;
                        this.content = parseHtmlEntities(redditData.selftext);
                    } else if(itemType === 3){
                        console.log("we are in the 3");
                        const mediaURL = item[1];
                        console.log('Media URL: ', mediaURL);

                        if(mediaURL.endsWith('.jpeg') || mediaURL.endsWith('.jpg') || mediaURL.endsWith('.png')){
                            
                            this.imageUrls = this.imageUrls || [];
                            this.imageUrls.push(mediaURL);
                        } else{
                            const newMEDIA = mediaURL.split('ytdl:')[1];
                            console.log("new media url", newMEDIA);
                            this.videoUrls = newMEDIA;
                        }       
                    }
                }
            });
        }
        
    }
    merge(video, audio, output){//fuck reddit man who the heck does this crap
      return new Promise((resolve, reject) => {
        ffmpeg()
          .input(video)
          .input(audio)
          .save(output)
          .on('end', () => {
            console.log("Merge finished");
            resolve();
          })
          .on('error', (error) => {
            console.error("Error: failed merging files");
            reject(error);
          });
      });
    }

    async videoFIX(){
      if(this.videoUrls){
        const oldMedia = JSON.parse(await sh(`yt-dlp ${this.videoUrls.replace(/'/g, "'\\''")} -j`));
        console.log("oldMedia Data Parsed: ", oldMedia);
        const newerMedia = oldMedia.formats
        for (const format of newerMedia) {
          if (format.format_note === 'DASH video') {
            this.video = format.url;
            console.log('Found DASH Video format:', format.format_note);
          }
          if(format.format_note === 'DASH audio'){
            this.audio = format.url;
            console.log('Found DASH Audio format:', format.format_note);
          }
        }
        const outputFileName = `${this.title}.mp4`;
        const outputFilePath = path.join(process.cwd(), outputFileName);
        await this.merge(this.video, this.audio, outputFilePath);
        this.videoUrls = '';
        this.videoUrls = this.videoUrls || [];
        this.videoUrls.push(outputFilePath);

      }
    }


    getDiscordAttachments(spoiler) {
        if (this.videoUrls) {
            return this.videoUrls.map((filePath) => {
              return new AttachmentBuilder(filePath, { name: `${spoiler ? "SPOILER_" : ""}${filePath}` });
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
                return new AttachmentBuilder(image, { name: `${spoiler ? "SPOILER_" : ""}${this.imageUrls}` });
              });
          });
        } else return;
      }

      getDiscordEmbed(){
        const embed = new EmbedBuilder();
        embed.setTimestamp(this.date);
        embed.setTitle(this.title);
        embed.setURL(this.url);
        embed.setTimestamp(this.date);
        embed.setAuthor({
            name: `u/${this.userName}`
        })
        if(!this.content == ''){
            embed.setDescription(this.content);
        }
        if(this.upvotes){
          embed.addFields({ name: "🔺", value:
          this.upvotes.toString(), inline: true});
        }
        embed.setFooter({ text: `${this.redditName}`, iconURL: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-reddit-gives-you-the-best-of-the-internet-in-one-place-logo-color-tal-revivo.png' });
        return embed;
      }

}

module.exports = RedditPost;