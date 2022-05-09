const BeautyCtrl = require('../api/beautyData.controller');
const axios = require('axios').default;
const { parentPort } = require('node:worker_threads');

try {
    parentPort.once("message", (message) => {
        console.log(`recieved data from main`)
        console.log(message)
    //     axios.post('http://localhost:5000/api/v1/addItem', {     // commented out so I dont keep posting data
    //         method: 'post',
    //         data: message
    // })
    //     .catch(e => {console.log(e)})
    })  
} catch (error) {
    console.log(error)
}

  