import Inquiry from '../models/Inquiry.models.js';


export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
};

// CREATE inquiry (from website / form)
export const createInquiry = async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: "Failed to create inquiry" });
  }
};

// SAVE admin reply (NO WhatsApp sending here)
export const replyInquiry = async (req, res) => {
  try {
    const { inquiryId, message } = req.body;

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.adminReply = message;
    inquiry.repliedAt = new Date();
    await inquiry.save();

    res.json({ success: true, message: "Reply saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save reply" });
  }
};

// single inquiry View 
export const  InquirySingleDetails = async (req, res) => {
    try {
        const  InquirySingleView = await Inquiry.findById(req.params.id);
        if (InquirySingleView == null) {
            return res.status(404).json({ message: "Cannot Find The News" });
        }
        else {
            res.json(InquirySingleView);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
  };



