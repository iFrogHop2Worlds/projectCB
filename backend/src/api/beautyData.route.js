const { Router } = require("express");
const BeautyController = require("./beautyData.controller.js");

const router = new Router();

router.route("/").get(BeautyController.apiGetAllProduct) 
router.route("/addItem").post(BeautyController.apiInsertAllureTrends)
router.route("/update").put(BeautyController.apiUpdateAllProduct)
router.route("/delete").delete(BeautyController.apiDeleteProduct)

// router.route("/search").get(BeautyCtrl.apiSearchData);
// router.route("/product-type").get(BeautyCtrl.apiGetProdTypeData);
// router.route("/id/:id").get(BeautyCtrl.apiGetProdById);

module.exports = router;