    const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');

const { generateArticleList, generateArticles } = require("../../helpers_crawler")
let source ="Allure"

// node workers
const workDirAllureTrendsList = __dirname+"/dbworkerAllureTrendsList";
const workDirAllureArticles = __dirname+"/dbworkerAllureArticles"
//objects we use to construct new articles /or make db insertions.
let allureTrendsData = [] 
let allureTrendsArticles = []
let allureSkinData = []
let allureSkinArticles = []
const AllureCrawler = async () => {
// Trends
    // const allureTrendsBaseURL = "https://www.allure.com/topic/trends"
    // const allureTrendsNumPages = 5
    // await generateArticleList(
    //     allureTrendsData, 
    //     allureTrendsBaseURL, 
    //     allureTrendsNumPages,
    //     source
    //     ).then(async () => {
    //         await generateArticles(
    //             allureTrendsArticles,
    //             allureTrendsData, //we will loop over and grab links
    //             source
    //         )
    //     }).catch(e => console.log(e))    
        //console.log(allureTrendsArticles)

// Skin
const allureSkinBaseURL = "https://www.allure.com/skin-care"
const allureSkinNumPages = 10
await generateArticleList(
    allureSkinData, 
    allureSkinBaseURL, 
    allureSkinNumPages, 
    source
    )
    // .then(async () => {
    //     await generateArticles(
    //         allureSkinArticles,
    //         allureSkinData, //we will loop over and grab links
    //         source
    //     )
    // }).catch(e => console.log(e))  
    //console.log(allureSkinData) 
// Make

// Hair

// Nails

// Wellness

// Awards

// beauty Box??

    return {allureTrendsData, allureTrendsArticles};
}

// timed crawls
(async function() {   
    for await (const startTime of setInterval(1.728e+8)) {  // 2days 1.728e+8
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
    AllureCrawler() // initialize
    module.exports = AllureCrawler