import RequestModels from "../models/Request.models.js";

/* ---------------- CREATE REQUEST ---------------- */
export const createRequest = async (req, res) => {
  try {
    const request = new RequestModels(req.body);
    await request.save();

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit request",
      error: error.message,
    });
  }
};

/* ---------------- GET ALL REQUESTS ---------------- */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
