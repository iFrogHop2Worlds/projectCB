const AllureDAO = require("../dao/AllureDAO");

class AllureController {

    static async apiGetAllAllureTrends(req, res, next) {
        let result
        try {
            result = await AllureDAO.getAllAllureTrends()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }   apiGetAllAllureArticles

    static async apiGetAllAllureArticles(req, res, next) {
        let result
        try {
            result = await AllureDAO.getAllAllureArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertAllureTrends(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
            await AllureDAO.insertAllureTrends(result); 
        } catch (err) {
            console.log(err);
        }
    } 

    static async apiInsertAllureTrendsArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await AllureDAO.insertAllureTrendsArticles(result); 
        } catch (err) {
            console.log(err);
        }
    } 
 
    static async apiUpdateAllProduct(req, res, next) {
        try {
            await AllureDAO.updateAllAllure(req)
        } catch (err) {
            res.status(500).json({error:err})
        }
    }

    static async apiDeleteProduct(req, res, next){
        // try{
        //     await beauty.deleteOne({product: "Fire"})
        // } catch (e){
        //     res.json({message: "still working on it"})
        // }
    }

}
module.exports = AllureController