const app = require("./server");
const { MongoClient } = require("mongodb");
const BeautyDAO = require("./dao/beautyDAO")
const DAO = require("./dbworker");
const port = process.env.PORT || 8181;

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
        //await DAO.injectDB(client);

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })
