import  JWT  from "jsonwebtoken";
import {  comparePassword, hashPassword} from "../Helper/AuthHelper.js";
import UserModel from "../Models/UserModel.js";
import OrdersModels from "../Models/OrdersModels.js";


export const registerController = async(req,res) => {
    try {
        const {name, email, password, address, phone, question} = req.body
        //validation
        if(!name){
            return res.send({
                message: 'Name in Required'
            })
        }
        if(!email){
            return res.send({
                message: 'Name in Required'
            })
        }
        if(!password){
            return res.send({
                message: 'Password in Required'
            })
        }
        if(!address){
            return res.send({
                message: 'Address in Required'
            })
        }
        if(!phone){
            return res.send({
                message: 'Phone in Required'
            })
        }
        if(!question){
            return res.send({
                message: 'Question in Required'
            })
        }
        
        //check user
        const existingUser= await UserModel.findOne({email});
        //existing user
        if(existingUser){
            return res.send(200).send({
                success: false,
                message: 'Already Resgister please Login',
            })
        }
        //registr user
        const hashPass= await hashPassword(password);
        //save
        const user = new UserModel({name, email, address, phone, question, password:hashPass}) .save()
        res.status(201).send({
            success:true,
            message: 'User register Successfully',
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in registration',
            error,
        })
    }
};

//post login

export const loginController =async(req,res)=>{
    try {
        const {email, password} =req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password',
            })
        }
        //check user
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email in not registered'
            })
        }
        const match= await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Invalid password'

            })
        }
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SCREAT,{expiresIn: "7d"});
        res.status(200).send({
            success: true,
            message: "login Successfully",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error,
        })
    }
}


//Forgot Password Controler
export const ForgotPasswordControler =async(req, res)=>{
    try {
        const {email, question, newPassword}= req.body;
        if(!email){
            res.status(400).send({
                message:'Email in required'
            })
        }
        if(!question){
            res.status(400).send({
                message:'Question in required'
            })
        }
        if(!newPassword){
            res.status(400).send({
                message:'New Password in required'
            })
        }
        // check 
        const user = await UserModel.findOne({email,question})
        //validation
        if(!user){
            return res.status(404).send({
                success: false,
                message:'Wrong email and question',
            })
        }
        const hashed= await hashPassword(newPassword)
        await UserModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success: true,
            message:'Password Reset successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success: false,
            message:'something went worng',
            error
        })
    }
}

//test controller
export const testController = (req, res) => {
    try {
      res.send("Protected Routes");
    } catch (error) {
      console.log(error);
      res.send({ error });
    }
  };

 // update User Profile 
 export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await UserModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };

  //orders
  export const getOrdersController = async (req, res) => {
    try {
      const orders = await OrdersModels
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

  // app orders
  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await OrdersModels
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await OrdersModels.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };