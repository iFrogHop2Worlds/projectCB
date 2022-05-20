const cheerio = require('cheerio');

const { 
    fetchData, 
    fixBrokenJOIN, 
    createArticleListObject,
    fixMultiAuthor, 
    filterEmptyString,
    createArticleObject,
    formatArticleTextContent,
} = require('./helpers')

const formatGlamour = (articleTitles, images, author, description, articleLink, dataObjects, source) => {
    fixBrokenJOIN(articleTitles)
    fixBrokenJOIN(description)
    fixMultiAuthor(author)
    filterEmptyString(author)
    createArticleListObject(articleTitles, images, author, description, articleLink, source, dataObjects)
    return dataObjects
} 

const generateArticleList = async (
    titles, 
    images, 
    authors, 
    descriptions, 
    articleURLs, 
    dataObjects, 
    baseURL, 
    numberPages, 
    source) => { 
    for(let i = 1; i <= numberPages; i++){  
        const glamour_makeup_url = `${baseURL}?page=${i}`; 
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
            articleURLs = $glamourMakeup(this).find('a').toString().split(/(?<=\href="\/article\/)(.*?)(?=\")/).filter(string => {
                if(string.match(/^((?![<>]).)*$/)) return true 
            });
            articleURLs = [...new Set(articleURLs)]; // removing duplicate entries

            // author names
            authors = $glamourMakeup(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                if(string != 'By ' && string != '' && string.match(/^((?![<>]).)*$/)) return true
            });
            
            // images
            images = $glamourMakeup(this).find('.SummaryItemWrapper-gdEuvf').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bphotos\b)(?=.*?\bjpg\b).*$/)) return true // 
            }); 

            // titles    
            titles = $glamourMakeup(this).find('h3').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                if(string != '' && string.match(/^((?![<>]).)*$/)) return true
            }); 

            // short descriptions
            descriptions = $glamourMakeup(this)
                .find('.BaseWrap-sc-TURhJ').toString()
                .split(/(?<=\>)(.*?)(?=\<)/)
                .filter(e => {
                    if(e != '' && e != 'By ' && !authors.includes(e) && !e.match('<')) return true
                })
                formatGlamour(titles, images, authors, descriptions, articleURLs, dataObjects, source);
                return dataObjects
        });
    }
}

const generateArticles = async (GlamourMakeupArticles, articles_list, source) => {
    // setup our web crawl variables
    let Query
    let GlamourArticle 
    let article_url
    let Glamour_html
    // object values
    let article_title
    let article_author
    let article_content
    let img_urls 
    console.log("inside generator b4 loops")
        for(let i = 0; i < articles_list.length; i++) {
            try {
                // we use the link provided our trends list(dataObj)
                article_url = articles_list[i].articleLink;
                // make a get request to the article page
                GlamourArticle = await fetchData(article_url);
                // grab the page data from the response
                Glamour_html = GlamourArticle.data;
                // create our cheerio insatnce variable
                Query = cheerio.load(Glamour_html); 
                // target the article class
                GlamourArticle = Query('.article'); //console.log(GlamourArticle)
                // reuse the title property from the list. ensure accuracy and dont repeat work
                article_title = articles_list[i].title;
                // reuse the author property from the list. ensure accuracy and dont repeat work
                article_author = articles_list[i].author;
        
                GlamourArticle.each(function(){ 
                    // grab article images
                    img_urls =  Query(this).find('img').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                        if(string.match(/(https[^\s]+\.jpg)/)) return true
                    });
                    // grab text content
                    article_content =  Query(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                        if(string != '' && string.match(/^((?![<>]).)*$/)) return true;
                    })
                    createArticleObject(article_content, article_author , article_title, img_urls, source, GlamourMakeupArticles)
                }); 
            // console.log(GlamourMakeupArticles)     
            } catch (error) {
                console.log(error);
            }
        }
        formatArticleTextContent(GlamourMakeupArticles)
    
}

module.exports = {generateArticleList, generateArticles}

