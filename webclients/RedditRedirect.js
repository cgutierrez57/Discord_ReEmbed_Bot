const fetch = require("node-fetch");
const RedditClient = require("./RedditClient");


class RedditRedirect {
    async getPost(match) {
      console.log("redirecting");
      const url = match[0];
      
      return fetch(url, {
        headers: {
          "User-Agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.0.0 Safari/537.36',
        },
        redirect: "manual"
      }).then((response) => {
        if (response.status === 301 || response.status === 302) {
          const locationURL = new URL(response.headers.get("location"), response.url);
          console.log("new url ", locationURL.href);
          let masterURL;
          if(locationURL.href.endsWith('&_r=1')){
            masterURL = locationURL.href.replace('&_r=1', '');
          } else{
            masterURL = locationURL.href;
          }
          masterURL = masterURL.split('&')[0];
          console.log("newer url ", masterURL);
          
          return RedditClient.getPost([masterURL]);
        }
      });
    }
  }

  module.exports = new RedditRedirect();