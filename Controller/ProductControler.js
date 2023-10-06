import slugify from "slugify";
import ProductModels from "../Models/ProductModels.js"
import fs from 'fs'
import CategoryModels from "../Models/CategoryModels.js";
import braintree from "braintree";
import dotenv from 'dotenv'
import OrdersModels from "../Models/OrdersModels.js";

dotenv.config();

//payment getway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductControler = async(req, res)=>{
    try {
        const {name, description, price, category, quantity} = req.fields;
        const { photo } =req.files;

        //validation
        switch(true){
            case !name: return res.status(500).send({
                error: 'Name is Required'
            })
            case !description: return res.status(500).send({
                error: 'Name is Required'
            })
            case !price: return res.status(500).send({
                error: 'Description is Required'
            })
            case !category: return res.status(500).send({
                error: 'Category is Required'
            })
            case !quantity: return res.status(500).send({
                error: 'Quantity is Required'
            })
            case !photo && photo.size > 1000000: return res.status(500).send({
                error: 'Photo is Required'
            })
        }
        const products = new ProductModels({
            ...req.fields,
            slug: slugify(name)
        })
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product created Successfully',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in creating Product',
            error,
        })
    }
};

//get all product controler
export const getProductControler =async(req, res)=>{
    try {
        const products = await ProductModels
        .find({})
        .populate('category')
        .select("-photo")
        .limit(12)
        .sort({createdAt:-1})
        res.status(200).send({
            success: true,
            message: "Getting all products Successfull",
            products,
            totalProducts:products.length,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Getting all Product error',
            error,
        })
    }
}

//get single product controler
export const getSingleProductControler = async(req, res)=>{
    try {
        const product =await ProductModels
        .findOne({slug:req.params.slug})
        .select("-photo")
        .populate("category");
        res.status(200).send({
            success:true,
            message: 'get single product successfully',
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: 'Error getting singel product',
            error,
        })
    }
}

//product Photo Controler
export const productPhotoControler=async(req,res)=>{
    try {
        const product = await ProductModels.findById(req.params.pid) .select('photo')
        if(product.photo.data){
            res.set('content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in uploading product photo",
            error,
        })
    }
}

//product Delete Controler
export const productDeleteControler=async(req, res)=>{
    try {
        await ProductModels.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({
            success:true,
            message: "product delete successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: 'Getting Error in product delete',
            error,
        })
    }
}

//update product controler
export const updateProductControler = async(req, res) =>{
    try {
        const { name, description, price, category, quantity} =
          req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case photo && photo.size > 1000000:
            return res
              .status(500)
              .send({ error: "photo is Required and should be less then 1mb" });
        }
    
        const products = await ProductModels.findByIdAndUpdate(
          req.params.pid,
          { ...req.fields, slug: slugify(name) },
          { new: true }
        );
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path);
          products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
          success: true,
          message: "Product Updated Successfully",
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in Updte product",
        });
      }
};

// product filter controller
export const productFiltersController= async(req, res)=>{
    try {
        const {checked, radio}= req.body
        let args = {}
        if(checked.length >0) args.category =checked;
        if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
        const products = await ProductModels.find(args)
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message: 'Error whilling filtering products',
            error,
        })
    }
}

//product count controller
export const productCountController = async (req, res) => {
    try {
      const total = await ProductModels.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };

//product per page controller
export const productListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await ProductModels
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };

//search product controller
export const searchProducdtController = async (req, res) => {
    try {
      const { keyword } = req.params;
      const resutls = await ProductModels
        .find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        })
        .select("-photo");
      res.json(resutls);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error In Search Product API",
        error,
      });
    }
  };

  //related product controller
  export const realtedProductController = async (req, res) => {
    try {
      const { pid, cid } = req.params;
      const products = await ProductModels
        .find({
          category: cid,
          _id: { $ne: pid },
        })
        .select("-photo")
        .limit(3)
        .populate("category");
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error while geting related product",
        error,
      });
    }
  };

  //product wise product
  export const productCategoryController =async(req, res)=>{
    try {
      const category = await CategoryModels.findOne({slug:req.params.slug})
      const products = await ProductModels.find({category}).populate('category');
      res.status(200).send({
        success: true,
        category,
        products,
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: false,
        message: "Error whiling geting Product",
        error,
      })
    }
  }

  // payment getway api
  export const braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //payments
  export const brainTreePaymentController = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new OrdersModels({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };