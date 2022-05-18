const { Router } = require("express");
const GlamourController = require("./glamourData.controller");

const router = new Router();
// Makeup
router.route("/getGlamourMakeupList").get(GlamourController.apiGetAllGlamourMakeupList) 
router.route("/getGlamourMakeupArticles").get(GlamourController.apiGetAllGlamourMakeupArticles)
router.route("/postGlamourMakeupList").post(GlamourController.apiInsertGlamourMakeupList)
router.route("/postGlamourMakeupArticles").post(GlamourController.apiInsertGlamourMakeupArticles)

// Hair
router.route("/getGlamourHairList").get(GlamourController.apiGetAllGlamourHairList) 
router.route("/getGlamourHairArticles").get(GlamourController.apiGetAllGlamourHairArticles)
router.route("/postGlamourHairList").post(GlamourController.apiInsertGlamourHairList)
router.route("/postGlamourHairArticles").post(GlamourController.apiInsertGlamourHairArticles)

// skin
router.route("/getGlamourSkinList").get(GlamourController.apiGetAllGlamourSkinList) 
router.route("/getGlamourSkinArticles").get(GlamourController.apiGetAllGlamourSkinArticles)
router.route("/postGlamourSkinList").post(GlamourController.apiInsertGlamourSkinList)
router.route("/postGlamourSkinArticles").post(GlamourController.apiInsertGlamourSkinArticles)

// fashion
router.route("/getGlamourFashionList").get(GlamourController.apiGetAllGlamourFashionList) 
router.route("/getGlamourFashionArticles").get(GlamourController.apiGetAllGlamourFashionArticles)
router.route("/postGlamourFashionList").post(GlamourController.apiInsertGlamourFashionList)
router.route("/postGlamourFashionArticles").post(GlamourController.apiInsertGlamourFashionArticles)

// empowerment
router.route("/getGlamourEmpowermentList").get(GlamourController.apiGetAllGlamourEmpowermentList) 
router.route("/getGlamourEmpowermentArticles").get(GlamourController.apiGetAllGlamourEmpowermentArticles)
router.route("/postGlamourEmpowermentList").post(GlamourController.apiInsertGlamourEmpowermentList)
router.route("/postGlamourEmpowermentArticles").post(GlamourController.apiInsertGlamourEmpowermentArticles)

// entertainment
router.route("/getGlamourEntertainmentList").get(GlamourController.apiGetAllGlamourEntertainmentList) 
router.route("/getGlamourEntertainmentArticles").get(GlamourController.apiGetAllGlamourEntertainmentArticles)
router.route("/postGlamourEntertainmentList").post(GlamourController.apiInsertGlamourEntertainmentList)
router.route("/postGlamourEntertainmentArticles").post(GlamourController.apiInsertGlamourEntertainmentArticles)

// wellbeing
router.route("/getGlamourWellbeingList").get(GlamourController.apiGetAllGlamourWellbeingList) 
router.route("/getGlamourWellbeingArticles").get(GlamourController.apiGetAllGlamourWellbeingArticles)
router.route("/postGlamourWellbeingList").post(GlamourController.apiInsertGlamourWellbeingList)
router.route("/postGlamourWellbeingArticles").post(GlamourController.apiInsertGlamourWellbeingArticles)

// video
router.route("/getGlamourVideoList").get(GlamourController.apiGetAllGlamourVideoList) 
router.route("/getGlamourVideos").get(GlamourController.apiGetAllGlamourVideos) 
router.route("/postGlamourVideoList").post(GlamourController.apiInsertGlamourVideoList)
router.route("/postGlamourVideo").post(GlamourController.apiInsertGlamourVideo)

// discount codes TBD



// router.route("/update").put(GlamourController.apiUpdateAllProduct)
// router.route("/delete").delete(GlamourController.apiDeleteProduct)
// router.route("/search").get(BeautyCtrl.apiSearchData);
// router.route("/product-type").get(BeautyCtrl.apiGetProdTypeData);
// router.route("/id/:id").get(BeautyCtrl.apiGetProdById);

module.exports = router;