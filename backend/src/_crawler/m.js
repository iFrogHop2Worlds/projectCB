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

const formatAllureTrending = (articleTitles, images, author, description, articleLink, dataObj) => {

    let i
    for(i = 0; i < articleTitles.length-1; i++){
        if(articleTitles[i].endsWith(' ')){
         articleTitles[i] += articleTitles[i+1]
         articleTitles[i+1] = ''
        } 
        if(/^\s/.test(articleTitles[i+2])){
         articleTitles[i] += articleTitles[i+2]
         articleTitles[i+2] = ''
        }
    }

    for(i = 0; i < articleTitles.length; i++){
        dataObj.push(
            {
                title: articleTitles[i], 
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
for(let i = 0; i < 4; i++){
    const allure_trends_url = `https://www.allure.com/topic/trends?page=${i}` 
    let allure_trends = await fetchData(allure_trends_url)

    if(!allure_trends.data){     
    console.log("Invalid data Obj");  
    return; 
    }
    const allure_html = allure_trends.data;
    const $allureTrends = cheerio.load(allure_html);
    const allure_trends_articles = $allureTrends(".summary-list__items");
    
    allure_trends_articles.each(function() {
        // links to articles
        let articleLink =  $allureTrends(this).find('a').toString().split(/(?<=\href=")(.*?)(?=\")/).filter(string => {
            if(string.match(/^((?![<>]).)*$/)) return true  //2do remove duplicate entries
        });
        articleLink = [...new Set(articleLink)]; // removing duplicate entries
        // short descriptions
        let description = $allureTrends(this).find('.BaseWrap-sc-TURhJ').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string != 'By ' && string.match(/^((?![<>]).)*$/)) return true
        });    
        // author names
        let author = $allureTrends(this).find('p').toString().split('</span>').filter(string => {
                if(string != '' && string.match(/^((?![<>]).)*$/)) return true
        });
        // images
        let imageLinks = $allureTrends(this).find('.SummaryItemWrapper-gdEuvf').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bw_640\b)(?=.*?\bjpg\b).*$/)) return true
        });
        // titles    
        let articleTitles = $allureTrends(this).find('h3').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string.match(/^((?![<>]).)*$/)) return true
        }); 
           // console.log(articleTitles)
        formatAllureTrending(articleTitles, imageLinks, author, description, articleLink, allureTrendDataObj);
    });
}
/**
 * Now that we have all the trending articles we will 
 * use this information to crawl each articles page and grab that information
 * Use titles to cross reference??
 */
let AllureTrendingArticles = [] // the articles data we will return
let article_url
let allureArticles 
let allure_html
let $allureArticle

let text = []
for(let i = 0; i < allureTrendDataObj.length; i++){
    try {
    article_url = allureTrendDataObj[i].articleLink;
    allureArticles = await fetchData(article_url);
    allure_html = allureArticles.data;
    $allureArticle = cheerio.load(allure_html);
    allureArticles = $allureArticle('.article')
    allureArticles.each(function(){
        text = $allureArticle(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string.match(/^((?![<>]).)*$/)) return true
        }); 
        console.log(text)
    })
        
    } catch (error) {
        console.log(error)
    }
    
}
console.log(text)
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