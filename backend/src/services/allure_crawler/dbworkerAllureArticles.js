const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');

// Saving articles to db
try {
    parentPort.once("message", (message) => {
        console.log(`recieved article data from main`)
       //console.log(message) 
        // axios.post('http://localhost:5000/api/v1/postAllureTrendsArticles', {     // works but want to use bulkwrite
        //     method: 'post',
        //     data: message
        // })
    })  
} catch (error) {
    console.log(error)
}
  