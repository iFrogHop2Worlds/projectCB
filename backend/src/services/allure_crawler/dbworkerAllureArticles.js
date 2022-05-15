const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');

// Saving articles to db
try {
    parentPort.once("message", (message) => {
        console.log(`recieved article data from main`)
       //console.log(message) 
       for(let i = 0; i < message.length; i++) {
            axios.post('http://localhost:5000/Allure/postAllureTrendsArticles', {     // works but want to use bulkwrite
                method: 'post',
                data: message[i]
            }).catch(e => {
                console.log(e)
            })
       }
    })  
} catch (error) {
    console.log(error)
}
  