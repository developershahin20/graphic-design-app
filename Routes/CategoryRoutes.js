import  express  from "express";
import { requireSignIn,isAdmin } from '../Middlewares/AuthMiddlewares.js'

import { categoryControler, createCategoryControler, deleteCategoryControler, singleCategoryControler, updateCategoryControler } from "../Controller/CategoryControlller.js";

const router = express.Router();

//router
//create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryControler)

//update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryControler)

//get all categorys
router.get("/get-category", categoryControler)

//single category
router.get('/single-category/:slug', singleCategoryControler)

//delete category
router.delete('/dalete-category/:id', requireSignIn, isAdmin, deleteCategoryControler)

export default router;