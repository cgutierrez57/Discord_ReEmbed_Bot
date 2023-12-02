const TwitterPost = require("./TwitterPost2");
const { sh } = require("../util/util");
const TwitterBackup = require("./TwitterBackup");

class TwitterClient {
    async getPost(match){
        const url = match[0];

        try{
            console.log(url);
            const stdout = await sh(`gallery-dl ${url.replace(/'/g, "'\\''")} -j`);  
            console.log("json parsing", JSON.parse(stdout));
            const parsedJson = JSON.parse(stdout);
                //sensitive tweets flagged as nsfw
            if(Array.isArray(parsedJson) && parsedJson.length === 1 && Array.isArray(parsedJson[0]) && parsedJson[0].length === 2 && parsedJson[0][0] === 'AuthorizationError' && parsedJson[0][1] === 'NSFW Tweet'){
                return await TwitterBackup(url);
            } else{
                return new TwitterPost(JSON.parse(stdout));
            }
        } catch(error){
            console.log("errored");
        }
        return;

    }
}

module.exports = new TwitterClient();