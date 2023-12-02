//does this mean there was a getPosts1?

const clients = require("./util/clients");

function key(arr){
    const tmp = Object.create(null);
    for(const value of arr){
        tmp[value] = value;
    }
    return tmp;
}

const Providers = key([
    "REDDIT",
    "TIKTOK",
    "TIKTOK_ALT",
    "TWITTER",
    "X_DOT_COM",
    "PIXIV",
    "REDDIT_ALT",
]);

const URL_Regexes = {
    TIKTOK: /https?:\/\/(?:www\.)?tiktok\.com\/@[0-9a-zA-Z._]+\/video\/(\d+)/,
  TIKTOK_ALT: /https?:\/\/([a-z]{2,3})\.tiktok\.com\/(t\/)?([A-Za-z0-9]+)/,
  TWITTER: /https?:\/\/(?:(?:www|m(?:obile)?)\.)?(fx|vx)?twitter\.com\/(?:(?:i\/web|[^/]+)\/status|statuses)\/(\d+)/,
  X_DOT_COM: /https?:\/\/(?:(?:www|m(?:obile)?)\.)?()x\.com\/(?:(?:i\/web|[^/]+)\/status|statuses)\/(\d+)/,
  PIXIV: /https?:\/\/(?:www\.)?pixiv\.net\/(?:[^/]+\/)?artworks\/(\d+)/,
  REDDIT: /https?:\/\/(?:[^/]+\.)?reddit\.com(\/r\/[^/]+\/comments\/([^/?#&]+))/,
  REDDIT_ALT: /^https:\/\/www\.reddit\.com\/r\/[a-zA-Z0-9_]+\/s\/[a-zA-Z0-9_]+$/,
};
async function getPost(message, spoiler){
    let url;
    url = new URL(message.content)
    let provider;
    let i;
    console.log("getPost2");
    for(const [prov, regex] of Object.entries(URL_Regexes)){
        const j = url.href.match(regex);
        if(j){
            provider = prov;
            i = j;
        }
    }

    if(!provider){
        console.log("no provider");
        return null;
    }
    console.log(provider);

    let post;

    const providerClient = clients.get(provider);
    if(!providerClient){
        console.log("no provider client");
        return null;
    }
    console.log(providerClient);
    post = await providerClient.getPost(i);
    console.log("getting posts");
    console.log("my post: ", post);
    if(!post){
        //console.log("empty");
        //console.log(post);
        return null;
    }
    const needsAttachment = provider === Providers.TIKTOK || provider === Providers.TIKTOK_ALT  || provider === Providers.TWITTER || provider === Providers.X_DOT_COM || provider === Providers.PIXIV || provider === Providers.REDDIT || provider === Providers.REDDIT_ALT;
    console.log("getting attachment");
    let attachment;
    if(needsAttachment){
        if(provider === Providers.REDDIT || provider === Providers.REDDIT_ALT){
            await post.videoFIX();
        }
        if(post.getDiscordAttachments){
            console.log("attaching");
            attachment = post.getDiscordAttachments(spoiler);
        } else{
            console.log("array attaching");
            attachment = [post.getDiscordAttachment(spoiler)];
        }
    }
    console.log("gotten", attachment );
    let embeded = "";
    if(provider === 'TWITTER' || provider === 'X_DOT_COM'){
        console.log("getting discord embed");
        embeded = post.getDiscordEmbed();
    }

    console.log(post.videoUrl);


    return {
        embed: post.getDiscordEmbed(),
        videourl: post.videoUrl ?? null,
        provider,
        spoiler,
        needsAttachment,
        attachment,
    };

}


function getPosts(syntax, spoiler = false){
    console.log("getting posts");
    const tweets = [];
    for(const i in syntax){
        const j = syntax[i];
        if(j.type == "url"){
            console.log("is url");
            if(spoiler && parseInt(i) === syntax.length){
                continue;
            }
            tweets.push(getPost(j, spoiler));
            break;
        } else if(j.type == "spoiler"){
            console.log("is spoiled, retrying..");
            tweets.push(...getPosts(j.content, true));
            break;
        }

    }
    console.log("tweets", tweets);
    return tweets;
}

module.exports = { getPosts };