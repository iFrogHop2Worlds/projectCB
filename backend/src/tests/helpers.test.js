const expect = require('chai').expect

const { 
    fetchData, 
    fixBrokenJOIN, 
    createArticleListObject, 
    createArticleObject,
    formatArticleTextContent,
    filterEmptyString
} = require('../helpers')


let emptyArr = [1, '', 2, '', 3]
test("Should remove empty elements from array", () => {
    let res = filterEmptyString(emptyArr)
    expect(res).to.eql([1,2,3])
})

let broken = ["How ", "are", " you"]
test("should return an array", () => {
    let result = fixBrokenJOIN(broken)
    expect(result).to.be.an("array")
})

test("should append an array of stirings elemtns end/start with ' '", () => {
    let result = fixBrokenJOIN(broken)
    expect(result[0]).to.equal("How are you")
})

let articleText = [{content : ["I like where", ' ', "this is going"]}]
test("should append a long array of text", () => {
    let articletext = formatArticleTextContent(articleText)
    expect(articletext[0].content).to.equal("I like where this is going")
})