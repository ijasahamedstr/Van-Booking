import mongoose from 'mongoose';

// Define the schema
const InquirySchema = new mongoose.Schema({
    name: String,
    mobile: String,
    inquirytype: String,
    description: String,
     adminReply: {
      type: String,
      default: "",
    },
    date: String,
});


// Create the model
const Inquiry = mongoose.model('Inquiry', InquirySchema);

// Export the model
export default Inquiry;
