// import { ObjectId } from "bson";

let beauty
let MetaDeck
class BeautyDAO {
    
    static async injectDB(conn) {
        if(beauty) return;
        try{
            MetaDeck = await conn.db("MetaDeck");
            beauty = await conn.db("MetaDeck").collection("beauty");
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
            let ans = await beauty
            .find({})
            .project({product: 1, _id: 0})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    }
          
    static async post2Beauty(something) {
        try {
            return await beauty.insert(something.body.data); 
        } catch (err) {
            console.log(err);
        }
    }
  
    static async updateAllBeauty(updates) {
        try {
            await beauty.update(
                {},
                {$set: {currency: updates}}, //just testing
            )
        } catch (err) {
           console.log(err)
        }
    }

    static async apiDeleteProduct(req, res, next){
        try{
            await beauty.deleteOne({product: "Fire"})
        } catch (e){
            res.json({message: "still working on it"})
        }
    }
    // 2dos
    // delete property function
    // update single item



}
module.exports = BeautyDAO
