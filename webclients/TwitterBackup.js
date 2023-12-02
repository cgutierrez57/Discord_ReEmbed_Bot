

//could probably use this for every tweet but in fears of twitter seeing the requests and banning account only using for sensitive
const { Auth } = require('rettiwt-auth');//needed this for cookie which is being used as apiKey
const { Rettiwt } = require('rettiwt-api');
const TwitterPostBackup = require('./TwitterPostBackup');

module.exports = async function twitbackup(command) {

  let tweetId = command.split('/')[5];
  
     console.log('tweetID: ', tweetId);
  
    const rettiwt = new Rettiwt({apiKey: 'YOUR_API_KEY'})
    
    const tweetDetails = await rettiwt.tweet.details(tweetId);

    if (tweetDetails) {
        console.log('Tweet Details: ', tweetDetails);
        return new TwitterPostBackup(tweetDetails);

    } else {
        console.log('Tweet details not available.');
    }
    return
    
}
