const cheerio = require('cheerio');

const { 
    fetchData, 
    fixBrokenJOIN, 
    createArticleListObject,
    fixMultiAuthor, 
    createArticleObject,
    formatArticleTextContent,
} = require('./helpers')

const formatArticlesList = (titles, images, author, descriptions, articleURLs, dataObjects, source) => {
    titles = fixBrokenJOIN(titles)
    descriptions = fixBrokenJOIN(descriptions)
    author = fixMultiAuthor(author)
    createArticleListObject(titles, images, author, descriptions, articleURLs, source, dataObjects)
    console.log("1" + titles)
    console.log("2" + descriptions)
    console.log("3" + articleURLs )
    return dataObjects
} 

const generateArticleList = async (
    dataObjects, 
    baseURL, 
    numberPages, 
    source) => { 
        let titles = []
        let images = []
        let authors = []
        let descriptions = []
        let articleURLs = []
        for(let i = 1; i <= numberPages; i++){  
            const blog_crawl_url = `${baseURL}?page=${i}`; 
            let blog_crawl_res = await fetchData(blog_crawl_url);
            if(!blog_crawl_res.data){     
                console.log("Invalid data Obj");  
                return; 
            }      // section.SummaryRiverSection-knvNOm:nth-child(1) > div:nth-child(1)
            const crawl_html = blog_crawl_res.data;
            const $Q = cheerio.load(crawl_html);
            const blog_articles = $Q("#main-content"); // should maybe paramterize this as target?
            
            blog_articles.each(function() {
                // links to articles
                if(source == "Glamour"){         
                    articleURLs = $Q(this).find('a').toString().split(/(?<=\href="\/article\/)(.*?)(?=\")/).filter(string => {
                        if(string.match(/^((?![<>]).)*$/)) return true 
                    });
                }
                if(source == "Allure"){
                    articleURLs =  $Q(this).find('a').toString().split(/(?<=\href=")(.*?)(?=\")/).filter(string => {
                        if(string.match(/^((?![<>]).)*$/)) return true 
                    });
                }

                articleURLs = [...new Set(articleURLs)]; // removing duplicate entries

                // author names
                authors = $Q(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                    if(string != 'By ' && string != '' && string.match(/^((?![<>]).)*$/)) return true
                });
                
                // images
                images = $Q(this).find('.SummaryItemWrapper-gdEuvf').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                    if(string.match(/^(?=.*?\bhttps\b)(?=.*?\bphotos\b)(?=.*?\bjpg\b).*$/)) return true // 
                }); 

                // titles    
                titles = $Q(this).find('h3').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                    if(string != '' && string.match(/^((?![<>]).)*$/)) return true
                }); 

                // short descriptions
                descriptions = $Q(this)
                    .find('.BaseWrap-sc-TURhJ').toString()
                    .split(/(?<=\>)(.*?)(?=\<)/)
                    .filter(e => {
                        if(e != '' && e != 'By ' && !authors.includes(e) && !e.match('<')) return true
                    })
                  //console.log(articleURLs)

                    formatArticlesList(
                        titles, 
                        images, 
                        authors, 
                        descriptions, 
                        articleURLs, 
                        dataObjects, 
                        source
                    ); 
            });
        }
        console.log(dataObjects)
        return dataObjects
}

const generateArticles = async (dataObjects, articles_list, source) => {
    // setup our web crawl variables
    let $Q
    let blog_article 
    let article_url
    let article_html
    // object values
    let article_title
    let article_author
    let article_content
    let img_urls 

        for(let i = 0; i < articles_list.length; i++) {
            try {
                // we use the link provided our trends list(dataObj)
                article_url = articles_list[i].articleLink;
                // make a get request to the article page
                blog_article = await fetchData(article_url);
                // grab the page data from the response
                article_html = blog_article.data;
                // create our cheerio insatnce variable
                $Q = cheerio.load(article_html); 
                // target the article class
                blog_article = $Q('.article'); //console.log(GlamourArticle)
                // reuse the title property from the list. ensure accuracy and dont repeat work
                article_title = articles_list[i].title;
                // reuse the author property from the list. ensure accuracy and dont repeat work
                article_author = articles_list[i].author;
        
                blog_article.each(function(){ 
                    // grab article images
                    img_urls =  $Q(this).find('img').toString().split(/(https[^\s]+\.jpg)/).filter(string => {
                        if(string.match(/(https[^\s]+\.jpg)/)) return true
                    });
                    // grab text content
                    article_content =  $Q(this).find('p').toString().split(/(?<=\>)(.*?)(?=\<)/).filter(string => {
                        if(string != '' && string.match(/^((?![<>]).)*$/)) return true;
                    })
                    createArticleObject(article_content, article_author , article_title, img_urls, source, dataObjects)
                }); 
            // console.log(GlamourMakeupArticles)     
            } catch (error) {
                console.log(error);
            }
        }
 
        return formatArticleTextContent(dataObjects)
    
}

module.exports = {generateArticleList, generateArticles}

