const product=require('../modal/product')
const user=require('../modal/user')
const createError=require('../createError')
const comments=require('../modal/comments')
const purchased=require('../modal/purchased')

const purchasedproduct = async (req, res, next) => {
  
    try {
        const mygetpurchased = await purchased.find()
        res.status(200).json(mygetpurchased);
      
    } catch (err) {
        next(err);
    }
};
const getpurchased = async (req, res, next) => {
    console.log(req.params.id)
    try {
        const mygetpurchased = await purchased.find({ UserId: req.params.id })
        res.status(200).json(mygetpurchased);
      
    } catch (err) {
        next(err);
    }
};
const makepurchase = async (req, res, next) => {
  
    try {
        const mygetpurchased = await purchased.create({
            UserId:req.params.id,
            Price:req.body.price,
            title:req.body.title,
            transactionid:req.body.transactionid,
            nameuser:req.body.nameuser,
            pic:req.body.pic

         })
        res.status(200).json(mygetpurchased);
    } catch (err) {
        next(err);
    }
};
const updatepurchase = async (req, res, next) => {
  console.log(req.body.status)
    try {
        const mygetpurchased = await purchased.findByIdAndUpdate(req.params.id,{state:req.body.status})
        res.status(200).json(mygetpurchased);
    } catch (err) {
        next(err);
    }
};
const deletepurchase = async (req, res, next) => {
  
    try {
        const mygetpurchased = await purchased.findByIdAndDelete(req.params.id)
        res.status(200).json(mygetpurchased);
    } catch (err) {
        next(err);
    }
};
const getallpro = async (req, res, next) => {
 
    try {
        const allpro = await product.find()
        res.status(200).json(allpro);
    } catch (err) {
        next(err);
    }
};
const getallprocate = async (req, res, next) => {
 
  try {
      const allpro = await product.find()
      res.status(200).json(allpro);
  } catch (err) {
      next(err);
  }
};
const countprod = async (req, res) => {
  try {
    const { id } = req.params; // Extract userId from request parameters
    const productCount = await purchased.find({ UserId: id }); // Find products purchased by the user

    console.log(`User ${id} has purchased ${productCount.length} products.`);

    res.status(200).json({ productCount: productCount.length }); // Respond with the count
  } catch (error) {
    console.error('Error fetching product count:', error.message);
    res.status(500).json({ error: 'Failed to fetch product count' }); // Return error response
  }
};

const addcommentproduct = async (req, res, next) => {
    console.log(req.params.id);
    try {
      const allpro = await product.findOneAndUpdate(
        { title: req.params.id }, // Correct query object
        {
          $push: {
            comment: {
              text: req.body.text, // Text for the comment
              user: req.body.user, // User details for the comment
            },
          },
        },
        { new: true } // Returns the updated document after modification
      );
  
      if (!allpro) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(allpro); // Respond with the updated document
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle errors
    }
  };
  
