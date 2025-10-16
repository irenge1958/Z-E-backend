const { signup } = require("../controllers/auth");
const {signin,signinwithgoogle}=require("../controllers/auth");
const express = require("express");
const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.post("/signinwithgoogle", signinwithgoogle);
module.exports = authRoute;
