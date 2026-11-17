import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Models
import News from "./models/News.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leadershipRoutes from "./routes/leadershipRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import orgInfoRoutes from "./routes/orgInfoRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS Setup
const allowedOrigins = [
  "https://officeoftheprozoned.com",
  "https://www.officeoftheprozoned.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.endsWith(".onrender.com")) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during transition to prevent blocking valid requests
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// Auth Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many login attempts. Please try again after 15 minutes." },
});
app.use("/api/auth/admin/login", authLimiter);
app.use("/api/auth/blogger/login", authLimiter);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Office of the PRO Zone D - Central CMS & API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Office of the PRO Zone D - Central CMS & API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leadership", leadershipRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/org-info", orgInfoRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/analytics", analyticsRoutes);

// ================= SOCIAL MEDIA OPEN GRAPH CRAWLER PREVIEW =================
const CRAWLER_USER_AGENTS = [
  "facebookexternalhit",
  "whatsapp",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "telegrambot",
  "discordbot",
  "skypeuripreview",
  "googlebot",
  "bingbot",
];

const renderSocialHtml = (news, req) => {
  const title = news.title ? `${news.title} | NANS Southwest Zone D` : "NANS Southwest Zone D — Office of the PRO";
  const rawDesc = news.content ? news.content.replace(/<[^>]*>?/gm, "").slice(0, 180) + "..." : "Latest update from the Office of the PRO, NANS Southwest Zone D.";
  const description = rawDesc.replace(/"/g, "&quot;");

  const frontendUrl = process.env.FRONTEND_URL || "https://officeoftheprozoned.com";
  const canonicalUrl = `${frontendUrl}/news/${news._id}`;

  let imageUrl = news.coverImage || "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg";
  if (!imageUrl.startsWith("http")) {
    imageUrl = `${process.env.BASE_URL || "https://blogbackend-xzrv.onrender.com"}/${imageUrl}`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="NANS Southwest Zone D — Office of the PRO" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${title}" />

  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${imageUrl}" alt="${title}" style="max-width:100%;height:auto;" />
  <p><a href="${canonicalUrl}">Click here if you are not redirected</a></p>
</body>
</html>`;
};

// Route for news crawlers and direct social previews
app.get("/news/:id", async (req, res) => {
  try {
    let news;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      news = await News.findById(req.params.id);
    } else {
      news = await News.findOne({ slug: req.params.id });
    }

    if (!news) {
      return res.redirect(process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/headlines` : "https://officeoftheprozoned.com/headlines");
    }

    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const isCrawler = CRAWLER_USER_AGENTS.some((bot) => userAgent.includes(bot));

    if (isCrawler || req.query.crawler === "true") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(renderSocialHtml(news, req));
    }

    // Normal browser redirect to frontend single news page
    const frontendUrl = process.env.FRONTEND_URL || "https://officeoftheprozoned.com";
    return res.redirect(`${frontendUrl}/news/${news._id}`);
  } catch (err) {
    console.error("Social render error:", err);
    res.redirect("https://officeoftheprozoned.com/headlines");
  }
});

// JSON SEO Preview Endpoint for frontend or edge tools
app.get("/api/seo/news/:id", async (req, res) => {
  try {
    let news;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      news = await News.findById(req.params.id);
    } else {
      news = await News.findOne({ slug: req.params.id });
    }

    if (!news) return res.status(404).json({ success: false, message: "News not found" });

    const frontendUrl = process.env.FRONTEND_URL || "https://officeoftheprozoned.com";
    res.json({
      success: true,
      title: news.title,
      description: news.content ? news.content.replace(/<[^>]*>?/gm, "").slice(0, 160) + "..." : "",
      image: news.coverImage,
      url: `${frontendUrl}/news/${news._id}`,
      publishedTime: news.createdAt,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Static files if dist folder exists (for optional monolithic hosting)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Office of the PRO Backend running on port ${PORT}`);
});
