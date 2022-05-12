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
            AllureTrendsArticles = await conn.db("MetaDeck").collection("AllureTrendArticles");
            console.log("connection to db established")
        } catch (e) {
            console.error(`unable to establish a connection handle in beautyDAO: ${e}`)
        }
    }
    /** 
     * this function is currently just grabbing all data out of the 
     * beauty collection
    */
    static async getAllBeauty() {
        try {
            let ans = await AllureTrendsOverview
            .find({})
            .project({product: 1, _id: 0})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    }
    // insert all the trending articles from allure (overview) Makes an article list    
    static async insertAllureTrends(something) {
        try {
            return await AllureTrendsOverview.insertMany(something.body.data); 
        } catch (err) {
            console.log(err);
        }
    }

    // insert all the trending articles from allure articles constructed from the article list    
    static async insertAllureTrendsArticles(something) {
        try {
            return await AllureTrendsArticles.insertMany(something.body.data); 
        } catch (err) {
            console.log(err);
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
