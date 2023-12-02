hello welcome to my discord re-embed bot everything here is open source and runs primarily making json calls from yt-dlp and gallery-dl
currently supports embeds for links from, tiktok, twitter/x, reddit and pixiv

this is basically my first ever how to readme so shoot me a message if something isnt understood and ill try to answer and update the readme as follows


in the package.json folder youll see all necessary packages that youll need 

since this is a discord bot to run you will need to run it with node.js 
node init and follow the onscreen steps
from there you can go to the discord development portal and make a bot creating the login token that you will then pass into index.js at the very bottom of the code in the 
discord.login('YOUR_LOGIN_TOKEN');


beyond this to get reddit posts to embed reddit implemented a rate limit for applications that are not authenticated to authenticate you need to 


and then input that into the config.json 
"extractor": {
      "reddit": {
        "client-id": "YOUR_CLIENT_ID",
        "user-agent": "Python:YOUR_APP_NAME:v1.0 (by /u/YOUR_USER_NAME)",
        "refresh-token": "YOUR_REFRESH_TOKEN"
      }
    },


twitter embeds will work as normal but tweets with sensitive content or from users with a sensitivity flag on their account will not be embeded normally
fortunately

the bot may not work at this point without first ensuring these steps are complete
there is TwitterBackup.js where we instead need to get around twitter API through rettiwt-api library
to access make sure you have run: 

'npm install rettiwt-api'

as well as:

'npm install retiwt-auth'

inside your terminal.
From there you can simply add this block of code to the top of the twitbackup function within TwitterBackup.js
new Auth().getUserCredential({
    email: 'your email',
    userName: 'your username',
    password: 'your password'
  }).then(credential => {
    const headers = credential.toHeader();
    console.log(headers);
    const twitterAPI = new Twit(headers);
    //while(1){}
})
after running the bot send a sensitive post through discord and it will flag and trigger the auth generating API_TOKEN and cookie inside terminal 
take the string associated to cookie and pass it into
const rettiwt = new Rettiwt({apiKey: 'YOUR_API_KEY'});

YOUR_API_KEY will be the cookie string

after you insert the cookie string[ and be sure you do not share or lose that string] you will be able to remove the new Auth().getUserCredential programming block from above


from here you should be able to now run the bot with no issues.

you can start the bot with terminal command

'node .'
or
'node index.js'


// in progress //
