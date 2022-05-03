import { Router } from "express";
import BeautyCtrl from "./beautyData.controller";

const router = new Router();

router.route("/").get(BeautyCtrl.apiGetAllProduct) 
router.route("/addItem").post(BeautyCtrl.apiPostProduct)
router.route("/update").put(BeautyCtrl.apiUpdateAllProduct)
router.route("/delete").delete(BeautyCtrl.apiDeleteProduct)

// router.route("/search").get(BeautyCtrl.apiSearchData);
// router.route("/product-type").get(BeautyCtrl.apiGetProdTypeData);
// router.route("/id/:id").get(BeautyCtrl.apiGetProdById);

export default router;