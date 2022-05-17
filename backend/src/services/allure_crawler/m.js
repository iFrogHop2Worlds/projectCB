const axios = require('axios').default;
const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');

// node workers
const workDirAllureTrendsList = __dirname+"/dbworkerAllureTrendsList";
const workDirAllureArticles = __dirname+"/dbworkerAllureArticles"

const fetchData = async (url) => {
    let response = await axios(url)
        .catch(e => {
            console.log(e)
        });    
    if(response.status !== 200){
        console.error("Error occured while trying to fetch data");
        return;
    }
    console.log("gathering resources..");
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

    for(i = 0; i < articleLink.length; i++){
        dataObj.push(
            {
                title: articleTitles[i] ? articleTitles[i] : "mystery article", 
                description: description[i],
                author: author[i] ? author[i] : "unkown",
                image_url: images[i],
                articleLink: "https://www.allure.com" + articleLink[i],
                source: "Allures"
            })
    }
}
// move this into new crawler.
const mainFunc = async () => {
//IBAN
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
//IBAN

/**
 * here we are grabbing all of the trending topics
 * from allure and formatting the data to be consumed directly 
 * and ran through data pipeline for analysis data etc
 */
let allureTrendDataObj = [] // an array of objects we insert into the db
for(let i = 1; i <= 4; i++){
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
        console.log(author)
        // images
        let imageLinks =  $allureTrends(this).find('.SummaryItemWrapper-gdEuvf').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bphotos\b)(?=.*?\bjpg\b).*$/)) return true // 
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
let img_urls 

for(let i = 0; i < allureTrendDataObj.length; i++){
    try {
    article_url = allureTrendDataObj[i].articleLink;
    allureArticles = await fetchData(article_url);
    allure_html = allureArticles.data;
    $allureArticle = cheerio.load(allure_html);
    allureArticles = $allureArticle('.article');
    allureArticles.each(function(){ //2do note; refactor rgex we are reusing into functions
        img_urls =  $allureArticle(this).find('img').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
            if(string.match(/(https[^\s]+\.jpg)/)) return true
        });
        //console.log(img_urls)
        AllureTrendingArticles.push({
            content: $allureArticle(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                    if(string != '' && string.match(/^((?![<>]).)*$/)) return true;
                }),
             title: allureTrendDataObj[i].title ? allureTrendDataObj[i].title : "mystery article",
             author: allureTrendDataObj[i].author ? allureTrendDataObj[i].author : "unkown",
             images: img_urls ?  img_urls : [] ,
             source: "Allure"
        }); 
    });      
    } catch (error) {
        console.log(error);
    }
}

AllureTrendingArticles.forEach(e => {
    for(let i = 0; i < e.content.length; i++){
        e.content[0] += e.content[i];
    }
    e.content = e.content[0];
    e.content = e.content.split(`${e.author}`)  
    e.content = e.content[1] ? e.content[1] : e.content[0];
});

    return {allureTrendDataObj, AllureTrendingArticles, iban_dataObj};
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
.then(res =>{
    // worker for Allure articles constructed from article list
    const worker_AllureArticles = new Worker(workDirAllureArticles);
    console.log("sending crawled data to Article worker");
    worker_AllureArticles.postMessage(res.AllureTrendingArticles);
    worker_AllureArticles.on('message', (msg) => {
        console.log(msg);
    });
})  
/**
 * So atm I have two crawlers, growing in complexity and to help spread the load
 * I want to start each crawler after another and stager their runtimes such they
 * never run at the same time. 
 * ATM my crawlers are loading at the same time when I import them into my index file. 
 * How can I do this better?
 * 
 * I was thinking wrapping my main functions in each crawler and setting their intervals
 * such that they never run at the same time.. but this seem half ok. if the crawler engine
 * becomes 10, 20 or more crawlers this maybe tedius?? 
 * 
 * conditional imports? somethingTime -> imports? 
 */