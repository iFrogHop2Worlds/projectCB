const { Router } = require("express");
const AllureController = require("./allureData.controller.js");

const router = new Router();

router.route("/getAllAllureTrends").get(AllureController.apiGetAllAllureTrends) 
router.route("/getAllAllureArticles").get(AllureController.apiGetAllAllureArticles) 
router.route("/postAllureTrends").post(AllureController.apiInsertAllureTrends)
router.route("/postAllureTrendsArticles").post(AllureController.apiInsertAllureTrendsArticles)
router.route("/update").put(AllureController.apiUpdateAllProduct)
router.route("/delete").delete(AllureController.apiDeleteProduct)

// router.route("/search").get(BeautyCtrl.apiSearchData);
// router.route("/product-type").get(BeautyCtrl.apiGetProdTypeData);
// router.route("/id/:id").get(BeautyCtrl.apiGetProdById);

module.exports = router;