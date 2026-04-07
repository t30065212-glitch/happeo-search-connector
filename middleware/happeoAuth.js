const jwt = require("jsonwebtoken");

const DEV_MODE = process.env.DEV_MODE === "true";

if (DEV_MODE) {
  console.warn(
    "[happeoAuth] WARNING: DEV_MODE is enabled — JWT verification is DISABLED. " +
      "Never run with DEV_MODE=true in production.",
  );
}

/**
 * Verifies the Happeo JWT sent by the widget as `Authorization: Bearer <token>`.
 * The token is signed with SHARED_SECRET (configured in Happeo Admin → Custom Apps).
 * Decoded user/org context is attached to res.locals for downstream handlers.
 *
 * DEV_MODE skips verification and injects a placeholder user for local development.
 */
const happeoAuth = (req, res, next) => {
  if (DEV_MODE) {
    res.locals.user = {
      id: "dev-user",
      email: "dev@example.com",
      organisationId: "dev-org",
    };
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SHARED_SECRET);
    res.locals.user = {
      ...decoded.user,
      organisationId: decoded.organisation?.id,
    };
    next();
  } catch (err) {
    console.warn("[happeoAuth] JWT verification failed:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { happeoAuth };
