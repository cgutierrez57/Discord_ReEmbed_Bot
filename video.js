const MAX_DISCORD_UPLOAD = 26214400;
const { safeReply } = require("./util/util");
const { DiscordAPIError } = require("discord.js");
const fs = require("fs").promises;

module.exports = async function video(message, posts, fallback = false){
    const embeds = [];
    let attachments = [];
    let content = "";
    let outputFilePathsToDelete = [];

    posts.forEach(async (post) => {
        if(!post){
            return;
        }
        if(post.embed){
            embeds.push(post.embed);

        }
        console.log("embed url: ", post.embed);
        //console.log("attachment name: ", post.attachment.AttachmentBuilder);
        if (post.embed.url && post.embed.url.startsWith("https://v.redd.it")) {
                console.log("adding to delete ", post.attachment.name);
                await outputFilePathsToDelete.push(post.attachment.name);
        }
        if(post.attachment && !fallback){
            console.log("added attachment");
            if (Array.isArray(post.attachment)) {
                console.log("is array");
                post.attachment.forEach((attachment) => attachments.push(attachment));
              } else{
                console.log("isnt array");

                attachments.push(post.attachment);
              }
              if (post.embed.data.url && post.embed.data.url.startsWith("https://v.redd.it")) {
                console.log("adding to delete ", post.attachment[0].name);
                await outputFilePathsToDelete.push(post.attachment[0].name);
        }

            return null;
        }
        if(post.videoUrl){
            console.log("post.videoURL", post.videoUrl);
            if(post.spoiler){
                content += ` || ${post.videoUrl} ||`;
            } else{
                content += " " + post.videoUrl;
            }
        }
    });

    attachments = attachments.slice(0, 10);

    let Attachments;
    if(attachments.length !== 0){
        Attachments = (await 
        Promise.all(attachments)).filter((attachment) => attachment != undefined);
        console.log("downloaded attachment", attachments );
        let attachmentNum = 0;
        Attachments = Attachments.filter((attachment) => {
            if(!attachment.attachment.length){
                return true;
            }
            if(attachment.attachment.length > MAX_DISCORD_UPLOAD){
                return false;
            }
            if(attachmentNum + attachment.attachment.length > MAX_DISCORD_UPLOAD){
                return false;
            }

            attachmentNum += attachment.attachment.length;

            return true;
        });

    }

    content = content.trim();
    if(content === ""){
        content = undefined;
    }
    if(!content && (Attachments === undefined || Attachments.length == 0) && !embeds){
        console.log("no attachments or content");
        return null;
    }
    let response;
    //console.log("attachments ", Attachments);
    //console.log("embeds: ", embeds);
    try {
        response = await safeReply(message, { allowedMentions: { repliedUser: false }, files: Attachments, embeds, content});
        await message.suppressEmbeds();
        console.log("trying to delete file ", outputFilePathsToDelete);
        for (const filePathToDelete of outputFilePathsToDelete) {
            console.log("really trying to delete file: ", filePathToDelete);
            await fs.unlink(filePathToDelete);
            console.log(`Deleted file: ${filePathToDelete}`);
        }
        
        
    } catch(error){
        if (error instanceof DiscordAPIError) {
          } else {
            throw error;
          }
    }

    //console.log("response: ", response);
    return [ response, { mode: "VIDEO", fallback }];

};
