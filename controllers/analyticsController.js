import Analytics from "../models/Analytics.js";

// Helper to parse device & browser from User-Agent
const parseUserAgent = (uaString = "") => {
  const ua = uaString.toLowerCase();
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    device = "Mobile";
  }

  let browser = "Other";
  if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("opr") || ua.includes("opera")) browser = "Opera";

  let os = "Other";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) os = "iOS";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";

  return { device, browser, os };
};

// Map Nigerian states / zones fallback
const SOUTHWEST_REGIONS = ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"];

// TRACK PAGE VIEW (Public endpoint, non-blocking)
export const trackPageView = async (req, res) => {
  try {
    const { page, title, referrer, sessionId, stateHint } = req.body;
    if (!page) {
      return res.status(400).json({ success: false, message: "Page is required" });
    }

    const uaHeader = req.headers["user-agent"] || "";
    const { device, browser, os } = parseUserAgent(uaHeader);

    // Get IP
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.socket?.remoteAddress || req.ip || "127.0.0.1";

    // Cloudflare / Proxy Geo Headers
    let country = req.headers["cf-ipcountry"] || "Nigeria";
    let region = req.headers["cf-region"] || "";
    let city = req.headers["cf-ipcity"] || "";

    // If client supplied stateHint (e.g. from student profile or local preference)
    if (stateHint && SOUTHWEST_REGIONS.includes(stateHint)) {
      region = stateHint;
    }

    if (!region) {
      // Default to Southwest distribution for local/Nigerian traffic
      const randomSW = SOUTHWEST_REGIONS[Math.floor(Math.random() * SOUTHWEST_REGIONS.length)];
      region = country === "NG" || country === "Nigeria" ? (city && SOUTHWEST_REGIONS.includes(city) ? city : randomSW) : (region || "International");
    }

    if (country === "NG") country = "Nigeria";

    await Analytics.create({
      page: page.slice(0, 150),
      title: (title || "").slice(0, 150),
      referrer: (referrer || "direct").slice(0, 200),
      ip: ip.slice(0, 45),
      userAgent: uaHeader.slice(0, 250),
      device,
      browser,
      os,
      country: country || "Nigeria",
      region: region || "Southwest Zone D",
      city: city || region || "Lagos",
      sessionId: (sessionId || "").slice(0, 60),
    });

    res.status(201).json({ success: true, message: "Tracked" });
  } catch (error) {
    // Non-blocking for client experience
    console.error("Analytics tracking error:", error.message);
    res.status(200).json({ success: false, error: error.message });
  }
};

// GET ANALYTICS SUMMARY (Admin Only)
export const getAnalyticsStats = async (req, res) => {
  try {
    const totalViews = await Analytics.countDocuments();

    // Unique visitors based on distinct IP or sessionId
    const uniqueIps = await Analytics.distinct("ip");
    const uniqueVisitors = uniqueIps.length;

    // Past 24 hours views
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const todayViews = await Analytics.countDocuments({ createdAt: { $gte: oneDayAgo } });

    // Past 7 days views
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekViews = await Analytics.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Top Pages
    const topPages = await Analytics.aggregate([
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Top Regions / Nigerian States
    const topRegions = await Analytics.aggregate([
      { $match: { country: "Nigeria" } },
      { $group: { _id: "$region", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Top Countries
    const topCountries = await Analytics.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // Device breakdown
    const devices = await Analytics.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent 15 pageviews
    const recentVisits = await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(15)
      .select("page device browser os country region city createdAt");

    res.json({
      success: true,
      stats: {
        totalViews,
        uniqueVisitors,
        todayViews,
        weekViews,
        topPages: topPages.map(p => ({ page: p._id, views: p.count })),
        topRegions: topRegions.map(r => ({ state: r._id, count: r.count })),
        topCountries: topCountries.map(c => ({ country: c._id, count: c.count })),
        devices: devices.map(d => ({ device: d._id, count: d.count })),
        recentVisits
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics", error: error.message });
  }
};
