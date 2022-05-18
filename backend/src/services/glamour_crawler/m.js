const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');
const { fetchData, fixBrokenTitlesJOIN, createArticleListObject, createArticleObject } = require('../../helpers')
// node workers
const workDirGlamourMakeupList = __dirname+"/dbworkerGlamourMakupList";
// const workDirAllureArticles = __dirname+"/dbworkerAllureArticles"

let glamourMakeupData = [] // an array of objects we insert into the db
let articleLink =  []
let imageLinks = []
let articleTitles = []
let description = []
let author = []

const formatGlamour = (articleTitles, images, author, description, articleLink, glamourMakeupData) => {

    fixBrokenTitlesJOIN(articleTitles)

    //2dp refactor some of this repeated code
    for(let i = 0; i < description.length-1; i++){
        if(description[i].endsWith(' ')){
         description[i] += description[i+1]
         description[i+1] = ''
        } description
        if(/^\s/.test(description[i+2])){
         description[i] += description[i+2]
         description[i+2] = ''
        }
    }
    description = description.filter(string => {
        if(string != '') return true
    })
 
    for(let i = 0; i < author.length; i++) {
        if(author[i+1] == ' and '){
            author[i] += author[i+1] + author[i+2]
            author[i+1] = ''; author[i+2] = ''; // flag element for removal
            i+=2
        }  
    }

    author = author.filter(string => {
        if(string != '') return true
    })
    console.log("links: " + articleLink.length)
    console.log("titles: " + articleTitles.length)
    console.log("authors: " + author.length)
    console.log("desc: " + description.length)
    let source ="Glamour"
    createArticleListObject(articleTitles, images, author, description, articleLink, source, glamourMakeupData)
} 

const mainFunc = async () => {
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

// KEEP this for checking data accuracy
// console.log(articleLink.length)
// console.log(articleTitles.length)
// console.log(author.length)
// console.log(imageLinks.length)
// console.log(glamourMakeupData)
    console.log(glamourMakeupData.length)
    return {glamourMakeupData};
}
mainFunc().then(res => {  
    // worker 1 for articles list
    const worker_GlamourMakeupList = new Worker(workDirGlamourMakeupList);
    console.log("sending crawled data to Article List worker");
    worker_GlamourMakeupList.postMessage(res.glamourMakeupData);
    worker_GlamourMakeupList.on('message', (msg) => {
        console.log(msg);
    });
     // worker 2 articles constructed from article list
    // const worker_AllureArticles = new Worker(workDirAllureArticles);
    // console.log("sending crawled data to Article worker");
    // worker_AllureArticles.postMessage(res.AllureTrendingArticles);
    // worker_AllureArticles.on('message', (msg) => {
    //     console.log(msg);
    // });
})

    // the crawl loop - updates data in staggered time intervals
    const crawlLoop = async () => {
        await setInterval(() => {
            mainFunc().then(res => {
                // worker 1 for articles list
                const worker_GlamourMakeupList = new Worker(workDirGlamourMakeupList);
                console.log("sending crawled data to Article List worker");
                worker_GlamourMakeupList.postMessage(res.glamourMakeupData);
                worker_GlamourMakeupList.on('message', (msg) => {
                    console.log(msg);
                });
                 // worker 2 articles constructed from article list
                // const worker_AllureArticles = new Worker(workDirAllureArticles);
                // console.log("sending crawled data to Article worker");
                // worker_AllureArticles.postMessage(res.AllureTrendingArticles);
                // worker_AllureArticles.on('message', (msg) => {
                //     console.log(msg);
                // });
            })
        },300000) // 3days 2.592e+8


    }
    crawlLoop()
  