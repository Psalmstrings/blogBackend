import OrgInfo from "../models/OrgInfo.js";
import AuditLog from "../models/AuditLog.js";

const defaultOrgInfo = {
  vision: "To build a well-informed, responsible, and empowered student community that actively contributes to national growth and development.",
  mission: "To strengthen communication, promote meaningful engagement, and establish trust between student leaders and the communities they serve.",
  coreValues: [
    { title: "Transparency", description: "Open communication and honest reporting to the student body." },
    { title: "Accountability", description: "Responsible leadership prioritizing student welfare and institutional integrity." },
    { title: "Collaboration", description: "Partnering with university leadership, student unions, and government bodies." },
    { title: "Youth Empowerment", description: "Providing avenues for intellectual, professional, and civic excellence." }
  ],
  ideology: {
    title: "Our Guiding Ideology",
    content: "NANS Southwest Zone-D champions the principles of integrity, service, and active participation. We believe that students are the heartbeat of national transformation and deserve a voice in shaping the policies that affect them. Our ideology promotes youth empowerment, leadership development, and a collective effort to build a nation where education, innovation, and accountability thrive.",
    image: ""
  },
  history: {
    title: "Our History",
    content: "NANS Southwest Zone-D carries a long-standing tradition of defending student rights, promoting youth integration in governance, and shaping leaders who continue to influence society today. The Office of the Public Relations Officer has consistently served as the bridge between leadership and students—ensuring accurate information, promoting active involvement, and amplifying the voices of young Nigerians across institutions."
  },
  secretariat: {
    address: "Secretariat of the Office of the PRO, NANS Southwest Zone D",
    email: "nanszonedpro26@gmail.com",
    phone: "",
    operationalHours: "Monday - Friday: 9am - 5pm"
  }
};

// GET ORG INFO (Public)
export const getOrgInfo = async (req, res) => {
  try {
    let org = await OrgInfo.findOne();
    if (!org) {
      org = await OrgInfo.create(defaultOrgInfo);
    }
    res.json({ success: true, orgInfo: org });
  } catch (err) {
    console.error("Error fetching org info:", err);
    res.status(500).json({ success: false, message: "Failed to fetch organizational info" });
  }
};

// UPDATE ORG INFO (Admin)
export const updateOrgInfo = async (req, res) => {
  try {
    let org = await OrgInfo.findOne();
    const updateData = { ...req.body };

    if (req.file) {
      updateData.ideology = { ...updateData.ideology, image: req.file.path };
    }

    if (!org) {
      org = await OrgInfo.create({ ...defaultOrgInfo, ...updateData });
    } else {
      org = await OrgInfo.findByIdAndUpdate(org._id, updateData, { new: true });
    }

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "UPDATE_ORG_INFO",
      module: "Organizational Information",
      targetId: org._id.toString(),
      details: { sections: Object.keys(updateData) }
    });

    res.json({ success: true, message: "Organizational info updated successfully", orgInfo: org });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update organizational info", error: err.message });
  }
};
