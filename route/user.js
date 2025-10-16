const express = require('express');
const user = express.Router();
const verifyToken=require('../verifyuser')
const { subscribe,deleteuser,myuser, unsubscribe, subscribtion, update,searchs,search,mygy } = require("../controllers/user");


user.post('/subscribe/:id',verifyToken, subscribe);  // Correct function name
user.put('/unsubscribe/:id',verifyToken, unsubscribe);  // Correct function name
user.get('/subscription/:id', subscribtion);  // Correct function name
user.put('/update/:id', update);  // Correct function name
user.get('/search/:q',search)
user.get('/searchs/:q',searchs)
user.get('/myuser/:id',mygy)
user.get('/myuserall',myuser)
user.put('/delete/:id',deleteuser)
module.exports = user;
