
let MetaDeck
let GlamourMakeup
class GlamourDAO {

    static async injectDB(conn) {
        if(GlamourMakeup) return;
        try{
            MetaDeck = await conn.db("MetaDeck");
            GlamourMakeup = await conn.db("MetaDeck").collection("Makeup");
            // GlamourMakeup = await conn.db("MetaDeck").collection("AllureTrendArticles");
            console.log("connection to db established")
        } catch (e) {
            console.error(`unable to establish a connection handle in beautyDAO: ${e}`)
        }
    }

    // returns a list of article items. We used the values to construct and save articles
    static async getGlamourMakeupArticlesList() {
        try {
            let ans = await GlamourMakeup
            .find({})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    }   
    // returns all whole articles fro makeup
    static async getGlamourMakeupArticles() {
        try {
            let ans = await GlamourMakeup
            .find({})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    } 
    // insert all the trending articles from allure (overview) Makes an article list    
    static async insertGlamourMakeupList(something) {
        try {
            return await GlamourMakeup.insertMany(something.body.data); 
        } catch (err) {
            console.log(err);
        }
    }

    // insert all the trending articles from allure articles constructed from the article list    
    static async insertGlamourMakeupArticles(something) {
        try {
            return await GlamourMakeup.insertMany(something.body.data); 
        } catch (err) {
            console.log(err);
        }
    }

    // update 


    // delete
}
module.exports = GlamourDAO;