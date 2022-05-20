const expect = require('chai').expect
const GlamourCrawler  = require('../services/glamour_crawler/m')

jest.setTimeout(240000);
test("Should return an object", async () => { 
    const result =  await GlamourCrawler() // seems to keep looping?
    expect(result).to.have.property('glamourMakeupData')
    return 
})