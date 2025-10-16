const { createcommentV,countprod,updateproduct,deletepurchase,addcommentproduct,purchasedproduct,getallpro,updatepurchase,getpurchased,makepurchase,getcommentV,createV,search,searchs,onechannelproduct,modifyV,deleteV,likeV,dislikeV,addview,trendV,randomV,taggV,getoneV,getallprocate } = require("../controllers/product");
const verifyuser=require('../verifyuser')
const express = require("express");

const product = express.Router();
product.put("/deletepurchase/:id",deletepurchase);
product.get("/products-count/:id",countprod);
product.get("/purchasedproduct",purchasedproduct);

product.post("/createproduct",createV);
product.post("/commentproduct/:id",verifyuser,createcommentV);
product.put("/modifyproduct/:id/:Id",verifyuser,modifyV);
product.delete("/deleteproduct/:id",deleteV);
product.post("/likeproduct/:id/:Id",verifyuser,likeV)
product.post("/addview/:id",addview)
product.put("/unlikeproduct/:id/:Id",verifyuser,dislikeV)
product.get("/search/:q",search)
product.get("/searchs",searchs)
product.get("/trend",trendV)
product.get("/random",randomV)
product.get("/tags",taggV)
product.get("/onechannelproduct/:id",onechannelproduct)
product.get("/getcommentV/:id",getcommentV)
product.get("/getpurchased/:id",getpurchased)
product.post("/makepurchase/:id",makepurchase)
product.put("/updatepurchase/:id",updatepurchase)
product.put("/update/:id",updateproduct)
product.post("/addcommentproduct/:id",addcommentproduct)
product.get("/getoneV/:id",getoneV)
product.get("/getallpro",getallpro)
product.get("/getallprocate",getallprocate)
module.exports =product;