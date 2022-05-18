const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { fetchData } = require('../../helpers')

const formatCurrencyData = (arr, dataObj) => {
    let key = arr[0].split(' ')
    let symbol
    let value
    if(key.length == 3){
        value = key[2].split(/[A-Za-z]/)
        symbol = key[2].split(/[0-9]/g)
        dataObj[key[0] + '_' + key[1] + '_'+ symbol[0]] = value[value.length - 1] 
    }
    if(key.length == 2){
        value = key[1].split(/[A-Za-z]/)
        symbol = key[1].split(/[0-9]/g)
        dataObj[key[0] + '_' + symbol[0]] = value[value.length - 1]
    }
}

const mainFunc = () => {
const iban_url = "https://www.iban.com/exchange-rates";
let iban_res = await fetchData(iban_url);
    if(!iban_res.data){     
      console.log("Invalid data Obj");  //validate we got a correct response.
      return; 
    }
    const iban_html = iban_res.data;  
    const $iban = cheerio.load(iban_html); 
    const statsTable = $iban('.table.table-bordered.table-hover.downloads > tbody > tr');
    let iban_dataObj = new Object();
    statsTable.each(function() {
        let title = $iban(this).find('td').text(); 
        let newStr = title.split(/\t/); 
        newStr.shift(); 
        formatCurrencyData(newStr, iban_dataObj); 
    });
}

mainFunc()
.then(res => {
    // worker for Allure trending articles list
    const worker_AllureTrendsList = new Worker(workDirAllureTrendsList);
    console.log("sending crawled data to Article List worker");
    worker_AllureTrendsList.postMessage(res.allureTrendDataObj);
    worker_AllureTrendsList.on('message', (msg) => {
        console.log(msg);
    });
    return res
})