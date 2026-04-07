require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { happeoAuth } = require("./middleware/happeoAuth");
const { fetchGoogleSheetServices } = require("./data/googleSheets");

const app = express();
const PORT = process.env.PORT || 3001;
const DEV_MODE = process.env.DEV_MODE === "true";

// Validate required environment variables at startup
if (!DEV_MODE && !process.env.SHARED_SECRET) {
  console.error(
    "[server] FATAL: SHARED_SECRET environment variable is not set. " +
    "Set it to the secret configured in Happeo Admin → Custom Apps.",
  );
  process.exit(1);
}

app.use(express.json());

// Log every single incoming request for debugging
app.use((req, res, next) => {
  console.log(`\n[NETWORK LOG] Incoming ${req.method} request to: ${req.url}`);
  console.log(`[NETWORK LOG] Headers:`, JSON.stringify(req.headers, null, 2));
  next();
});

// Provide a 200 OK root endpoint for Happeo's mandatory oAuth/Healthcheck pings
app.get("/", (req, res) => {
  res.status(200).send("Happeo Search Connector is Live and Healthy!");
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
      : true, // allow all origins if CORS_ORIGIN is not set (safe for local development only)
    methods: ["GET"],
  }),
);

/**
 * GET /health
 * Unauthenticated health check — useful for local smoke-testing.
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * GET /api/catalogue
 * Returns IT services for the authenticated user.
 *
 * Swap getServices() to call your ITSM system (ServiceNow, Freshservice, etc.).
 * The decoded user context (res.locals.user) provides the identity and org
 * needed to scope queries to the right tenant.
 */
app.get("/api/catalogue", happeoAuth, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const org = user ? user.organisationId : "unknown";
    console.log(`[catalogue] request received org=${org}`);

    // Fetch live data directly from the verified public Google Sheet CSV
    const services = await fetchGoogleSheetServices();
    res.json({ services });
  } catch (error) {
    next(error);
  }
});

/**
 * HAPPEO SEARCH CONNECTOR ENDPOINTS
 * These endpoints comply with the Happeo "Building a Search Connector" specifications.
 */

// 1. Search Suggestions
app.get("/api/suggestions", happeoAuth, async (req, res, next) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : "";
    const allServices = await fetchGoogleSheetServices();

    const filtered = allServices.filter(s => 
      !query || 
      s.name.toLowerCase().includes(query) || 
      s.description.toLowerCase().includes(query) || 
      s.category.toLowerCase().includes(query)
    );

    const items = filtered.slice(0, 5).map(s => ({
      value: s.name,
      description: (s.description || "").slice(0, 100),
      id: s.id,
      url: s.url
    }));

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

// 2. Full Search Results
app.get("/api/search", happeoAuth, async (req, res, next) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : "";
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Category filter injection mapping from Happeo req query if passed
    const categoryFilter = req.query.category; 

    const allServices = await fetchGoogleSheetServices();
    
    let results = allServices.filter(s => 
      !query || 
      s.name.toLowerCase().includes(query) || 
      s.description.toLowerCase().includes(query) || 
      s.category.toLowerCase().includes(query)
    );

    if (categoryFilter) {
      // Happeo sends filters as arrays or single strings depending on UI
      const filters = Array.isArray(categoryFilter) ? categoryFilter : [categoryFilter];
      results = results.filter(s => filters.includes(s.category));
    }

    const total = results.length;
    const startIndex = pageNumber * pageSize;
    const paginatedItems = results.slice(startIndex, startIndex + pageSize);

    const items = paginatedItems.map(s => ({
      value: s.name,
      description: s.description,
      id: s.id,
      url: s.url,
      metaInfoItems: [ `<strong>Category:</strong> ${s.category}` ]
    }));

    const uniqueCategories = [...new Set(allServices.map(s => s.category))];
    const categoryOptions = uniqueCategories.map(c => ({ key: c, name: c }));

    res.json({
      pageNumber,
      pageSize,
      total,
      items,
      filters: [
        {
          key: "category",
          label: "Service Category",
          type: "checkbox",
          options: categoryOptions
        }
      ]
    });
  } catch (error) {
    next(error);
  }
});

// Global error handler — catches unhandled errors from route handlers
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(
    `IT Catalogue server running on http://localhost:${PORT} [${DEV_MODE ? "DEV (no JWT verification)" : "PROD"
    }]`,
  );
});
