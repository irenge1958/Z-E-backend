const mongoose=require('mongoose')
const productScheme=mongoose.Schema({

    pic:{
        type:String,
        required:true,
    },
    producturl:{
        type:String,
        default:''
    },
    title:{
        type:String,
        required:true,
      
    }, 
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
   tagg:{
    type:[String],
    default:[]
   },
   description:{
    type:String,
    default:''
   },
   comment: {
    type: [
        {
            text: { type: String, required: true },
            user: { type: Object, required: true }, // Define structure of 'user' if possible
            createdAt: { type: Date, default: Date.now },
        },
    ],
    default: [], // Default an empty array if no value is provided
},


},
{timestamps:true}
)
module.exports=mongoose.model('product',productScheme)