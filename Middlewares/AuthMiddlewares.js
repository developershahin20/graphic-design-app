import JWT from 'jsonwebtoken'
import UserModel from '../Models/UserModel.js';


//protected routes token base
export const requireSignIn =async(req,res,next)=>{
    
    try {
        const decode = JWT.verify(
            req.headers.authorization, 
            process.env.JWT_SCREAT
            );
            req.user =decode; 
            next();
    } catch (error) {
        console.log(error)
    }
}

//admin access
export const isAdmin = async(req,res,next) => {
    try {
        const user = await UserModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(402).send({
                success: false,
                message: 'UnAuthorizes Access'
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success:false,
            message: "Error in middelware",
            error,
        })
    }
}