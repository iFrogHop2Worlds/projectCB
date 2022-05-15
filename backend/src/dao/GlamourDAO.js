
let MetaDeck
let GlamourMakeupArticleOverviews
let GlamourMakeupArticles
class GlamourDAO {

    static async injectDB(conn) {
        if(GlamourMakeupArticleOverviews) return;
        try{
            MetaDeck = await conn.db("MetaDeck");
            GlamourMakeupArticleOverviews = await conn.db("MetaDeck").collection("MakeupArticleOverviews");
            GlamourMakeupArticles = await conn.db("MetaDeck").collection("MakeupArticles");
            console.log("connection to db established")
        } catch (e) {
            console.error(`unable to establish a connection handle in beautyDAO: ${e}`)
        }
    }

    // returns a list of article items. We used the values to construct and save articles
    static async getGlamourMakeupArticlesList() {
        try {
            let ans = await GlamourMakeupArticleOverviews
            .find({source: "Glamour"})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    }   
    // returns all whole articles from makeup
    static async getGlamourMakeupArticles() {
        try {
            let ans = await GlamourMakeupArticleOverviews
            .find({source: "Glamour"})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    } 
    // ** TODO TODAY - refactor to use bulkwrite
    // insert all the trending articles from allure (overview) Makes an article list    
    static async insertGlamourMakeupList(listItem) {
            console.log("implementing bulkwrite");
            console.log(listItem.body.data); 
            try {
                await GlamourMakeupArticleOverviews.bulkWrite( [
                    { updateOne :
                       {
                          "filter": listItem.body.data,
                          "update": {$set: listItem.body.data},      
                          "upsert": true,
                       }
                    }
                 ] ); 
        } catch (err) {
            console.log(err);
            console.log("in DAO");
        }
    }
 
    // insert all the trending articles from allure articles constructed from the article list    
    static async insertGlamourMakeupArticles(article) {
        try {
            await GlamourMakeupArticles.bulkWrite( [
                { updateOne :
                   {
                      "filter": article.body.data,
                      "update": {$set: article.body.data},      
                      "upsert": true,
                   }
                }
             ] ); 
    } catch (err) {
        console.log(err);
        console.log("in DAO");
    }
    }

    // update 


    // delete
}
module.exports = GlamourDAO;

