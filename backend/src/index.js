const app = require("./server");
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 8181;
const BeautyDAO = require("./dao/AllureTrendsDAO");
const GlamourDAO = require("./dao/GlamourDAO");

const Allure_crawler = require('./services/allure_crawler/m')
//const Glamour_crawler = require("./services/glamour_crawler/m")

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
