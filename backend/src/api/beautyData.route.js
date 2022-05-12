const { Router } = require("express");
const BeautyController = require("./beautyData.controller.js");

const router = new Router();

router.route("/getAllAllureTrends").get(BeautyController.apiGetAllAllureTrends) 
router.route("/getAllAllureArticles").get(BeautyController.apiGetAllAllureArticles) 
router.route("/postAllureTrends").post(BeautyController.apiInsertAllureTrends)
router.route("/postAllureTrendsArticles").post(BeautyController.apiInsertAllureTrendsArticles)
router.route("/update").put(BeautyController.apiUpdateAllProduct)
router.route("/delete").delete(BeautyController.apiDeleteProduct)

// router.route("/search").get(BeautyCtrl.apiSearchData);
// router.route("/product-type").get(BeautyCtrl.apiGetProdTypeData);
// router.route("/id/:id").get(BeautyCtrl.apiGetProdById);

module.exports = router;