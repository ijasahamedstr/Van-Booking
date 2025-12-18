import express from 'express';
import { createInquiry, getInquiries, InquirySingleDetails, replyInquiry } from '../controller/Inquiry.Controller.js';

// Create a new router instance
const Inquirysection = express.Router();
// Create the Data Register
Inquirysection.post('/',createInquiry );

// // View the Data Register
Inquirysection.get('/',getInquiries);

// // View the Single Data Register
Inquirysection.get("/:id",InquirySingleDetails);

Inquirysection.post("/reply",replyInquiry); 



export default Inquirysection;
