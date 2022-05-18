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

const createArticleListObject = (articleTitles, images, author, description, articleLink, source, dataObj) => {
    for(let i = 0; i < articleLink.length; i++){
        dataObj.push(
            {
                title: articleTitles[i] ? articleTitles[i] : "mystery article", 
                description: description[i],
                author: author[i] ? author[i] : "unkown",
                image_url: images[i],
                articleLink: "https://www.allure.com" + articleLink[i],
                source: source
            })
    }
}

const createArticleObject = () => {

}

module.exports = {fetchData, fixBrokenTitlesJOIN, createArticleListObject, createArticleObject}