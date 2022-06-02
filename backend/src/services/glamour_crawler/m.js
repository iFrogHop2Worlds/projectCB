const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const {Worker} = require('node:worker_threads');
const { setInterval } = require('timers/promises');

const { generateArticleList, generateArticles } = require("../../helpers_crawler")
let source ="Glamour"

// node workers
const workDirGlamourMakeupList = __dirname+"/dbworkerGlamourMakupList";
const workDirGlamourMakeupArticles = __dirname+"/dbworkerGlamourMakeupArticles";
const workDirGlamourHAirArticles = __dirname+"/dbworkerGlamourHairArticles"
//Glamour magazine
// Arrays of objects we insert into the db
let glamourMakeupData = [] 
let glamourMakeupArticles = []
let glamourHairData = [] 
let glamourHairArticles = []
let glamourSkinData = []
let glamourSkinArticles = []
let glamourFashionData = []
let glamourFashionArticles = []
let glamourEntertainmentData = []
let glamourEntertainmentArticles = []
let glamourEmpowermentData = []
let glamourEmpowermentArticles = []
let glamourWellnessData = []
let glamourWellnessArticles = []
let glamourVideoData = [] 
let glamourVideoArticles = []
let glamourCoupons = []


const GlamourCrawler = async () => {
// //Makeup
//     const glamourMakeupBaseURL = "https://www.glamourmagazine.co.uk/topic/makeup"
//     const glamourMakeupNumPages = 20
//     await generateArticleList(
//         glamourMakeupData, 
//         glamourMakeupBaseURL, 
//         glamourMakeupNumPages,
//         source
//         ).then(async () => {
//             await generateArticles(
//                 glamourMakeupArticles,
//                 glamourMakeupData, //we will loop over and grab links
//                 source
//             )
//         }).catch(e => console.log(e))

// //Hair
//     const glamourHairBaseURL = "https://www.glamourmagazine.co.uk/topic/hair"
//     const glamourHairNumPages = 20
//     await generateArticleList(
//         glamourHairData, 
//         glamourHairBaseURL, 
//         glamourHairNumPages,
//         source
//         ).then(async () => {
//             await generateArticles(
//                 glamourHairArticles,
//                 glamourHairData, //we will loop over details
//                 source
//             )
//         }).catch(e => console.log(e))

// //Skin - *note authors and titles not working here
//     const glamourSkinBaseURL = "https://www.glamourmagazine.co.uk/topic/skin"
//     const glamourSkinNumPages = 20
//     await generateArticleList(
//         glamourSkinData, 
//         glamourSkinBaseURL, 
//         glamourSkinNumPages,
//         source
//         ).then(async () => {
//             await generateArticles(
//                 glamourSkinArticles,
//                 glamourSkinData, //we will loop over details
//                 source
//             )
//         }).catch(e => console.log(e))

// //Fashion
// const glamourFashionBaseURL = "https://www.glamourmagazine.co.uk/topic/fashion"
// const glamourFashionNumPages = 20
// await generateArticleList(
//     glamourFashionData, 
//     glamourFashionBaseURL, 
//     glamourFashionNumPages,
//     source
//     ).then(async () => {
//         await generateArticles(
//             glamourFashionArticles,
//             glamourFashionData, //we will loop over details
//             source
//         )
//     }).catch(e => console.log(e))

// //Empowerment - *note authors and titles not working here
// const glamourEmpowermentBaseURL = "https://www.glamourmagazine.co.uk/topic/empowerment"
// const glamourEmpowermentNumPages = 20
// await generateArticleList(
//     glamourEmpowermentData, 
//     glamourEmpowermentBaseURL, 
//     glamourEmpowermentNumPages,
//     source
//     ).then(async () => {
//         await generateArticles(
//             glamourEmpowermentArticles,
//             glamourEmpowermentData, //we will loop over details
//             source
//         )
//     }).catch(e => console.log(e))
 
//Entertainment 
const glamourEntertainmentBaseURL = "https://www.glamourmagazine.co.uk/topic/entertainment"
const glamourEntertainmentNumPages = 20
await generateArticleList(
    glamourEntertainmentData, 
    glamourEntertainmentBaseURL, 
    glamourEntertainmentNumPages,
    source
    ).then(async () => {
        await generateArticles(
            glamourEntertainmentArticles,
            glamourEntertainmentData, //we will loop over details
            source
        )
    }).catch(e => console.log(e))
    console.log(glamourEntertainmentArticles)
// //Wellness
// const glamourWellnessBaseURL = "https://www.glamourmagazine.co.uk/topic/wellness"
// const glamourWellnessNumPages = 20
// await generateArticleList(
//     glamourWellnessData, 
//     glamourWellnessBaseURL, 
//     glamourWellnessNumPages,
//     source
//     ).then(async () => {
//         await generateArticles(
//             glamourWellnessArticles,
//             glamourWellnessData, //we will loop over details
//             source
//         )
//     }).catch(e => console.log(e))

//Video

//Coupons


// console.log(glamourEntertainmentData)
return {
        glamourMakeupData, 
        glamourMakeupArticles, 
        glamourHairData, 
        glamourHairArticles, 
        glamourSkinData,
        glamourSkinArticles,
        glamourFashionData,
        glamourFashionArticles,
        glamourEmpowermentData,
        glamourEmpowermentArticles,
        glamourEntertainmentData,
        glamourEntertainmentArticles,
        glamourWellnessData,
        glamourWellnessArticles,
    };
}

// timed crawls
(async function() {  
    for await (const startTime of setInterval(2.592e+8)) {  // 3days 2.592e+8 
        // could add some break condition here although
        // the idea this run indefinietly
        GlamourCrawler()
            .then(async (res) => {
                // worker 1 for articles list - NOTE i may at somepoint remove article lists and just keep articles
                const worker_GlamourMakeupList = new Worker(workDirGlamourMakeupList);
                console.log("sending crawled data to Article List worker");
                worker_GlamourMakeupList.postMessage(res.glamourMakeupData);
                worker_GlamourMakeupList.on('message', (msg) => {
                    console.log(msg);
                });
                return res
            })
            .then(async (res) =>{
                // worker 2 articles
                const worker_GlamourArticles = new Worker(workDirGlamourMakeupArticles);
                console.log("sending crawled data to Article worker");
                worker_GlamourArticles.postMessage(res.glamourMakeupArticles);
                worker_GlamourArticles.on('message', (msg) => {
                    console.log(msg);
                });
                return res
            })
            .then(async (res) =>{
                // worker 2 articles
                const worker_GlamourArticles = new Worker(workDirGlamourHAirArticles);
                console.log("sending crawled data to Article worker");
                worker_GlamourArticles.postMessage(res.glamourHairArticles);
                worker_GlamourArticles.on('message', (msg) => {
                    console.log(msg);
                });
            })
            .catch(e => {console.log(e)})
    }
    })();

GlamourCrawler()    // init run / testing
module.exports = {GlamourCrawler}  // jest test