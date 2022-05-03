import {BeautyDAO, beauty} from "../dao/beautyDAO";
//NOTE: I am pulling the db/collection instance via the beauty variable ^
// I am only doing this because I was having trouble with 
// DAO pattern. Will refactor this l8r
// Is there much benefit from extrapolating the fnction? perhaps so when 
// things get more complicated. 
export default class BeautyController {

    static async apiGetAllProduct(req, res, next) {
        let ans = await beauty
            .find({})
            //.project({product: 1, _id: 0})
            .toArray();
        try {
            res.json(ans)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiPostProduct(req, res, next) {
        try {
            await beauty.insertOne({product: "Fire"}); // make this dynamic.
            res.json({message: "your post was successful"})
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiUpdateAllProduct(req, res, next) {
        // requires a specific document, not an upsert
        try {
            await beauty.update(
                {},
                {$set: {seller: "Billl"}},
            )
        } catch (err) {
            res.status(500).json({error:err})
        }
    }

    static async apiDeleteProduct(req, res, next){
        try{
            await beauty.deleteOne({product: "Fire"})
        } catch (e){
            res.json({message: "still working on it"})
        }
    }

}