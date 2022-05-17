const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');
const { setTimeout: setTimeoutPromise } = require('timers/promises');

const ac = new AbortController();
const signal = ac.signal;
try {
    parentPort.once("message", async (message) => {
        console.log(`recieved list data from main`)
       //console.log(message) 

        for(let i = 0; i < message.length; i++) {
            axios.post('http://localhost:5000/Glamour/postGlamourMakeupList', {  
                method: 'post',
                data: message[i]
        }).catch(e => {
            console.log(e)
            console.log("in axios request")
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
    })      
} catch (error) {
    console.log(error + "in parentport try catch")
}  