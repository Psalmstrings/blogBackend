import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- Increase request size limit ---
app.use(express.json({ limit: "5mb" })); // allow JSON bodies up to 5MB
app.use(express.urlencoded({ limit: "5mb", extended: true })); // for form submissions

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// server.js or app.js

app.get("/news/:id", async (req, res) => {
  try {
    const news = await NewsModel.findById(req.params.id);

    if (!news) {
      return res.status(404).send("News not found");
    }

    const title = news.title;
    const description = news.content.slice(0, 150) + "...";
    const image = news.coverImage.startsWith("http")
      ? news.coverImage
      : `${process.env.BASE_URL}/${news.coverImage}`;

    const url = `${process.env.FRONTEND_URL}/news/${news._id}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>${title}</title>
        <meta name="description" content="${description}" />

        <!-- FACEBOOK / WHATSAPP -->
        <meta property="og:type" content="article" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:site_name" content="Your News Site" />

        <!-- TWITTER -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${image}" />

        <!-- IMPORTANT: this loads your React app -->
        <link rel="stylesheet" href="/assets/index.css" />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));