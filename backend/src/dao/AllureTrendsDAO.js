// import { ObjectId } from "bson";

let AllureTrendsOverview
let AllureTrendsArticles
let MetaDeck
class BeautyDAO {
    
    static async injectDB(conn) {
        if(AllureTrendsOverview) return;
        try{
            MetaDeck = await conn.db("MetaDeck");
            AllureTrendsOverview = await conn.db("MetaDeck").collection("AllureTrendsOverview");
            AllureTrendsArticles = await conn.db("MetaDeck").collection("TrendingArticles");
            console.log("connection to db established")
        } catch (e) {
            console.error(`unable to establish a connection handle in beautyDAO: ${e}`)
        }
    }
    /** 
     * this function is currently just grabbing all data out of the 
     * beauty collection
    */ 
    static async getAllAllureTrends() {
        try {
            let ans = await AllureTrendsOverview
            .find({source: "Allure"})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    }   
    static async getAllAllureArticles() {
        try {
            let ans = await AllureTrendsArticles
            .find({source: "Allure"})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    } 
    // insert all the trending articles from allure (overview) Makes an article list    
    static async insertAllureTrends(listItem) {
        try {
            if(listItem.body.data == undefined)return
            await AllureTrendsOverview.bulkWrite( [
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
    static async insertAllureTrendsArticles(article) {
        try {
            if(article.body.data == undefined)return
            await AllureTrendsArticles.bulkWrite( [
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
  
    static async updateAllBeauty(updates) {
        try {
            await AllureTrendsOverview.update(
                {},
                {$set: {currency: updates}}, //just testing
            )
        } catch (err) {
           console.log(err)
        }
    }

    static async apiDeleteProduct(req, res, next){
        try{
            await AllureTrendsOverview.deleteOne({product: "Fire"})
        } catch (e){
            res.json({message: "still working on it"})
        }
    }
    // 2dos
    // delete property function
    // update single item



}
module.exports = BeautyDAO
