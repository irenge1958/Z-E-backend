const mongoose=require('mongoose')
const userScheme=mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:30,
        unique:true
    },
    email:{
        type:String,
        required:true,
        min:3,
        max:30,
        unique:true
    },
    password:{
        type:String
    },
    profilepicture:{
     type:String,
     default:""
    },
    location: {
        country: {
          type: String,
          default: ""
        },
        state: {
          type: String,
          default: ""
        },
        street: {
          type: String,
          default: ""
        }
      },
      
   fromgoogle:{
    type:Boolean,
    default:false
   }
},
{timestamps:true}
)
module.exports=mongoose.model('users',userScheme)