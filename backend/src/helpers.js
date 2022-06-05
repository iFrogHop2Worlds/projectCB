const axios = require('axios').default;

const filterEmptyString = (array) => {
    array = array.filter(string => {
        if(string != '' && string != '&nbsp;') return true
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
    console.log("gathering resources..");
    return response;
}

/**
 * still making this more robust.. work in progess
 * takes an array of strings which make up titles being 
 * proccessed by the webcrawler and joins them back together
 * @param {[string]} text 
 */   
const fixBrokenJOIN = (text) => {  
   for(let i = 0; i < text.length-1; i++){
        // cases where i += i+1
        if(
            
            text[i].endsWith(' ') || 
            text[i].endsWith("‘") ||
            text[i].endsWith(':') ||
            text[i+1].startsWith(' ') ||
            text[i+1].startsWith(':') ||
            text[i+1].startsWith(',') ||
            text[i].endsWith("’s") ||
            text[i+1].startsWith("’s") || text[i+1].startsWith("’S") ||
            text[i+1].startsWith("'s") || text[i+1].startsWith("'S")
        ){
            if(text[i] == ''){
                text[i-1] += text[i+1]
                text[i+1] = ''
            } else {
                text[i] += text[i+1]
                text[i+1] = ''
            }

        } 
        // cases where i-1 += i
        if(
            
            text[i].startsWith(':') ||
            text[i].startsWith("’:") ||
            text[i].startsWith(")") ||
            text[i].startsWith(' ') ||
            text[i].startsWith("’s") || text[i].startsWith("’S") ||
            text[i].startsWith("'s") || text[i].startsWith("'S") ||
            text[i].startsWith(",") 
            // text[i].startsWith(".")
           
        ){
            if(text[i-1] == ''){
                text[i-2] += text[i]
                text[i] = ''
            // if(text[i-2] == ''){
            //     text[i-3] += text[i]
            //     text[i] = ''
            // }
            // if(text[i-3] == ''){
            //     text[i-4] += text[i]
            //     text[i] = ''
            // } 
            } else {
                text[i-1] += text[i]
                text[i] = ''
            }

        }
        // extreme cases where we need to append across multiple empty elements
        if(text[i-1] == '' && text[i-2].endsWith(' ')){
            text[i-2] += text[i]
            text[i] = ''
        }
        if(text[i-1] == '' && text[i-2] == '' && text[i-3].endsWith(' ')){
            text[i-3] += text[i]
            text[i] = ''
        }
        if(text[i-2] == '' && text[i-3] == '' && text[i].startsWith("’s")){
            text[i-4] += text[i]
            text[i] = ''
        }
        //console.log(text[i])
    }
    //console.log(text)
    text = filterEmptyString(text)
    //console.log(text)
    return text
}

const formatArticleTextContent = (dataObj) => {
    if(dataObj)
    dataObj.forEach(e => {
        for(let i = 2; i < e.content.length; i++){
            e.content[2] += e.content[i];
        }
            //e.content = e.content[0].split(`${e.author}`)  // remove the authors name from begining string
            e.content = e.content[2] ? e.content[2] : e.content[0]; // if author was split return 2nd element otherwise first 
        // I
    });
    return dataObj
}

const fixMultiAuthor = (authors) => {
    for(let i = 0; i < authors.length; i++) {
        //console.log(authors[i]) 
        //  going to take the naive approach for now and just assume there will be at most 3 authors 
        if( authors[i] == ''){
            i++
            return
        } 
        if(
            authors[i].startsWith("Discover") || authors[i].startsWith("Sign") || authors[i].startsWith("View") ||
            authors[i].startsWith("Navigating") || authors[i].startsWith("Milky") || authors[i].startsWith("Acid") ||
            authors[i].startsWith("Pink") || authors[i].startsWith("Kora") || authors[i].startsWith("True") ||
            authors[i].startsWith("CLEAR") || authors[i].startsWith("Holi") || authors[i].startsWith("Agent") ||
            authors[i].startsWith("Herbivore") || authors[i].startsWith("Philosophy") || authors[i].startsWith("Florence") ||
            authors[i].startsWith("CALM") || authors[i].startsWith("Bamboo") || authors[i].startsWith("Function") ||
            authors[i].startsWith("Bliss") || authors[i].startsWith("Trinny") || authors[i].startsWith("BareMinerals") ||
            authors[i].startsWith("Patchology") || authors[i].startsWith("Melē") || authors[i].startsWith("Complete") ||
            authors[i].startsWith("RENEW") || authors[i].startsWith("Navigating") || authors[i].startsWith("Discover") ||
            authors[i].startsWith("$") || authors[i].startsWith("All") || authors[i].match(/[0-9]/) ||  
            authors[i].endsWith("Beauty")             
        ){
            authors[i] = '';
        }
        // check extremes first
        if(
            authors[i+1] == ' and ' && authors[i+1].length > 32 || authors[i+1] == ", " && authors[i+1].length > 32 || authors[i+1] == ", and " && authors[i+1].length > 32 &&
            
            authors[i+3] == ' and '|| authors[i+3] == ", and "
        ){
            authors[i] += authors[i+1] + authors[i+2]  + authors[i+3]  + authors[i+4]
            authors[i+1] = ''; 
            authors[i+2] = '';
            authors[i+3] = ''; 
            authors[i+4] = ''; // flagging index for removal
            i+=4
        } 
        // catches most
        if(
            authors[i+1] == ' and ' || authors[i+1] == ", " || authors[i+1] == ", and "
        ){
            authors[i] += authors[i+1] + authors[i+2]
            authors[i+1] = ''; 
            authors[i+2] = ''; // flagging index for removal
            i+=2
        } 

    }
    
    authors = filterEmptyString(authors)
    console.log(authors)
    return authors
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
    // console.log(titles)
    // console.log(author)
    // console.log(links)
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
const createArticleObject = ( article_content, article_author , title, article_images, source, dataObj) => {
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
    fixMultiAuthor,
    formatArticleTextContent,
    createArticleListObject, 
    createArticleObject, 
}