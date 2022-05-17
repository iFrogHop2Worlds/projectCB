const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');
const { setTimeout: setTimeoutPromise } = require('timers/promises');

const ac = new AbortController();
const signal = ac.signal;
try {
    parentPort.once("message", async (message) => {
        console.log(`recieved article data from main`)
       //console.log(message) 
       for(let i = 0; i < message.length; i++) {
           console.log(message.length)
            axios.post('http://localhost:5000/Allure/postAllureTrendsArticles', {     // works but want to use bulkwrite
                method: 'post',
                data: message[i]
            }).catch(e => {
                console.log(e)
            })
            await setTimeoutPromise(500, 'result', {signal})
            .then(console.log)
            .catch(err => {
                if (err.name === 'AbortError')
                    console.log('The timeout was aborted');
            });
            if(i == message.length)
            ac.abort();
       }
    
       // when the loop finishes we should abort the timer? we keep looping even after the loop params exceeds
    })  
} catch (error) {
    console.log(error)
}
  