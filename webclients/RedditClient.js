const RedditPost = require("./RedditPost");
const { sh } = require("../util/util");
const config = require("../config.json");

class RedditClient {
    async getPost(match){
        const url = match[0];
        const configPath = "../config.json";
        try{
            //console.log(url);
            //console.log(`gallery-dl --config ${'./config.json'} ${url.replace(/'/g, "'\\''")} -j`);
            return await sh(`gallery-dl --config ${'./config.json'} ${url.replace(/'/g, "'\\''")} -j`).then((stdout) => {
                //console.log(JSON.parse(stdout));
                console.log("json parsing");
                return new RedditPost(JSON.parse(stdout));
              });
        } catch(error){
            console.log("errored");
        }
        return;

    }
}

module.exports = new RedditClient();