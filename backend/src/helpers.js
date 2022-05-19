const axios = require('axios').default;

const filterEmptyString = (array) => {
    array = array.filter(string => {
        if(string != '') return true
    })
    return array
}

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
    //console.log("gathering resources..");
    return response;
}

/**
 * takes an array of strings which make up titles being 
 * proccessed by the webcrawler and joins them back together
 * @param {[string]} text 
 */
const fixBrokenJOIN = (text) => { 
    for(let i = 0; i < text.length-1; i++){
        if(text[i].endsWith(' ')){
         text[i] += text[i+1]
         text[i+1] = ''
        } 
        if(/^\s/.test(text[i+2])){
         text[i] += text[i+2]
         text[i+2] = ''
        }
        
    }
    
    return text
}

const formatArticleTextContent = (dataObj) => {
    if(dataObj)
    dataObj.forEach(e => {
        for(let i = 1; i < e.content.length; i++){
            e.content[0] += e.content[i];
        }
        e.content = e.content[0]; // content = newly appended content string
        // check if we missed author
        if(e.author){
            e.content = e.content.split(`${e.author}`)  // remove the authors name from begining string
            e.content = e.content[1] ? e.content[1] : e.content[0]; // if author was split return 2nd element otherwise first 
        }    
    });
    return dataObj
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
        let baseUrl;
        if(source == "Allure"){
            baseUrl = "https://www.allure.com"
        }
        if(source == "Glamour"){
            baseUrl = "https://www.glamourmagazine.co.uk/article/"
        }
        dataObj.push(
            {
                title: titles[i] ? titles[i] : "mystery article", 
                description: description[i],
                author: author[i] ? author[i] : "unkown",
                image_url: images[i],
                articleLink: baseUrl + links[i],
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

module.exports = {
    fetchData, 
    filterEmptyString, 
    fixBrokenJOIN, 
    createArticleListObject, 
    createArticleObject, 
    formatArticleTextContent
}