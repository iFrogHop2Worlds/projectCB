// import { ObjectId } from "bson";

// const DEFAULT_SEARCH = [["ratings.viewr.numReviews", -1]]

export let beauty
let MetaDeck
export default class BeautyDAO {
    
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

    /*
    for some reason this is not behaving as expected.. Moved logic into the controller. 
    the idea is teh controller calls these functions. But im pulling my db injection above
    into controller and handling in there for now.
    */

    // static async getAll() {
    //     let cursor
    //     try {
    //         cursor = await beauty.find({}).project({product: 1, _id: 0}).toArray()   
    //     return cursor
    //     } catch (e) {
    //         console.error(`Unable to issue find command, ${e}`)
    //         return { results: []}
    //     }
    // }

    // static async postSome() {
    //     try {
    //         await beauty.insertOne({product: "Fire"})
        
    //     } catch (e) {
    //         console.error(`Unable to issue find command, ${e}`)
    //         return { results: []}
    //     }
    // }

    // static async deleteSomething() {
    //     try {
    //         await beauty.deleteOne({product: "Fang Dress"})
    //     } catch (error) {
            
    //     }
    // }
}