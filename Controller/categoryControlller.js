import slugify from "slugify"
import CategoryModels from "../Models/CategoryModels.js"

export const createCategoryControler = async(req, res)=>{
    try {
        const {name} =req.body;
        if(!name){
            return res.status(401).send({
                message: 'Name in Required',
            })
        }
        const existingCategory = await CategoryModels.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message:'Category Already Existing'
            })
        }
        const category = await new CategoryModels({name, slug:slugify(name),}).save()
        res.status(201).send({
            success: true,
            message: 'new category created',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            massage: 'Error in category',
            error,
        })
    }
}

//update Category Controler
export const updateCategoryControler = async(req, res)=>{
    try {
        const {name} =req.body;
        const {id} =req.params
        const category = await CategoryModels.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true})
        res.status(200).send({
            success: true,
            message:'Category update Successfully',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Error while update in category',
            error,
        })
    }
}

//categorys Controler
export const categoryControler = async (req, res) => {
    try {
      const category = await CategoryModels.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };

//single category controler
export const singleCategoryControler = async(req, res)=>{
    try {        
        const category =await CategoryModels.findOne({slug:req.params.slug})
        res.status(201).send({
            success:true,
            message:'Get single category successfully',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Single category not found',
            error,
        });
    }
};

//delete category controler
export const deleteCategoryControler = async(req,res)=>{
    try {
        const {id}= req.params;
        await CategoryModels.findByIdAndDelete(id)
        res.status(202).send({
            success:true,
            message: 'Category delete succefully',
            
        }) 
    } catch (error) {
        console.log(error)
        res.status(405).send({
            success: false,
            message: 'Getting Delete Problem',
            error,
        })
    }
};