import Event from "../models/Event.js";
import AuditLog from "../models/AuditLog.js";

// GET EVENTS (Public)
export const getEvents = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const events = await Event.find(filter).sort({ eventDate: 1 });
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

// GET EVENT BY ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE EVENT (Admin)
export const createEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }

    const event = await Event.create(data);

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "CREATE_EVENT",
      module: "Events",
      targetId: event._id.toString(),
      details: { title: event.title, date: event.eventDate }
    });

    res.status(201).json({ success: true, message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create event", error: err.message });
  }
};

// UPDATE EVENT (Admin)
export const updateEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Event not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "UPDATE_EVENT",
      module: "Events",
      targetId: updated._id.toString(),
      details: { title: updated.title }
    });

    res.json({ success: true, message: "Event updated successfully", event: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update event", error: err.message });
  }
};

// DELETE EVENT (Admin)
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Event not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "DELETE_EVENT",
      module: "Events",
      targetId: req.params.id,
      details: { title: deleted.title }
    });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
