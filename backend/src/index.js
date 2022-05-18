const app = require("./server");
const { MongoClient } = require("mongodb");
const BeautyDAO = require("./dao/AllureTrendsDAO");
const GlamourDAO = require("./dao/GlamourDAO");
const port = process.env.PORT || 8181;
import { scheduler } from 'timers/promises';
 

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

    // intial load in of crawlers
    const hatchSpider = async() => {
        let Glamour_crawler = require("./services/glamour_crawler/m");
        await scheduler.wait(45000);
        let Allure_crawler = require('./services/allure_crawler/m')
   
    }
    hatchSpider()

