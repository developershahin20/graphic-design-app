import  express  from "express";
import 
    {  
        ForgotPasswordControler, 
        
        getAllOrdersController, 
        
        getOrdersController, 
        
        loginController, 
        orderStatusController, 
        registerController, 
        testController, 
        updateProfileController, 
        
    } from "../Controller/AuthController.js";
import { isAdmin, requireSignIn } from "../Middlewares/AuthMiddlewares.js";




//router object
const router = express.Router()

//routing
//register || post method
router.post('/register', registerController)

//login || post
router.post('/login', loginController)

//forget password || post
router.post('/forgot-password', ForgotPasswordControler)

//test route
router.get("/test", requireSignIn,isAdmin, testController)

//protected user route
router.get("/user-auth",requireSignIn, (req, res) => {
    res.status(200).send({
        ok:true,
    });
});
//protected admin route 
router.get("/admin-auth",requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok:true,
    });
});

//User update profile
router.put('/profile', requireSignIn, updateProfileController)

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn,isAdmin, getAllOrdersController);

// order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router;