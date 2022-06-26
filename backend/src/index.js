const app = require("./server");
const { MongoClient } = require("mongodb");
const BeautyDAO = require("./dao/AllureDAO");
const GlamourDAO = require("./dao/GlamourDAO");
const port = process.env.PORT || 8181;
import { scheduler } from 'timers/promises';
// let GlamourCrawler = require("./services/glamour_crawler/m");
// let AllureCrawler = require('./services/allure_crawler/m')
 
MongoClient.connect(
        process.env.MDECK_DB_URI,
        {
            maxPoolSize: 100, 
            useNewUrlParser: true, 
            writeConcern: {wtimeout:3000}
        },
    )
    .catch( err => {
 
        console.error(err.stack);

        process.exit(1);
    })
    .then(async client => {

        await BeautyDAO.injectDB(client);
        await GlamourDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })

    // causes a network request error. Too many calls if I laod the function once like this
    // should be able to do an initial load in before we dependon intervals which will be hours or days away
    // // intial load in of crawlers
    // const initLoad = async() => {
    //     GlamourCrawler()
    //     await scheduler.wait(45000);
    //     AllureCrawler()
        
    // }
    // initLoad()

    const hatchSpider = async() => {
        //let Glamour_Crawler  = require("./services/glamour_crawler/m");
        let Allure_Crawler = require('./services/allure_crawler/m'); 
    }
    hatchSpider()

