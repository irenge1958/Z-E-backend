const express = require("express");
const dotenv = require("dotenv");
const authRoute = require("./route/auth");
const user = require("./route/user");
const product = require("./route/product");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const paypal = require("@paypal/checkout-server-sdk");
const sendEnquiryEmail = require("./route/email");

dotenv.config();

const app = express();

// ✅ MongoDB Connection
mongoose.connect(process.env.code_db)
  .then(() => console.log("✅ Successfully connected to the database"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// ✅ CORS Setup
app.use(cors({
  origin: "*", // Or specify your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

app.use(cookieParser());
app.use(express.json());

// ✅ PayPal SDK Configuration (Modern)
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// ✅ Create PayPal Order
app.post("/api/paypal/create-payment", async (req, res) => {
  try {
    console.log("💰 Received amount:", req.body.amount);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: req.body.amount
          },
          description: "Payment for order"
        }
      ],
      application_context: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel"
      }
    });

    const order = await client.execute(request);
    console.log("✅ PayPal Order Created:", order.result.id);
    res.status(200).json(order.result);

  } catch (error) {
    console.error("❌ PayPal Error:", error);
    res.status(500).json({ error: "PayPal order creation failed", details: error.message });
  }
});

// ✅ Routes
app.use("/auth", authRoute);
app.use("/user", user);
app.use("/product", product);
app.use("/api/send-enquiry", sendEnquiryEmail);

// ✅ Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something Went Wrong";
  return res.status(status).json({
    success: false,
    status,
    message
  });
});

// ✅ Root Endpoint
app.get("/", (req, res) => {
  res.status(200).send("🚀 API is working perfectly on Vercel!");
});

module.exports = app; // ✅ Important for Vercel Serverless Functions
