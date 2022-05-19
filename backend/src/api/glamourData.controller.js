 const GlamourDAO = require("../dao/GlamourDAO")
 // upgrade queries and add delete functionality
 // low priority but maybe try and generalise some of the functions and share
 // it accross api routes. Low priority since things are still evolving 
 
 class GlamourController {
     // MAKEUP
    static async apiGetAllGlamourMakeupList(req, res, next) {
        const { search, limit } = req.query
        try {
            let queryResult = await GlamourDAO.getGlamourMakeupArticlesList()
            if(search){ 
                queryResult = queryResult.filter( result => {
                    return result.title.startsWith(search)
                })
            }
            if(limit)
                queryResult = queryResult.slice(0, Number(limit))

                res.json(queryResult)
            } catch (err) {
                res.status(500).json({error: err});
            }
    }   

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
                await GlamourDAO.insertGlamourMakeupList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourMakeupArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourMakeupArticles(result); 
        } catch (err) {
            console.log(err);
        }
    } 
    
    // Hair
    static async apiGetAllGlamourHairList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourHairArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }   

    static async apiGetAllGlamourHairArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourHairArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourHairList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourHairList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourHairArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourHairArticles(result); 
        } catch (err) {
            console.log(err);
        }
    } 

    // skin
    static async apiGetAllGlamourSkinList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourSkinArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }   

    static async apiGetAllGlamourSkinArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourSkinArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourSkinList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourSkinList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourSkinArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourSkinArticles(result); 
        } catch (err) {
            console.log(err);
        }
    }

    // fashion
    static async apiGetAllGlamourFashionList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourFashionArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }   apiGetAllAllureArticles

    static async apiGetAllGlamourFashionArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourFashionArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourFashionList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourFashionList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourFashionArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourFashionArticles(result); 
        } catch (err) {
            console.log(err);
        }
    }

    // empowerment
    static async apiGetAllGlamourEmpowermentList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourEmpowermentArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }  

    static async apiGetAllGlamourEmpowermentArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourEmpowermentArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourEmpowermentList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourEmpowermentList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourEmpowermentArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourEmpowermentnArticles(result); 
        } catch (err) {
            console.log(err);
        }
    }

    // entertainment
    static async apiGetAllGlamourEntertainmentList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourEntertainmentArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    } 

    static async apiGetAllGlamourEntertainmentArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourEntertainmentArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourEntertainmentList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourEntertainmentList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourEntertainmentArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourEntertainmentArticles(result); 
        } catch (err) {
            console.log(err);
        }
    }

    // wellbeing
    static async apiGetAllGlamourWellbeingList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourWellbeingArticlesList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }   

    static async apiGetAllGlamourWellbeingArticles(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourWellbeingArticles()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourWellbeingList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourWellbeingList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 
 
    static async apiInsertGlamourWellbeingArticles(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try { 
            await GlamourDAO.insertGlamourWellbeingArticles(result); 
        } catch (err) {
            console.log(err);
        }
    }

    // video
    static async apiGetAllGlamourVideoList(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourVideoList()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }  

    static async apiGetAllGlamourVideos(req, res, next) {
        let result
        try {
            result = await GlamourDAO.getGlamourVideos()
            res.json(result)
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    static async apiInsertGlamourVideoList(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourVideoList(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 

    static async apiInsertGlamourVideo(req, res, next) {
        let result 
        req ? result=req : console.log("Data did not persist properly")
        try {
                await GlamourDAO.insertGlamourVideo(result);
            
        } catch (err) {
            console.log(err);
            console.log("in controller")
        }
    } 


    // discount

 }
 module.exports = GlamourController;