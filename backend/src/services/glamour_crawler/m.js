const axios = require('axios').default;
const cheerio = require('cheerio');
const { attr } = require('cheerio/lib/api/attributes');
const { linkSync } = require('node:fs');
const {Worker} = require('node:worker_threads');

// node workers
const workDirGlamourMakeupList = __dirname+"/dbworkerGlamourMakupList";
// const workDirAllureArticles = __dirname+"/dbworkerAllureArticles"

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


// fix broken titles
const formatGlamour = (articleTitles, imageLinks, author, description, articleLink, glamourMakeupData) => {
    for(let i = 0; i < articleTitles.length-1; i++){
        if(articleTitles[i].endsWith(' ')){
         articleTitles[i] += articleTitles[i+1]
         articleTitles[i+1] = ''
        } 
        if(/^\s/.test(articleTitles[i+2])){
         articleTitles[i] += articleTitles[i+2]
         articleTitles[i+2] = ''
        }
    }

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

    // setting data object to return
    for(let i = 0; i < articleLink.length; i++){
        glamourMakeupData.push(
            {
                title: articleTitles[i] ? articleTitles[i] : "mystery article", 
                description: description[i],
                author: author[i] ? author[i] : "unkown",
                image_url: imageLinks[i],
                articleLink: "https://www.glamourmagazine.co.uk/article/" + articleLink[i]
            })
    }
}

const mainFunc = async () => {
//Glamour magazine
//Makeup
let fixedUrls = []
let glamourMakeupData = [] // an array of objects we insert into the db
const reorganizeURLS = urls => {
    urls.forEach(e => {
        fixedUrls.push(e)
    })
}
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
        let articleLink =  $glamourMakeup(this).find('a').toString().split(/(?<=\href="\/article\/)(.*?)(?=\")/).filter(string => {
            if(string.match(/^((?![<>]).)*$/)) return true 
        });
        articleLink = [...new Set(articleLink)]; // removing duplicate entries
        // short descriptions
        let description = $glamourMakeup(this)
        .find('.BaseWrap-sc-TURhJ').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string != 'By ' && string.match(/^((?![<>]).)*$/)) return true
        });    
        // author names
        let author = $glamourMakeup(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/)
        .filter(string => {
            if(string != 'By ' && string != '' && string.match(/^((?![<>]).)*$/)) return true
        });
        //console.log(author)
        // images
        let imageLinks =  $glamourMakeup(this).find('.SummaryItemWrapper-gdEuvf').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
            if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bphotos\b)(?=.*?\bjpg\b).*$/)) return true // 
        }); 
        // titles    
        let articleTitles = $glamourMakeup(this).find('h3').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
            if(string != '' && string.match(/^((?![<>]).)*$/)) return true
        }); 
        //console.log(articleTitles)
            reorganizeURLS(articleLink)
            formatGlamour(articleTitles, imageLinks, author, description, articleLink, glamourMakeupData);
            console.log(fixedUrls)
    });
}

//Glamour magazine
    // console.log(glamourMakeupData)
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