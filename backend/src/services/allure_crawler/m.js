const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');
const { fetchData, fixBrokenTitlesJOIN, createArticleListObject, createArticleObject } = require('../../helpers')

// node workers
const workDirAllureTrendsList = __dirname+"/dbworkerAllureTrendsList";
const workDirAllureArticles = __dirname+"/dbworkerAllureArticles"
let source ="Allure"
const formatAllureTrending = (articleTitles, images, author, description, articleLink, dataObj) => {
    fixBrokenTitlesJOIN(articleTitles)
    createArticleListObject(articleTitles, images, author, description, articleLink, source, dataObj)
}

const mainFunc = async () => {
/**
 * First we are grabbing all of the trending topics
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
 * Second now that we have all the trending articles we will 
 * use this information to crawl each articles page and grab that information
 * Use titles to cross reference??
 */
let AllureTrendingArticles = [] // the articles data we will return
let article_url
let allureArticles 
let allure_html
let $allureArticle
let article_title
let article_author
let article_content
let img_urls 
for(let i = 0; i < allureTrendDataObj.length; i++){
    try {
    article_url = allureTrendDataObj[i].articleLink;
    allureArticles = await fetchData(article_url);
    allure_html = allureArticles.data;
    $allureArticle = cheerio.load(allure_html);
    allureArticles = $allureArticle('.article');
    allureArticles.each(function(){ 
        article_title = allureTrendDataObj[i].title
        article_author = allureTrendDataObj[i].author
        img_urls =  $allureArticle(this).find('img').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
            if(string.match(/(https[^\s]+\.jpg)/)) return true
        });
        article_content =  $allureArticle(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string.match(/^((?![<>]).)*$/)) return true;
        })
        createArticleObject(article_content,article_author , article_title, img_urls, source, AllureTrendingArticles)
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

    return {allureTrendDataObj, AllureTrendingArticles};
}
   
// initial run initialized in index.js
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
// the crawl loop - updates data in staggered time intervals
const crawlLoop = async () => {
    await setInterval(() => {
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
    },420000)

}
crawlLoop()