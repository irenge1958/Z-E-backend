// controllers/user.js
const mongoose = require('mongoose');
const users = require('../modal/user');
const createError=require('../createError')
const subscribe =async (req, res,next) => {
 
    const sub=await users.findByIdAndUpdate(req.user.id,{$push:{subscribings:req.params.id}})
    await users.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } })
    res.status(200).json({ message: 'Subscription successful!' });
};

const unsubscribe = async (req, res) => {
   
    const unsub=await users.findByIdAndUpdate(req.user.id,{$pull:{subscribings:req.params.id}})
    await users.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } })
    res.status(200).json({ message: 'unsSubscription successful!' });
};

const subscribtion = async (req, res,next) => {

    const user= await users.findById(req.params.id)
    
    if(!user) return next(createError(401,'user not found'))
    
    const mychannel=await Promise.all(user.subscribings.map((x)=>{
       return  users.findById(x)
    }))
    res.status(200).json(mychannel)
};

const update =async (req, res,next) => {
   

const updateduser=await users.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})

if (!updateduser) return next(createError(404,'user not found'))
res.status(200).json(updateduser)
}
const search= async (req, res) => {

    try {
      const results = await users.find({ username: { $regex: `^${req.params.q}`, $options: 'i' } }); // Find items starting with the provided string (case-insensitive)
      res.json(results).status(200);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const searchs= async (req, res) => {
      try {
        const results = await users.find({ username:  req.params.q }); // Find items starting with the provided string (case-insensitive)
        res.json(results).status(200);
      } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    const mygy= async (req, res) => {
      try {
        const results = await users.findById(req.params.id); // Find items starting with the provided string (case-insensitive)
        res.json(results).status(200);
      } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    const myuser= async (req, res) => {
      try {
        const results = await users.find(); 
        res.json(results).status(200);
      } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    const deleteuser= async(req, res) => {
      console.log(req.params.id)
      try {
        const userId = req.params.id;
        await users.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
      }
    }
module.exports = {deleteuser, subscribe,myuser, unsubscribe, subscribtion, update,searchs,search,mygy };
