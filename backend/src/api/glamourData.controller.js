 const GlamourDAO = require("../dao/GlamourDAO")
 
 class GlamourController {
    static async apiGetAllGlamourMakeupList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourMakeupArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }   apiGetAllAllureArticles

    static async apiGetAllGlamourMakeupArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourMakeupArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourMakeupList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
            await GlamourDAO.insertGlamourMakeupList(result); // make this dynamic.
        } catch (err) {
            console.log(err);
        }
    } 

    static async apiInsertGlamourMakeupArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourMakeupArticles(result); // make this dynamic.
        } catch (err) {
            console.log(err);
        }
    } 
 

 }
 module.exports = GlamourController;