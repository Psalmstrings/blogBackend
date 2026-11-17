import mongoose from "mongoose";

const orgInfoSchema = new mongoose.Schema(
  {
    vision: {
      type: String,
      default:
        "To build a well-informed, responsible, and empowered student community that actively contributes to national growth and development.",
    },
    mission: {
      type: String,
      default:
        "To strengthen communication, promote meaningful engagement, and establish trust between student leaders and the communities they serve.",
    },
    coreValues: [
      {
        title: String,
        description: String,
      },
    ],
    ideology: {
      title: {
        type: String,
        default: "Our Guiding Ideology",
      },
      content: {
        type: String,
        default:
          "NANS Southwest Zone-D champions the principles of integrity, service, and active participation. We believe that students are the heartbeat of national transformation and deserve a voice in shaping the policies that affect them.",
      },
      image: {
        type: String,
        default: "",
      },
    },
    history: {
      title: {
        type: String,
        default: "Our History",
      },
      content: {
        type: String,
        default:
          "NANS Southwest Zone-D carries a long-standing tradition of defending student rights, promoting youth integration in governance, and shaping leaders who continue to influence society today.",
      },
    },
    objectives: [
      {
        title: String,
        description: String,
      },
    ],
    secretariat: {
      address: {
        type: String,
        default: "Secretariat of the Office of the PRO, NANS Southwest Zone D",
      },
      email: {
        type: String,
        default: "nanszonedpro26@gmail.com",
      },
      phone: {
        type: String,
        default: "",
      },
      operationalHours: {
        type: String,
        default: "Monday - Friday: 9am - 5pm",
      },
    },
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("OrgInfo", orgInfoSchema);
