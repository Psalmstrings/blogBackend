import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Leadership from "./models/Leadership.js";
import Homepage from "./models/Homepage.js";
import OrgInfo from "./models/OrgInfo.js";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const initialProfiles = [
    {
      fullName: "Comrade Tope Olugbemi (Celebrity Surveyor)",
      position: "Public Relations Officer (PRO), NANS Zone-D",
      category: "Executive",
      photo: "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg",
      biography: "Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the 'Celebrity Surveyor', he brings precision, structure, and forward thinking into both his profession and his leadership.",
      portfolio: "Institutional communications, external affairs, student welfare advocacy, and strategic zonal partnerships across all SouthWest tertiary institutions.",
      responsibilities: [
        "Serving as the official spokesperson and communication bridge of NANS Southwest Zone D.",
        "Promoting constructive student-government-institution dialogue.",
        "Spearheading the Know Your Student (KYS) data and welfare initiative.",
        "Facilitating educational and empowerment partnerships for students across the zone."
      ],
      state: "Southwest Zone D",
      administration: "2026-2027",
      displayPriority: 1,
      isFeatured: true,
      status: "active"
    },
    {
      fullName: "Comrade Ibraheem Ayomide Alabi (IB POL)",
      position: "PRO, NANS JCC OSUN",
      category: "Media Team",
      photo: "",
      biography: "Dedicated student advocate and media strategist coordinating information flow across tertiary institutions in Osun State.",
      state: "Osun State",
      administration: "2026-2027",
      displayPriority: 2,
      status: "active"
    },
    {
      fullName: "Comrade Ridwan Ajayi",
      position: "PRO, NANS JCC LAGOS",
      category: "Media Team",
      photo: "",
      biography: "Grassroots student communicator driving campus engagement and public relations across Lagos State campuses.",
      state: "Lagos State",
      administration: "2026-2027",
      displayPriority: 3,
      status: "active"
    },
    {
      fullName: "Johnpaul Olamakinde Alabi (Makins)",
      position: "PRO, NANS JCC ONDO",
      category: "Media Team",
      photo: "",
      biography: "Vibrant student leader and media liaison amplifying the voice of Ondo State students.",
      state: "Ondo State",
      administration: "2026-2027",
      displayPriority: 4,
      status: "active"
    },
    {
      fullName: "Comrade Adeyanju Joshua (Aniyikaye)",
      position: "PRO, NANS JCC OYO",
      category: "Media Team",
      photo: "",
      biography: "Dynamic student advocate coordinating public relations and youth development initiatives across Oyo State.",
      state: "Oyo State",
      administration: "2026-2027",
      displayPriority: 5,
      status: "active"
    },
    {
      fullName: "Comr Sodiq Hassan (Celebrity Farmer)",
      position: "PRO, NANS JCC OGUN",
      category: "Media Team",
      photo: "",
      biography: "Youth advocate and public relations officer dedicated to student empowerment and engagement across Ogun State.",
      state: "Ogun State",
      administration: "2026-2027",
      displayPriority: 6,
      status: "active"
    },
    {
      fullName: "Comrade Adesipe Smart Ayodeji F. (AD Smart)",
      position: "PRO, NANS JCC EKITI",
      category: "Media Team",
      photo: "",
      biography: "Media coordinator and youth leader serving the student community across Ekiti State institutions.",
      state: "Ekiti State",
      administration: "2026-2027",
      displayPriority: 7,
      status: "active"
    }
  ];

  for (const p of initialProfiles) {
    const exists = await Leadership.findOne({ fullName: p.fullName });
    if (!exists) {
      await Leadership.create(p);
      console.log("Seeded:", p.fullName);
    }
  }

  console.log("All initial leadership profiles seeded!");
  await mongoose.disconnect();
}

seed().catch(console.error);
