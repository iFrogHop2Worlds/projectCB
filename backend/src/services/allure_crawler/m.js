const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');
const { fetchData,
    fixBrokenTitlesJOIN,
    createArticleListObject,
    createArticleObject,
    formatArticleTextContent
} = require('../../helpers')
let source ="Allure"

// node workers
const workDirAllureTrendsList = __dirname+"/dbworkerAllureTrendsList";
const workDirAllureArticles = __dirname+"/dbworkerAllureArticles"

const formatAllureTrending = (articleTitles, images, author, description, articleLink, dataObj) => {

    fixBrokenTitlesJOIN(articleTitles)
    createArticleListObject(articleTitles, images, author, description, articleLink, source, dataObj)
}

// The crawler grabs a list of something, then constructs new crawl params from the list to crawl again
// creating new objects with the 2nd crawls data. 
const AllureCrawler = async () => {

    let allureTrendList = [] // an array of objects we insert into the db
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
            formatAllureTrending(articleTitles, imageLinks, author, description, articleLink, allureTrendList);
        });
    }

    // setup our web crawl variables
    let $allureArticle
    let allureArticle 
    let article_url
    let allure_html
    // object values
    let article_title
    let article_author
    let article_content
    let img_urls 
    let AllureTrendingArticles = [] // the articles data we will return

    for(let i = 0; i < allureTrendList.length; i++){
        try {
            // we use the link provided our trends list(dataObj)
            article_url = allureTrendList[i].articleLink;
            // make a get request to the article page
            allureArticle = await fetchData(article_url);
            // grab the page data from the response
            allure_html = allureArticle.data;
            // create our cheerio insatnce variable
            $allureArticle = cheerio.load(allure_html);
            // target the article class
            allureArticle = $allureArticle('.article');
            // reuse the title property from the list. ensure accuracy and dont repeat work
            article_title = allureTrendList[i].title;
            // reuse the author property from the list. ensure accuracy and dont repeat work
            article_author = allureTrendList[i].author;

            allureArticle.each(function(){ 
                // grab article images
                img_urls =  $allureArticle(this).find('img').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                    if(string.match(/(https[^\s]+\.jpg)/)) return true
                });
                // grab text content
                article_content =  $allureArticle(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                    if(string != '' && string.match(/^((?![<>]).)*$/)) return true;
                })
                createArticleObject(article_content,article_author , article_title, img_urls, source, AllureTrendingArticles)
            });      
        } catch (error) {
            console.log(error);
        }
    } 
    // formating article content
    formatArticleTextContent(AllureTrendingArticles)

    // objects constructed after crawling and proccessing data. We pass these over to
    // worker threads to make the requests and save into the db.
    return {allureTrendList, AllureTrendingArticles};
}

// timed crawls
(async function() {   
    for await (const startTime of setInterval(252000)) {  // 2days 1.728e+8
        // could add some break condition here although
        // the idea this run indefinietly
        AllureCrawler()
        .catch(e => {console.log(e)})
        .then(res => {
            // worker for Allure trending articles list
            const worker_AllureTrendsList = new Worker(workDirAllureTrendsList);
            console.log("sending crawled data to Article List worker");
            worker_AllureTrendsList.postMessage(res.allureTrendList);
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
        .catch(e => {console.log(e)})
        
    }
    })();

    module.exports = AllureCrawler