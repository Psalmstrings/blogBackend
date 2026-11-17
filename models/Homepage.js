import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    hero: {
      title: {
        type: String,
        default: "NANS SouthWest — ZONE D",
      },
      subtitle: {
        type: String,
        default: "Office of the Public Relations Officer",
      },
      description: {
        type: String,
        default:
          "Promoting Transparency, Engagement & Effective Communication Across SouthWest Campuses.",
      },
      ctaText: {
        type: String,
        default: "KYS Registration Now Open →",
      },
      ctaLink: {
        type: String,
        default: "/register",
      },
      bannerImage: {
        type: String,
        default: "",
      },
    },
    aboutOffice: {
      title: {
        type: String,
        default: "About The PRO Office",
      },
      description: {
        type: String,
        default:
          "The Office of the Public Relations Officer serves as the communication backbone of NANS SouthWest — ensuring accurate information flow, conflict resolution, and improved student-government relations.",
      },
      pillars: [
        {
          title: String,
          description: String,
        },
      ],
    },
    kysBanner: {
      title: {
        type: String,
        default: "Know Your Student (KYS) Platform",
      },
      description: {
        type: String,
        default:
          "An integrated student identification, registration, and verification initiative bringing student leadership closer to the students across SouthWest tertiary institutions.",
      },
      ctaText: {
        type: String,
        default: "Register for KYS Now →",
      },
      ctaLink: {
        type: String,
        default: "/register",
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
    meetPro: {
      name: {
        type: String,
        default: "TOPE OLUGBEMI (CELEBRITY SURVEYOR)",
      },
      title: {
        type: String,
        default: "PRO, NANS ZONE-D",
      },
      tagline: {
        type: String,
        default: "A Voice. A Vision. A Responsibility.",
      },
      bio: {
        type: String,
        default:
          "Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the 'Celebrity Surveyor', he brings precision, structure, and forward thinking into both his profession and his leadership.",
      },
      image: {
        type: String,
        default: "",
      },
    },
    statistics: [
      {
        label: String,
        value: String,
        icon: String,
      },
    ],
    socialLinks: {
      twitter: { type: String, default: "https://x.com" },
      facebook: { type: String, default: "https://facebook.com" },
      instagram: { type: String, default: "https://instagram.com" },
      whatsapp: { type: String, default: "" },
      email: { type: String, default: "nanszonedpro26@gmail.com" },
      phone: { type: String, default: "" },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Homepage", homepageSchema);
