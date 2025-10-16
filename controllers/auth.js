const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const users = require('../modal/user');
const createError=require('../createError')
const jwt = require('jsonwebtoken');

const signup = async (req, res,next) => {
 console.log(req.body.password)

    try {
        // Hash the password
        const hash = await bcrypt.hash(req.body.password, 10);
const existinguser=await users.findOne({email: req.body.email})
const existinguser2=await users.findOne({username: req.body.name})
if (existinguser || existinguser2) return next(createError(500,'This user already exist'))
        // Create a new user
        const newUser = await users.create({
            email: req.body.email,
            password: hash,
            username: req.body.name,
            location: req.body.location
        });
        const {password,...others}=newUser._doc
        // Send a successful response
        res.status(201).json({
            message: 'Successfully created',
            user: others
        });
        
    } catch (err) {
     
        // Send an error response
     next(createError(500,err.message))
    }
};
const signin = async (req, res,next) => {
   console.log(req.body.email)
   
    try {
        // Find user by email
        const newUser = await users.findOne({ email: req.body.email });
   
        // Check if user exists
        if (!newUser) {
            return next(createError(500,'This user does not exist') );
        }

        // Compare the plain-text password with the hashed password
        const passwordMatch = await bcrypt.compare(req.body.password, newUser.password); // Corrected order
console.log(passwordMatch)
        // Check if password matches
        if (!passwordMatch) {
            return next(createError(500,'Wrong password'));
        }
//  creating a webtoken
const token=jwt.sign({id:newUser._id},process.env.JWT)
const {password,...others}=newUser._doc
res.cookie('accesstoken',token,{httpOnly:true})
        // Send success response
        res.status(200).json({
            message: 'Successfully logged in',
            user: others,
            accesstoken:token
        });
        console.log(others)
    } catch (err) {
        console.log(err);
        // Send an error response
        next(err)
    }
};
const signinwithgoogle = async (req, res,next) => {
    console.log(req.body.email)
    
     try {
         // Find user by email
         const newUser = await users.findOne({ email: req.body.email });
         // Check if user exists
         if (newUser) {
 const token=jwt.sign({id:newUser._id},process.env.JWT)
 res.cookie('accesstoken',token,{httpOnly:true})
 // Send success response
 res.status(200).json({
     message: 'Successfully logged in',
     user: newUser,
     accesstoken:token
 });

         }
 
else{
    const newUser = await users.create({
        email: req.body.email,
        profilepicture: req.body.img,
        username: req.body.username,
        location:req.body.location,
        fromgoogle:true
    });
    const token=jwt.sign({id:newUser._id},process.env.JWT)
    res.cookie('accesstoken',token,{httpOnly:true})
    // Send success response
    res.status(200).json({
        message: 'Successfully logged in',
        user: newUser,
        accesstoken:token
    });
}
 


     } catch (err) {
         console.log(err);
         // Send an error response
         next(err)
     }
 };
module.exports = {signup,signin,signinwithgoogle};
