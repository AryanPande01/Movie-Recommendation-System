import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const configuredSecret = process.env.JWT_SECRET;
    let decoded;

    // Try configured secret first
    try {
      const secretToUse = configuredSecret || "SECRET";
      decoded = jwt.verify(token, secretToUse);
    } catch (err) {
      // If verification failed and a configured secret exists, try legacy fallback
      if (configuredSecret) {
        try {
          decoded = jwt.verify(token, "SECRET");
        } catch (err2) {
          console.error("Auth middleware error (both secrets failed):", err2.message);
          return res.status(401).json({ message: "Invalid token" });
        }
      } else {
        console.error("Auth middleware error:", err.message);
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware unexpected error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
