const axios = require('axios').default;
const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
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

const formatAllureTrending = (newStr, images, author, description, articleLink, dataObj) => {

    newStr = newStr.filter(string => {
        if(  // prob refactor to use a match 
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
        dataObj.push(
            {
                title: newStr[i], 
                description: description[i],
                author: author[i],
                image_url: images[i],
                articleLink: "https://www.allure.com" + articleLink[i]
            })
    }
}

const mainFunc = async () => {
////////////////IBAN////////////////////////
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
////////////////IBAN////////////////////////

////////////////ALLURE-TRENDS///////////////
/**
 * here we are grabbing all of the trending topics
 * from allure and formatting the data to be consumed directly 
 * and ran through data pipeline for analysis data etc
 */
let allureTrendDataObj = [] // an array of objects we insert into the db
for(let i = 0; i < 3; i++){
    const allure_trends_url = `https://www.allure.com/topic/trends?page=${i}` 
    let allure_trends = await fetchData(allure_trends_url)

    if(!allure_trends.data){     
    console.log("Invalid data Obj");  
    return; 
    }
    const allure_html = allure_trends.data;
    const $allureTrends = cheerio.load(allure_html);
    const allure_trends_articles = $allureTrends(".summary-list__items")
    
    allure_trends_articles.each(function() {
        // base link https://www.allure.com/story/ + href we extract
        let articleLink =  $allureTrends(this).find('a').toString().split(/(?<=\href=")(.*?)(?=\")/).filter(string => {
            if(string.match(/^((?![<>]).)*$/)) return true  //2do remove duplicate entries
        })
        articleLink = [...new Set(articleLink)]; // removing duplicate entries
          console.log(articleLink) 
        let description = $allureTrends(this).find('.BaseWrap-sc-TURhJ')
        .toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string != 'By ' && string.match(/^((?![<>]).)*$/)) return true
        })    

        let author = $allureTrends(this)
            .find('p')
            .toString().split('</span>').filter(string => {
                if(string != '' && string.match(/^((?![<>]).)*$/)) return true
            })

        const imageLinks = $allureTrends(this)
            .find('.SummaryItemWrapper-gdEuvf')
            .toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bw_640\b)(?=.*?\bjpg\b).*$/)) return true
            })

        let article_title = $allureTrends(this).find('h3').toString(); 
        let title = article_title.split(/(?<=\>)(.*?)(?=\<)/); 

        formatAllureTrending(title, imageLinks, author, description, articleLink, allureTrendDataObj)
    });
}
////////////////ALLURE-TRENDS///////////////


    return {allureTrendDataObj, iban_dataObj};
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
})  // thinking of chaining my individual article crawl here. as it wil be dependent on the first overview crawl to extract the article links