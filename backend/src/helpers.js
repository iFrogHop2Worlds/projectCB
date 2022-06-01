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
      
    }
    //console.log(text)
    text = filterEmptyString(text)
    console.log(text)
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
        if(authors[i+1] == ' and '){
            authors[i] += authors[i+1] + authors[i+2]
            authors[i+1] = ''; 
            authors[i+2] = ''; // flagging index for removal
            i+=2
        }  
    }
    filterEmptyString(authors)
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
    fixMultiAuthor,
    formatArticleTextContent,
    createArticleListObject, 
    createArticleObject, 
}