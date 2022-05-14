const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');

// REFACTOR to use Bulkwrite
try {
    parentPort.once("message", (message) => {
        console.log(`recieved list data from main`)
       console.log(message) 
        axios.post('http://localhost:5000/Glamour/postGlamourMakeupList', {  
            method: 'post',
            data: message
    }).catch(e => console.log(e))
    })  
} catch (error) {
    console.log(error)
}