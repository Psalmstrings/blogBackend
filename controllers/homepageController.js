import Homepage from "../models/Homepage.js";
import AuditLog from "../models/AuditLog.js";

// Default initial config
const defaultHomepageData = {
  hero: {
    title: "NANS SouthWest — ZONE D",
    subtitle: "Office of the Public Relations Officer",
    description: "Promoting Transparency, Engagement & Effective Communication Across SouthWest Campuses.",
    ctaText: "KYS Registration Now Open →",
    ctaLink: "/register",
    bannerImage: ""
  },
  aboutOffice: {
    title: "About The PRO Office",
    description: "The Office of the Public Relations Officer serves as the communication backbone of NANS SouthWest — ensuring accurate information flow, conflict resolution, and improved student-government relations.",
    pillars: [
      {
        title: "Communication",
        description: "Timely and clear communication between leadership and all SouthWest campuses."
      },
      {
        title: "Transparency",
        description: "Ensuring students have access to verified, unbiased, and transparent information."
      },
      {
        title: "Representation",
        description: "Amplifying the voices of students at zonal and national levels."
      }
    ]
  },
  kysBanner: {
    title: "Know Your Student (KYS) Platform",
    description: "The Southwest PRO of the National Association of Nigerian Students (NANS) has kicked off an exciting new program called 'Know Your Students' (KYS). The goal? To bring student leadership closer to the students themselves.",
    ctaText: "KYS Registration Now Open →",
    ctaLink: "/register",
    enabled: true
  },
  meetPro: {
    name: "TOPE OLUGBEMI (CELEBRITY SURVEYOR)",
    title: "PRO, NANS ZONE-D",
    tagline: "A Voice. A Vision. A Responsibility.",
    bio: "Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the 'Celebrity Surveyor', he brings precision, structure, and forward thinking into both his profession and his leadership. Tope believes leadership is more than a title. To him, it is a responsibility to serve others and create real value.",
    image: ""
  },
  statistics: [
    { label: "Tertiary Institutions", value: "70+" },
    { label: "States Covered", value: "6" },
    { label: "Student Population", value: "1M+" },
    { label: "Active Mandates", value: "100%" }
  ],
  socialLinks: {
    twitter: "https://x.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "",
    email: "nanszonedpro26@gmail.com",
    phone: ""
  }
};

// GET HOMEPAGE DATA (Public)
export const getHomepageData = async (req, res) => {
  try {
    let homepage = await Homepage.findOne();
    if (!homepage) {
      homepage = await Homepage.create(defaultHomepageData);
    }
    res.json({ success: true, homepage });
  } catch (err) {
    console.error("Error fetching homepage:", err);
    res.status(500).json({ success: false, message: "Failed to fetch homepage data" });
  }
};

// UPDATE HOMEPAGE DATA (Admin)
export const updateHomepageData = async (req, res) => {
  try {
    let homepage = await Homepage.findOne();
    const updateData = { ...req.body };

    // Check for uploaded files if any
    if (req.files) {
      if (req.files.bannerImage?.[0]) {
        updateData.hero = { ...updateData.hero, bannerImage: req.files.bannerImage[0].path };
      }
      if (req.files.proImage?.[0]) {
        updateData.meetPro = { ...updateData.meetPro, image: req.files.proImage[0].path };
      }
    }

    if (!homepage) {
      homepage = await Homepage.create({ ...defaultHomepageData, ...updateData, updatedBy: req.user?.id });
    } else {
      homepage = await Homepage.findByIdAndUpdate(homepage._id, updateData, { new: true });
    }

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "UPDATE_HOMEPAGE_CONFIG",
      module: "Homepage",
      targetId: homepage._id.toString(),
      details: { updatedSections: Object.keys(updateData) }
    });

    res.json({ success: true, message: "Homepage updated successfully", homepage });
  } catch (err) {
    console.error("Error updating homepage:", err);
    res.status(500).json({ success: false, message: "Failed to update homepage", error: err.message });
  }
};
