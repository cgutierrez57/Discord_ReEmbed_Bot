const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const MAX_DISCORD_UPLOAD = 26214400;

class TikTokPost {
  constructor(data) {
//so much simpler
    this.date = new Date(parseInt(data.timestamp.toString() + "000"));
    this.content = data.description;
    this.nickName = data.creator;
    this.username = data.uploader;
    this.authorUrl = data.uploader_url;

    this.likes = data.like_count;
    this.reposts = data.repost_count;
    this.reply = data.comment_count;

    // filtering for smallest file size
    //doing this to avoid rate limit errors which can kill the bot if certain images are too large
    const chosenFile = data.formats
      .filter((media) => media.filesize < MAX_DISCORD_UPLOAD && media.format.includes("watermarked"))
      .sort((a, b) => b.filesize - a.filesize)?.[0];

    if (!chosenFile) {
      return;
    }

    if (chosenFile.http_headers) {
      this._headers = chosenFile.http_headers;
    } else {
      this._headers = {};
    }
    this.videoUrl = chosenFile.url;
  }

  getDiscordAttachment(spoiler) {
    if (this.videoUrl) {
      console.log(this.videoUrl);
      return fetch(this.videoUrl, {
        headers: this.headers
      })
        .then((response) => response.buffer())
        .then((videoResponse) => {
          return new AttachmentBuilder(videoResponse, { name: `${spoiler ? "SPOILER_" : ""}${this.id}.mp4` });
        });
    } else return;
  }

  getDiscordEmbed() {
    const embed = new EmbedBuilder();
    embed.setColor(0xee1d52);
    
    if(this.reply && this.reply > 0){
      embed.addFields({ name: "💬", value:
      this.reply.toString(), inline: true});
    }
    if(this.reposts && this.reposts > 0){
      embed.addFields({ name: "🔁", value:
      this.reposts.toString(), inline: true });
    }
    if(this.likes && this.likes > 0){
      embed.addFields({ name: "❤️", value:
      this.likes.toString(), inline: true});
    }
    embed.setTimestamp(this.date);
    embed.setTitle(`${this.nickName} (@${this.username})`);
    embed.setURL(this.authorUrl);
    if(!this.content == ''){
      embed.setDescription(this.content);
    }
    embed.setFooter({ text: "TikTok", iconURL: 'https://img.icons8.com/ios-glyphs/30/tiktok.png'});
    
    
    return embed;
  }
}

module.exports = TikTokPost;
