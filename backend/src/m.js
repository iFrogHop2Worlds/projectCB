const axios = require('axios').default;
const cheerio = require('cheerio');
const {Worker} = require('node:worker_threads');

const workDir = __dirname+"/dbworker"

const fetchData = async (url) => {
    let response = await axios(url)
        .catch(e => {
            console.log(e)
        });    
    if(response.status !== 200){
        console.error("Error occured while trying to fetch data");
        return;
    }
    console.log("creepy crawlin yo");
    return response;
}

const formatStr = (arr, dataObj) => {
    let reggie = /[^A-Z]*(^|D+)/;
    let newArr = arr[0].split(reggie);
    return dataObj[newArr[0]] = newArr[1];
}

const mainFunc = async () => {
    const url = "https://www.iban.com/exchange-rates";
    // fetch html data from iban website
    let res = await fetchData(url);
    if(!res.data){
      console.log("Invalid data Obj");
      return; 
    }
    const html = res.data;
    // mount html page to the root element
    const $ = cheerio.load(html);
    const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
    //loop through all table rows and get table data
    let dataObj = new Object();
    statsTable.each(function() {
        let title = $(this).find('td').text(); // get the text in all the td elements
        let newStr = title.split(/\t/); // convert text (string) into an array
        newStr.shift(); // strip off empty array element at index 0
        // console.log('1 ' + newStr)
        formatStr(newStr, dataObj); // format array string and store in an object
    });
    return dataObj;
}

mainFunc().then(res => {
    // start worker
    const worker = new Worker(workDir);
    console.log("sending crawled data to worker");
    // send formated data to worker
    worker.postMessage(res);
    // listen to message from worker thread
    worker.on('message', (msg) => {
        console.log(msg)
    });
});