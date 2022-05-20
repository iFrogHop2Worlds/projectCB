const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');

const { generateArticleList, generateArticles } = require("../../helpers_crawler")
let source ="Glamour"

// node workers
const workDirGlamourMakeupList = __dirname+"/dbworkerGlamourMakupList";
const workDirGlamourArticles = __dirname+"/dbworkerGlamourArticles"
//Glamour magazine
// Arrays of objects we insert into the db
let glamourMakeupData = [] 
let GlamourMakeupArticles = []
let glamourHairData = [] 

const GlamourCrawler = async () => {
    //Makeup

    let glamourMakeupTitles = []
    let glamourMakeupImages = []
    let glamourMakeuprAuthors = []
    let glamourMakeupDesc = []
    let glamourMakeupArticleURLs = []
    const glamourMakeupBaseURL = "https://www.glamourmagazine.co.uk/topic/makeup"
    const glamourMakeupNumPages = 20
    await generateArticleList(
        glamourMakeupTitles, 
        glamourMakeupImages, 
        glamourMakeuprAuthors, 
        glamourMakeupDesc, 
        glamourMakeupArticleURLs, 
        glamourMakeupData, 
        glamourMakeupBaseURL, 
        glamourMakeupNumPages,
        source
        ).then( () => {
            generateArticles(
                GlamourMakeupArticles,
                glamourMakeupData, //we will loop over and grab links
                source
            )
        }).catch(e => console.log(e))

    // costruct articles 

//Hair
    let glamourHairTitles = []
    let glamourHairImages = []
    let glamourHairAuthors = []
    let glamourHairDesc = []
    let glamourHairArticleURLs = []
    const glamourHairBaseURL = "https://www.glamourmagazine.co.uk/topic/hair"
    const glamourHairNumPages = 20
    await generateArticleList(
        glamourHairTitles, 
        glamourHairImages, 
        glamourHairAuthors, 
        glamourHairDesc, 
        glamourHairArticleURLs, 
        glamourHairData, 
        glamourHairBaseURL, 
        glamourHairNumPages,
        source
        )
    console.log(GlamourMakeupArticles)
    return {glamourMakeupData, GlamourMakeupArticles, glamourHairData};
}

// // timed crawls
(async function() {  
    for await (const startTime of setInterval(2.592e+8)) {  // 3days 2.592e+8 
        // could add some break condition here although
        // the idea this run indefinietly
        GlamourCrawler()
            .then(res => {
                // worker 1 for articles list - NOTE i may at somepoint remove article lists and just keep articles
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

GlamourCrawler()
module.exports = {GlamourCrawler}  