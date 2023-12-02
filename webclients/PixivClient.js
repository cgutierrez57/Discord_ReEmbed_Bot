const PixivPost = require("./PixivPost");
const { sh } = require("../util/util");

class TwitterClient {
    async getPost(match){
        const url = match[0];

        try{
            console.log(url);
            return await sh(`gallery-dl ${url.replace(/'/g, "'\\''")} -j`).then((stdout) => {
                console.log("json parsing");
                return new PixivPost(JSON.parse(stdout));
              });
        } catch(error){
            console.log("errored");
        }
        return;

    }
}

module.exports = new TwitterClient();