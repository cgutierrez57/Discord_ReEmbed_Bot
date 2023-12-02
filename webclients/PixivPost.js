const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { parseHtmlEntities } = require("../util/util");



function convertToMasterUrl(originalUrl) {
  
  const regex = /img-original/;
  
  // Replace 'img-original' with 'img-master' and change the ending
  let masterUrl = originalUrl.replace(regex, 'img-master');
  if (originalUrl.endsWith('.jpg')) {
    masterUrl = masterUrl.replace('.jpg', '_master1200.jpg');
  } else if (originalUrl.endsWith('.png')) {
    masterUrl = masterUrl.replace('.png', '_master1200.jpg');
  }
  console.log(masterUrl);
  return masterUrl;
}

class TwitterPost {
    constructor(data) {
        if(Array.isArray(data) && data.length > 0){
            data.forEach(item => {
                if(Array.isArray(item) && item.length > 0){
                    const itemType = item[0];
                    
                    if(itemType === 2){
                        console.log("we are in the 3");
                        const pixivData = item[1];
                        this.date = new Date(pixivData.date);
                        this.content = parseHtmlEntities(pixivData.caption);
                        this.title = parseHtmlEntities(pixivData.title);
                        this.userName = pixivData.user.name;
                        this.bookmarks = pixivData.total_bookmarks;
                        this.comments = pixivData.total_comments;
                        this.view  = pixivData.total_view;
                        this.url = pixivData.id;
                        this.userId = pixivData.user.id
                    } else if(itemType === 3){
                        const mediaURL = item[1];
                        console.log('Media URL: ', mediaURL);
                        const masterURL = convertToMasterUrl(mediaURL);
                        console.log('Media URL: ', masterURL);
                        this.imageUrls = this.imageUrls || [];
                        this.imageUrls.push(masterURL);
                        
                    }
                }
            });
        }
        
    }
    getDiscordAttachments(spoiler) {
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
                headers: this._headers,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Referer': 'https://www.pixiv.net/',
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
        embed.setColor(0x0096fa)
        if(this.comments && this.comments > 0){
          embed.addFields({ name: "💬", value:
          this.comments.toString(), inline: true});
        }
        if(this.bookmarks && this.bookmarks > 0){
          embed.addFields({ name: "❤️", value:
          this.bookmarks.toString(), inline: true});
        }
        embed.setTimestamp(this.date);
        embed.setTitle(`${this.title}`)
        embed.setURL(`https://www.pixiv.net/en/artworks/${this.url}`)
        embed.setAuthor({
            name: `${this.userName}`,
            url: `https://www.pixiv.net/en/users/${this.userId}`
        })
        if(!this.content == ''){
            embed.setDescription(this.content);
        }
        embed.setFooter({ text: "Pixiv", iconURL: 'https://cdn6.aptoide.com/imgs/9/2/b/92bb445ddd2913eba419052769e020a1_icon.png?w=128' }); //lol lmao
      

        return embed;
      }

}

module.exports = TwitterPost;