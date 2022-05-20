const expect = require('chai').expect

const { 
    fetchData, 
    fixBrokenJOIN, 
    formatArticleTextContent,
    filterEmptyString,
    createArticleListObject, 
    createArticleObject,
} = require('../helpers')

test("Should return back an axios http response", async () => {
    let result = await fetchData("https://www.npmjs.com/package/react-adsense")
    jest.setTimeout(9500);
    expect(result.status).to.eq(200)
    expect(result.headers.server).to.eq('cloudflare')
})

test("Should remove empty elements from array", () => {
    let emptyArr = [1, '', 2, '', 3]
    let res = filterEmptyString(emptyArr)
    expect(res).to.eql([1,2,3])
})

test("should return an array with result at idx 0", () => {
    let broken = ["How ", "are", " you"]
    let result = fixBrokenJOIN(broken)
    expect(result).to.be.an("array")
    expect(result[0]).to.equal("How are you")
})


test("should append a long array of text", () => {
    let articleText = [{content : ["I like where", ' ', "this is going"]}]
    articleText = formatArticleTextContent(articleText)
    expect(articleText[0].content).to.equal("I like where this is going")
})

test("should take values and construct objects", () => {
    let titles = ["1", "2", "3"] 
    let images= ["someImageURL", "someImageURL" , "someImageURL"]
    let author= ["Ana", "Sabrina", "Telos"]
    let description= ["yt3r", "fergss", "fwfw"]
    let links = ['/jiberjugger/news', '/rugerbuugger/abc', '/lindoor/lates']
    let source = "Allure"
    let dataObjects = []
    createArticleListObject(titles, images, author, description, links, source, dataObjects)
    expect(dataObjects).to.be.a("array")
    expect(dataObjects).to.have.lengthOf(3)
    expect(dataObjects[2].articleLink).to.be.eq("https://www.allure.com/lindoor/lates")
})