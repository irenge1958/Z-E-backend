const express=require("express")
const morgan=require("morgan")
const helmet=require("helmet")
const dotenv=require("dotenv")
const authRoute=require("./route/auth")
const user=require("./route/user")
const product=require("./route/product")
const mongoose=require("mongoose")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const paypal = require('paypal-rest-sdk');
const sendEnquiryEmail = require('./route/email');
paypal.configure({
  mode: 'sandbox', // 'sandbox' for testing, 'live' for production
  client_id: 'AbwmkIitBIFOhksg60DUElh-NVWH8IBuBKYuGAeDSmtWafTf7Sl0DIy6V3uYRipJ0UVx-zOoyP47Hlb-',
  client_secret: 'EOFlZqLD-_fQhoQ_j9BhSxHkM7c5cfI2WBM5gYnyN64rQS1PhqogSK8eherHeavKNhwRk-Gzl3p1bKwp'
});

const app=express()
dotenv.config()
mongoose.connect(process.env.code_db);
mongoose.connection.on('connected', () => {
     console.log('Successfully connected to the database');
 });
 app.use(cors({
  origin: "*", // or specify a specific origin like 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // specify allowed headers
}));
 app.use(cookieParser())
 app.use(express.json())
 app.post('/api/paypal/create-payment', (req, res) => {
     console.log('Received amount:', req.body.amount); // Log the amount
     const create_payment_json = {
       intent: 'sale',
       payer: {
         payment_method: 'paypal'
       },
       transactions: [{
         amount: {
           currency: 'USD',
           total: req.body.amount
         },
         description: 'Payment for order'
       }],
       redirect_urls: {
         return_url: 'http://localhost:3000/success', // Adjust for your app
         cancel_url: 'http://localhost:3000/cancel'
       }
     };
   
     paypal.payment.create(create_payment_json, (error, payment) => {
       if (error) {
         res.status(500).send(error);
       } else {
         res.send(payment);
         console.log(payment)
       }
     });
   });
   
app.use('/auth/',authRoute)
app.use('/user/',user)
app.use('/product/',product)
app.use('/api/send-enquiry/', sendEnquiryEmail);
app.use((err,req,res,next)=>{
const status=err.status || 500
const message=err.message || 'Something Went Wrong'
return res.status(status).json({
     success:'failure',
     status:status,
     message:message
})
})
app.listen(6000,()=>{
     console.log("The server runs on 6000")
})