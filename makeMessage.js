const discord = require("discord.js");
const { getPosts } = require("./getPosts2");
const mark = require("./mark");
const video = require("./video");


function shouldProcessMessage(message){
    console.log("hey a message");
    if(!message.content){
        console.log("message content missing!");
        return false;
    }
    if(message.author.id === discord.userMention.id){//blocks bot responding to self, well was supposed to does nothing tbh
        console.log("self, lmao");
        return false;
    }

    if(!/(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/.test(message.content)){
        console.log("not a url");
        return false;
    } else{
        console.log("url");
    }

    console.log("we have a url all checks correct");
    return true;
}


async function sendMessage(message, posts){
    return await video(message, posts);
}

module.exports = async function handleMessage(message){
    if(!shouldProcessMessage(message)){
        console.log("not a url will not process message");
        return null;
    }
    

    const syntax = mark(message.content);
    //console.log("syntax ", syntax);
 
    const posts = await getPosts(syntax);

    if(posts.length === 0){
        console.log("no posts valid");
        return null;
    }
    //console.log(posts.embed);
    console.log("valid post");
    const Posts = await Promise.all(posts);
    console.log("posts resolved");

    const response = await sendMessage(
        message,
        Posts.filter((a) => a != null)
    );

};