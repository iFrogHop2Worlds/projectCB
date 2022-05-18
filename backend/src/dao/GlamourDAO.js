
let MetaDeck
let GlamourMakeupArticleOverviews
let GlamourMakeupArticles
let GlamourHairArticleOverviews
let GlamourHairArticles
let GlamourSkinArticleOverviews
let GlamourSkinArticles
let GlamourFashionArticleOverviews
let GlamourFashionArticles
let GlamourEmpowermentArticleOverviews
let GlamourEmpowermentArticles
let GlamourEntertainmentArticleOverviews
let GlamourEntertainmentArticles
let GlamourWellbeingArticleOverviews
let GlamourWellbeingArticles
let GlamourVideosOverviews
let GlamourVideos
class GlamourDAO {

    static async injectDB(conn) {
        if(GlamourMakeupArticleOverviews) return;
        try{
            MetaDeck = await conn.db("MetaDeck");
            GlamourMakeupArticleOverviews = await conn.db("MetaDeck").collection("MakeupArticleOverviews");
            GlamourMakeupArticles = await conn.db("MetaDeck").collection("MakeupArticles");
            GlamourHairArticleOverviews = await conn.db("MetaDeck").collection("HairArticlesOverviews");
            GlamourHairArticles = await conn.db("MetaDeck").collection("HairArticles");
            GlamourSkinArticleOverviews = await conn.db("MetaDeck").collection("SkinArticlesOverviews");
            GlamourSkinArticles = await conn.db("MetaDeck").collection("SkinArticles");
            GlamourFashionArticleOverviews = await conn.db("MetaDeck").collection("FashionArticlesOverviews")
            GlamourFashionArticles = await conn.db("MetaDeck").collection("FashionArticles")
            GlamourEmpowermentArticleOverviews = await conn.db("MetaDeck").collection("EmpowermentArticlesOverviews")
            GlamourEmpowermentArticles = await conn.db("MetaDeck").collection("EmpowermentArticles")
            GlamourEntertainmentArticleOverviews = await conn.db("MetaDeck").collection("EntertainmentArticleOverviews")
            GlamourEntertainmentArticles = await conn.db("MetaDeck").collection("EntertainmentArticles")
            GlamourWellbeingArticleOverviews = await conn.db("MetaDeck").collection("WellbeingArticleOverviews")
            GlamourWellbeingArticles = await conn.db("MetaDeck").collection("WellbeingArticles")
            GlamourVideosOverviews = await conn.db("MetaDeck").collection("VideosOverviews")
            GlamourVideos = await conn.db("MetaDeck").collection("Videos")
            console.log("connection to db established")
        } catch (e) {
            console.error(`unable to establish a connection handle in beautyDAO: ${e}`)
        }
    }

// MAKEUP
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
            let ans = await GlamourMakeupArticles
            .find({source: "Glamour"})
            .project({})
            .toArray();
            return ans
        } catch (err) {
            console.log(err);
        }
    } 
 
    static async insertGlamourMakeupList(listItem) {
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

// HAIR
static async getGlamourHairArticlesList() {
    try {
        let ans = await GlamourHairArticleOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   
// returns all whole articles from makeup
static async getGlamourHairArticles() {
    try {
        let ans = await GlamourHairArticles
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourHairList(listItem) {
        try {
            await GlamourHairArticleOverviews.bulkWrite( [
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

static async insertGlamourHairArticles(article) {
    try {
        await GlamourHairArticles.bulkWrite( [
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

// deleteHair

// SKIN
static async getGlamourSkinArticlesList() {
    try {
        let ans = await GlamourSkinArticleOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   

static async getGlamourSkinArticles() {
    try {
        let ans = await GlamourSkinArticles
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourSkinList(listItem) {
        try {
            await GlamourSkinArticleOverviews.bulkWrite( [
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

static async insertGlamourSkinArticles(article) {
    try {
        await GlamourSkinArticles.bulkWrite( [
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

// FASHION
static async getGlamourFashionArticlesList() {
    try {
        let ans = await GlamourFashionArticleOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   

static async getGlamourFashionArticles() {
    try {
        let ans = await GlamourFashionArticles
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourFashionList(listItem) {
        try {
            await GlamourFashionArticleOverviews.bulkWrite( [
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

static async insertGlamourFashionArticles(article) {
    try {
        await GlamourFashionArticles.bulkWrite( [
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

// EMPOWERMENT
static async getGlamourEmpowermentArticlesList() {
    try {
        let ans = await GlamourEmpowermentArticleOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   

static async getGlamourEmpowermentArticles() {
    try {
        let ans = await GlamourEmpowermentArticles
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourEmpowermentList(listItem) {
        try {
            await GlamourEmpowermentArticleOverviews.bulkWrite( [
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

static async insertGlamourEmpowermentArticles(article) {
    try {
        await GlamourEmpowermentArticles.bulkWrite( [
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

// ENTERTAINMENT
static async getGlamourEntertainmentArticlesList() {
    try {
        let ans = await GlamourEntertainmentArticleOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   

static async getGlamourEntertainmentArticles() {
    try {
        let ans = await GlamourEntertainmentArticles
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourEntertainmentList(listItem) {
        try {
            await GlamourEntertainmentArticleOverviews.bulkWrite( [
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

static async insertGlamourEntertainmentArticles(article) {
    try {
        await GlamourEntertainmentArticles.bulkWrite( [
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

// WELLBEING
static async getGlamourWellbeingArticlesList() {
    try {
        let ans = await GlamourWellbeingArticleOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   

static async getGlamourWellbeingArticles() {
    try {
        let ans = await GlamourWellbeingArticles
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourWellbeingList(listItem) {
        try {
            await GlamourWellbeingArticleOverviews.bulkWrite( [
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

static async insertGlamourWellbeingArticles(article) {
    try {
        await GlamourWellbeingArticles.bulkWrite( [
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

// VIDEO
static async apiGetAllGlamourVideoList() {
    try {
        let ans = await GlamourVideosOverviews
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
}   

static async apiGetAllGlamourVideos() {
    try {
        let ans = await GlamourVideos
        .find({source: "Glamour"})
        .project({})
        .toArray();
        return ans
    } catch (err) {
        console.log(err);
    }
} 

static async insertGlamourVideoList(listItem) {
    try {
        await GlamourVideosOverviews.bulkWrite( [
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

static async insertGlamourVideo(listItem) {
        try {
            await GlamourVideos.bulkWrite( [
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

// Update

// Delete

}
module.exports = GlamourDAO;