const createV=async(req,res,next)=>{
 console.log(req.body.price)
    const mytagg=req.body.tagg.split(",")
    try{
        const newproduct=await product.create({
        pic:req.body.pic,
        producturl:req.body.producturl,
        title:req.body.title,
        tagg:mytagg,
        description:req.body.description,
        category:req.body.category,
        price:req.body.price,
        quantity:req.body.quantity
     })
    res.status(200).json(newproduct)
    }catch(err){
    next(err)
    }
}
const search= async (req, res) => {

    try {
      const results = await product.find({ title: { $regex: `^${req.params.q}`, $options: 'i' } }); // Find items starting with the provided string (case-insensitive)
      res.json(results).status(200);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const getoneV= async (req, res) => {
    console.log(req.params.id)
    try {

      const results = await product.findById(req.params.id); // Find items starting with the provided string (case-insensitive)
      console.log(results)
     
      res.json(results).status(200);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
 
  const searchs= async (req, res) => {
    const { keyword } = req.query;

    try {
        // Step 1: Find products based on the keyword
        let products = await product.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { tagg: { $regex: keyword, $options: 'i' } }
            ]
        });
        
console.log(products)
        // Step 2: If products are less than 4, find additional products with similar tags
        if (products.length < 4) {
            // Get tags from the initially found products
            const relatedTags = products.flatMap(product => product.tagg);

            // Find additional products with similar tags
            const additionalProducts = await product.find({
                tagg: { $in: relatedTags }
            }).limit(10); // Limit the number of additional products

            // Combine the arrays and remove duplicates
            const productSet = new Map(); // Use Map to ensure unique entries
            [...products, ...additionalProducts].forEach(product => {
                productSet.set(product._id.toString(), product);
            });

            // Convert back to an array
            products = Array.from(productSet.values());
        }
        console.log(products)
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}
const onechannelproduct=async (req,res,next)=>{
    try{
const products=await product.find({userID:req.params.id})
res.status(200).json(products)
    }catch(err){
  next(err)
    }
}
const modifyV =async (req, res,next) => {
   
    if (req.params.id!==req.user.id) return next(createError(401,'cannot update other\'s information')) 
    const updateduser=await product.findByIdAndUpdate(req.params.Id,{$set:req.body},{new:true})
    
    if (!updateduser) return next(createError(404,'product not found'))
    res.status(200).json(updateduser)
    }
    const deleteV = async (req, res) => {
        console.log(req.params.id)
        try {
          const { id } = req.params;
          const deletedProduct = await product.findByIdAndDelete(id);
      
          if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
          console.error('Error deleting product:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
      const updateproduct = async (req, res) => {

        try {
          const { id } = req.params;
          const { title, quantity, price,category } = req.body;
      
          const updatedProduct = await product.findByIdAndUpdate(
            id,
            { title, quantity, price,category },
            { new: true } // Return the updated document
          );
      
          if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          res.status(200).json(updatedProduct);
        } catch (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
        const likeV = async (req, res, next) => {
            console.log(req.user.id)
            if (req.params.id !== req.user.id) return next(createError(401, 'Not allowed'));
       
            try {
                const products = await product.findById(req.params.Id);
               
                if (!products) return next(createError(404, 'product not found'));
        
                // Check if the user has already liked || disliked the product
                const isLiked = products.likes.includes(req.params.id);
                const isdisLiked = products.dislikes.includes(req.params.id);
                isdisLiked && await product.findByIdAndUpdate(
                    req.params.Id, { $pull: { dislikes: req.params.id } } ,{ new: true }
                );
                // Update the likes array accordingly
                const updatedproduct = await product.findByIdAndUpdate(
                    req.params.Id,
                    isLiked ? { $pull: { likes: req.params.id } } : { $addToSet: { likes: req.params.id } }, 
                    { new: true }
                );
     
                res.status(200).json(updatedproduct);
            } catch (err) {
                next(err);
            }
        };
        const dislikeV = async (req, res, next) => {
            if (req.params.id !== req.user.id) return next(createError(401, 'Not allowed'));
        
            try {
                const products = await product.findById(req.params.Id);
                if (!products) return next(createError(404, 'product not found'));
        
                // Check if the user has already liked ordsiliked the product
                const isdisLiked = products.dislikes.includes(req.params.id);
                const isLiked = products.likes.includes(req.params.id);
                isLiked && await product.findByIdAndUpdate(
                    req.params.Id, { $pull: { likes: req.params.id } }, 
                );
                // Update the likes array accordingly
                const updatedproduct = await product.findByIdAndUpdate(
                    req.params.Id,
                    isdisLiked ? { $pull: { dislikes: req.params.id } } : { $addToSet: { dislikes: req.params.id } }, 
                    { new: true }
                );
        
                res.status(200).json(updatedproduct);
            } catch (err) {
                next(err);
            }
        };
        const addview =async(req,res,next)=>{
           const addv=await product.findByIdAndUpdate(
            req.params.id,{$inc:{view:+1}}
        ); 
        if (!addv) return next(createError(404, 'product not found'));
        res.status(200).send('added suuccessfully')
        } 
        const randomV=async(req,res,next)=>{
            try{
             const randomv=await product.aggregate([{$sample:{size:40}}])
             res.status(200).json(randomv)
            }catch(err){
            next(err)
            }
        }
        const taggV=async(req,res,next)=>{
        const tagg=req.query.tagg.split(',')
        console.log(tagg)
            try{
             const taggv=await product.find({tagg:{$in:tagg}}).limit(20)
             res.status(200).json(taggv)
            }catch(err){
            next(err)
            }
        }
        const trendV=async(req,res,next)=>{
                try{
                 const trendv=await product.find().sort({view:-1}).limit(1)
                 res.status(200).json(trendv)
                }catch(err){
                next(err)
                }
            }
            const createcommentV=async(req,res,next)=>{
                console.log(req.params.id)
                if (req.params.id !== req.user.id) return next(createError(401, 'Not allowed'));
                try{
                    
                 const createcomment=await comments.create({
                    userID:req.params.id,
                    productId:req.body.productId,
                    content:req.body.content
                })
                const mycommenterinfo = await user.findById(req.params.id);
                 res.status(200).json({ ...mycommenterinfo._doc, ...createcomment._doc })
                }catch(err){
                next(err)
                }
            }   
            const getcommentV = async (req, res, next) => {
                console.log(req.params.id)
                try {
                    const getcomment = await comments.find({ productId: req.params.id });
                    const mycommenterinfo = await Promise.all(
                        getcomment.map(async (x) => {
                            const userInfo = await user.findById(x.userID); // await the user find call
                            return { ...x._doc, ...userInfo._doc }; // Merge the documents properly
                        })
                    );
                    res.status(200).json(mycommenterinfo);
                } catch (err) {
                    next(err);
                }
            };
            
module.exports={getoneV,getallprocate,updateproduct,countprod,addcommentproduct,updatepurchase,purchasedproduct,deletepurchase,makepurchase,getallpro,getpurchased,getcommentV,createcommentV,trendV,randomV,taggV,createV,search,searchs,onechannelproduct,modifyV,deleteV,likeV,dislikeV,addview}