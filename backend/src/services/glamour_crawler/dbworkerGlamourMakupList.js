const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');

// REFACTOR to use Bulkwrite
try {
    parentPort.once("message", (message) => {
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
        }
    })      
} catch (error) {
    console.log(error + "in parentport try catch")
}  