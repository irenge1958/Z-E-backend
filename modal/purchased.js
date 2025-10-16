const mongoose=require('mongoose')
const purchasedScheme=mongoose.Schema({
    UserId:{
        type:String,
        required:true
    },
    nameuser:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
      
    },
    
    state:{
        type:String,
        default:'awaiting-shipment'
    },
    Price:{
        type:String,
        required:true
    },
    transactionid:{
        type:String,
        required:true
    }
   

},
{timestamps:true}
)
module.exports=mongoose.model('purchased',purchasedScheme)