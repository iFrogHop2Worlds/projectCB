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

const formatAllureTrending = (newStr, images, dataObj) => {

    newStr = newStr.filter(string => {
        if( 
            string != '' && 
            string != "</h3>" &&
            string != '<h3 class="SummaryItemHedBase-dZmlME fwPbgz summary-item__hed" data-testid="SummaryItemHed">' &&
            string != "<em>" &&
            string != "</em>"
            ){
         return true
        }
    });

    let i
    for(i = 0; i < newStr.length-1; i++){
        if(newStr[i].endsWith(' ')){
         newStr[i] += newStr[i+1]
         newStr[i+1] = ''
        } 
        if(/^\s/.test(newStr[i+2])){
         newStr[i] += newStr[i+2]
         newStr[i+2] = ''
        }
    }

    newStr = newStr.filter(string => {
     if( string != '' ) return true   
    });   

    for(i = 0; i < newStr.length; i++){
        dataObj[i] = [newStr[i], images[i]]
    }
}

const mainFunc = async () => {
    const iban_url = "https://www.iban.com/exchange-rates";
    const allure_trends_url = "https://www.allure.com/topic/trends"
    let allure_trends = await fetchData(allure_trends_url)
    let iban_res = await fetchData(iban_url);

////////////////IBAN////////////////////////
    if(!iban_res.data){     
      console.log("Invalid data Obj");  //validate we got a correct response.
      return; 
    }
    const iban_html = iban_res.data;  
    const $iban = cheerio.load(iban_html); // mount html page to the root element
    const statsTable = $iban('.table.table-bordered.table-hover.downloads > tbody > tr');
    //loop through all table rows and get table data
    let iban_dataObj = new Object();
    statsTable.each(function() {
        let title = $iban(this).find('td').text(); // get the text in all the td elements
        let newStr = title.split(/\t/); // convert text (string) into an array
        newStr.shift(); // strip off empty array element at index 0
        formatCurrencyData(newStr, iban_dataObj); // format array string and store in an object
    });
////////////////IBAN////////////////////////

////////////////ALLURE-TRENDS///////////////
if(!allure_trends.data){     
    console.log("Invalid data Obj");  
    return; 
}
const allure_html = allure_trends.data;
const $allureTrends = cheerio.load(allure_html);
const allure_trends_articles = $allureTrends(".summary-list__items")
let allureTrendDataObj = new Object();

allure_trends_articles.each(function() {
    const imageLinks = $allureTrends(this)
    .find('.SummaryItemWrapper-gdEuvf')
    .toString().split(/(https[^\s]+\.jpg)/).filter(string => {
        if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bw_640\b)(?=.*?\bjpg\b).*$/)) return true
    })
    //arr.push(imageAttr[7])    /^(?=.*?\bhttps\b)(?=.*?\bw_640\b)(?=.*?\bjpg\b).*$/
    let article_title = $allureTrends(this).find('h3').toString(); // .SummaryItemHedBase-dZmlME
    let title = article_title.split(/(?<=\>)(.*?)(?=\<)/); 
    formatAllureTrending(title, imageLinks,  allureTrendDataObj)
    console.log(imageLinks)
  // console.log(allureTrendDataObj)
});
  
////////////////ALLURE-TRENDS///////////////


    return {iban_dataObj, allureTrendDataObj};
}
  
mainFunc().then(res => {
    // start worker
    const worker = new Worker(workDir);

    console.log("sending crawled data to worker");
    // send formated data to worker
    worker.postMessage(res.allureTrendDataObj);

    // listen to message from worker thread
    worker.on('message', (msg) => {
        console.log(msg)
    });
});