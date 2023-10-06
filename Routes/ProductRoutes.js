import  express  from "express";
import { isAdmin, requireSignIn } from "../Middlewares/AuthMiddlewares.js";
import {  brainTreePaymentController, braintreeTokenController, createProductControler, getProductControler, getSingleProductControler, productCategoryController, productCountController, productDeleteControler, productFiltersController, productListController, productPhotoControler, realtedProductController, searchProducdtController, updateProductControler } from "../Controller/ProductControler.js";
import formidable from 'express-formidable'

const router =express.Router()
//routes
router.post('/create-product', requireSignIn, isAdmin,formidable(), createProductControler)

//update product
router.put("/update-product/:pid", requireSignIn, isAdmin,formidable(), updateProductControler)

//get all product
router.get("/get-product", getProductControler)

//single product
router.get('/get-single-product/:slug',getSingleProductControler)

//get product photo
router.get('/product-photo/:pid', productPhotoControler)

//product delete
router.delete('/product-delete/:pid', productDeleteControler)

// product filtr
router.post('/product-filters', productFiltersController)

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get('/search/:keyword', searchProducdtController)

//related product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController)

//payment getway //token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);





export default router;