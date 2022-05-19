const axios = require('axios').default;

/**
 * Makes a get request to specified url
 * @param {string} url 
 */
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

/**
 * takes an array of strings which make up titles being 
 * proccessed by the webcrawler and joins them back together
 * @param {[string]} titles 
 */
const fixBrokenTitlesJOIN = (titles) => {
    for(let i = 0; i < titles.length-1; i++){
        if(titles[i].endsWith(' ')){
         titles[i] += titles[i+1]
         titles[i+1] = ''
        } 
        if(/^\s/.test(titles[i+2])){
         titles[i] += titles[i+2]
         titles[i+2] = ''
        }
    }
}

const formatArticleTextContent = (dataObj) => {
    dataObj.forEach(e => {
        for(let i = 0; i < e.content.length; i++){
            e.content[0] += e.content[i];
        }
        e.content = e.content[0]; // content = newly appended content string
        e.content = e.content.split(`${e.author}`)  // remove the authors name from begining string
        e.content = e.content[1] ? e.content[1] : e.content[0]; // if author was split return 2nd element otherwise first 
    });
}

/**
 * Takes arrays of data and creates new objects 
 * @param {[string]} titles 
 * @param {[string]} images 
 * @param {[string]} author 
 * @param {[string]} description 
 * @param {[string]} links 
 * @param {string} source 
 * @param {[{}]} dataObj 
 */
const createArticleListObject = (titles, images, author, description, links, source, dataObj) => {
    for(let i = 0; i < links.length; i++){
        dataObj.push(
            {
                title: titles[i] ? titles[i] : "mystery article", 
                description: description[i],
                author: author[i] ? author[i] : "unkown",
                image_url: images[i],
                articleLink: "https://www.allure.com" + links[i],
                source: source
            })
    }
}

/**
 * Takes arrays of data and creates new objects 
 * @param {[string]} title
 * @param {[string]} images 
 * @param {[string]} author 
 * @param {[string]} description 
 * @param {[string]} links 
 * @param {string} source 
 * @param {[{}]} dataObj 
 */
const createArticleObject = ( article_content,article_author , title, article_images, source, dataObj) => {
    dataObj.push({
        content: article_content ? article_content : "nothing to show",
         title: title ? title : "mystery article",
         author: article_author ? article_author : "unkown",
         images: article_images ?  article_images : [] ,
         source: source
    }); 
}

module.exports = {fetchData, fixBrokenTitlesJOIN, createArticleListObject, createArticleObject, formatArticleTextContent}