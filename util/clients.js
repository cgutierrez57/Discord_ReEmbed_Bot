const TwitterClient = require("../webclients/TwitterClient2");
const TikTokClient = require("../webclients/TikTokClient");
const TikTokRedirect = require("../webclients/TikTokRedirect");
const PixivClient = require("../webclients/PixivClient");
const RedditClient = require("../webclients/RedditClient");
const RedditRedirect = require("../webclients/RedditRedirect");

const clients = new Map();

clients.set("TWITTER", TwitterClient);
clients.set("X_DOT_COM", TwitterClient);
clients.set("TIKTOK", TikTokClient);
clients.set("PIXIV", PixivClient);
clients.set("TIKTOK_ALT", TikTokRedirect);
clients.set("REDDIT", RedditClient);
clients.set("REDDIT_ALT", RedditRedirect);

module.exports = clients;