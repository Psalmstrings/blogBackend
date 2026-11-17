import Inquiry from "../models/Inquiry.js";

// SUBMIT INQUIRY / COMPLAINT (Public)
export const submitInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, school, level, message, category } = req.body;

    if (!fullName || !school || !message) {
      return res.status(400).json({ success: false, message: "Full Name, School, and Message are required." });
    }

    const inquiry = await Inquiry.create({
      fullName,
      email,
      phone,
      school,
      level,
      message,
      category: category || "Inquiry",
    });

    res.status(201).json({
      success: true,
      message: "Your message has been submitted to the Office of the PRO. We will review it shortly.",
      inquiry: { id: inquiry._id, fullName: inquiry.fullName },
    });
  } catch (err) {
    console.error("Error submitting inquiry:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// GET INQUIRIES (Admin)
export const getInquiries = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch inquiries" });
  }
};

// UPDATE INQUIRY STATUS (Admin)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Inquiry not found" });

    res.json({ success: true, message: "Inquiry updated", inquiry: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE INQUIRY (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.json({ success: true, message: "Inquiry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
