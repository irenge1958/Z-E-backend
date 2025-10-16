const express = require('express');
const inquiry = express.Router();
const { inquire,enquire,deletes } = require("../controllers/inquire");

inquiry.post('/inquire', inquire);  // Correct function name
inquiry.get('/myenquire', enquire);  // Correct function name
inquiry.put('/delete/:id', deletes);  // Correct function name
module.exports = inquiry;
