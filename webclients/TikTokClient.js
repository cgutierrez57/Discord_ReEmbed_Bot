const TikTokPost = require("./TikTokPost");
const { sh } = require("../util/util");

class TikTokClient {
  async getPost(match) {
    const url = match[0];
    // This should be safe as our regexes earlier prevent any weirdness
    try {
      console.log(url);
      return await sh(`yt-dlp ${url.replace(/'/g, "'\\''")} -j`).then((stdout) => {
        //console.log(JSON.parse(stdout));
        return new TikTokPost(JSON.parse(stdout));
      });
    } catch (error) {
      console.log("error");

    }
    return;
  }
}

module.exports = new TikTokClient();
