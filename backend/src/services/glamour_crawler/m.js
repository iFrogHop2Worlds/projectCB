const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');
const { 
    fetchData, 
    fixBrokenJOIN, 
    createArticleListObject, 
    createArticleObject,
    formatArticleTextContent,
    filterEmptyString
} = require('../../helpers')

let source ="Glamour"
// node workers
const workDirGlamourMakeupList = __dirname+"/dbworkerGlamourMakupList";
const workDirGlamourArticles = __dirname+"/dbworkerGlamourArticles"

let glamourMakeupData = [] // an array of objects we insert into the db
let articleLink =  []
let imageLinks = []
let articleTitles = []
let description = []
let author = []

const formatGlamour = (articleTitles, images, author, description, articleLink, glamourMakeupData) => {

    fixBrokenJOIN(articleTitles)
    fixBrokenJOIN(description)
    for(let i = 0; i < author.length; i++) {
        if(author[i+1] == ' and '){
            author[i] += author[i+1] + author[i+2]
            author[i+1] = ''; 
            author[i+2] = ''; // flagging index for removal
            i+=2
        }  
    }
    filterEmptyString(author)

    createArticleListObject(articleTitles, images, author, description, articleLink, source, glamourMakeupData)
} 

const GlamourCrawler = async () => {
    //Glamour magazine
    //Makeup
    for(let i = 1; i <= 20; i++){
        const glamour_makeup_url = `https://www.glamourmagazine.co.uk/topic/makeup?page=${i}`; 
        let glamour_makeup = await fetchData(glamour_makeup_url);
        if(!glamour_makeup.data){     
            console.log("Invalid data Obj");  
            return; 
        }
        const glamour_makeup_html = glamour_makeup.data;
        const $glamourMakeup = cheerio.load(glamour_makeup_html);
        const glamour_makeup_articles = $glamourMakeup("section.SummaryRiverSection-knvNOm:nth-child(1) > div:nth-child(1)");
        
        glamour_makeup_articles.each(function() {
            // links to articles
            articleLink = $glamourMakeup(this).find('a').toString().split(/(?<=\href="\/article\/)(.*?)(?=\")/).filter(string => {
                if(string.match(/^((?![<>]).)*$/)) return true 
            });
            articleLink = [...new Set(articleLink)]; // removing duplicate entries

            // author names
            author = $glamourMakeup(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                if(string != 'By ' && string != '' && string.match(/^((?![<>]).)*$/)) return true
            });
            
            // images
            imageLinks =  $glamourMakeup(this).find('.SummaryItemWrapper-gdEuvf').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bphotos\b)(?=.*?\bjpg\b).*$/)) return true // 
            }); 

            // titles    
            articleTitles = $glamourMakeup(this).find('h3').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                if(string != '' && string.match(/^((?![<>]).)*$/)) return true
            }); 

            // short descriptions
            description = $glamourMakeup(this)
                .find('.BaseWrap-sc-TURhJ').toString()
                .split(/(?<=\>)(.*?)(?=\<)/)
                .filter(e => {
                    if(e != '' && e != 'By ' && !author.includes(e) && !e.match('<')) return true
                })
                formatGlamour(articleTitles, imageLinks, author, description, articleLink, glamourMakeupData);
        });
    }
    console.log(glamourMakeupData)
    // setup our web crawl variables
    let $GlamourArticle
    let GlamourArticle 
    let article_url
    let Glamour_html
    // object values
    let article_title
    let article_author
    let article_content
    let img_urls 
    let GlamourMakeupArticles = [] // the articles data we will return
    for(let i = 0; i < glamourMakeupData.length; i++) {
        try {
            // we use the link provided our trends list(dataObj)
            article_url = glamourMakeupData[i].articleLink;
            // make a get request to the article page
            GlamourArticle = await fetchData(article_url);
            // grab the page data from the response
            Glamour_html = GlamourArticle.data;
            // create our cheerio insatnce variable
            $GlamourArticle = cheerio.load(Glamour_html); 
            // target the article class
            GlamourArticle = $GlamourArticle('.article'); //console.log(GlamourArticle)
            // reuse the title property from the list. ensure accuracy and dont repeat work
            article_title = glamourMakeupData[i].title;
            // reuse the author property from the list. ensure accuracy and dont repeat work
            article_author = glamourMakeupData[i].author;

            GlamourArticle.each(function(){ 
                // grab article images
                img_urls =  $GlamourArticle(this).find('img').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                    if(string.match(/(https[^\s]+\.jpg)/)) return true
                });
                // grab text content
                article_content =  $GlamourArticle(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                    if(string != '' && string.match(/^((?![<>]).)*$/)) return true;
                })
                //console.log(article_content)
                createArticleObject(article_content, article_author , article_title, img_urls, source, GlamourMakeupArticles)
            }); 
           // console.log(GlamourMakeupArticles)     
        } catch (error) {
            console.log(error);
        }
    }
    
    formatArticleTextContent(GlamourMakeupArticles)
    // KEEP this for checking data accuracy
    // console.log(articleLink.length)
    // console.log(articleTitles.length)
    // console.log(author.length)
    // console.log(imageLinks.length)
    // console.log(GlamourMakeupArticles)
    // console.log(GlamourMakeupArticles.length)
    //console.log(glamourMakeupData)
    return {glamourMakeupData, GlamourMakeupArticles};
}

// timed crawls
(async function() {  
    for await (const startTime of setInterval(30000)) {  // 3days 2.592e+8 
        // could add some break condition here although
        // the idea this run indefinietly
        GlamourCrawler()
            .then(res => {
                // worker 1 for articles list - NOTE i may at somepoint remove article lists and just keep articles
                // helps for testing though.
                const worker_GlamourMakeupList = new Worker(workDirGlamourMakeupList);
                console.log("sending crawled data to Article List worker");
                worker_GlamourMakeupList.postMessage(res.glamourMakeupData);
                worker_GlamourMakeupList.on('message', (msg) => {
                    console.log(msg);
                });
                return res
            })
            .then(res =>{
                // worker 2 articles
                const worker_GlamourArticles = new Worker(workDirGlamourArticles);
                console.log("sending crawled data to Article worker");
                worker_GlamourArticles.postMessage(res.GlamourMakeupArticles);
                worker_GlamourArticles.on('message', (msg) => {
                    console.log(msg);
                });
            })
            .catch(e => {console.log(e)})
    }
    })();

module.exports = GlamourCrawler