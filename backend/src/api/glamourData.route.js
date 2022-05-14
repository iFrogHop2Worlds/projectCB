const { Router } = require("express");
const GlamourController = require("./glamourData.controller");

const router = new Router();

router.route("/getGlamourMakeupList").get(GlamourController.apiGetAllGlamourMakeupList) 
router.route("/getGlamourMakeupArticles").get(GlamourController.apiGetAllGlamourMakeupArticles) 
router.route("/postGlamourMakeupList").post(GlamourController.apiInsertGlamourMakeupList)
router.route("/postGlamourMakeupArticles").post(GlamourController.apiInsertGlamourMakeupArticles)
// router.route("/update").put(GlamourController.apiUpdateAllProduct)
// router.route("/delete").delete(GlamourController.apiDeleteProduct)

// router.route("/search").get(BeautyCtrl.apiSearchData);
// router.route("/product-type").get(BeautyCtrl.apiGetProdTypeData);
// router.route("/id/:id").get(BeautyCtrl.apiGetProdById);

module.exports = router;