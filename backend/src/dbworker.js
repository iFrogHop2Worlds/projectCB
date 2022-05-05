const BeautyCtrl = require('./api/beautyData.controller');

const { parentPort } = require('node:worker_threads');

try {
    parentPort.once("message",(message) => {

        console.log(`recieved data from main`)
        console.log(message)
        try {
            BeautyCtrl.apiUpdateAllProduct(message)
        } catch (error) {
            console.log(error)
        }
            
    })
    
} catch (error) {
    console.log(error)
}

