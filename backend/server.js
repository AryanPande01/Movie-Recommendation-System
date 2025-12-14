// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import movieRoutes from "./routes/movieRoutes.js";
// import historyRoutes from "./routes/historyRoutes.js";

// dotenv.config();

// /* -------------------- CONNECT DB -------------------- */
// connectDB();

// /* -------------------- APP SETUP -------------------- */
// const app = express();

// /* -------------------- CORS (FINAL CORRECT VERSION) -------------------- */
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://movie-nine-nine-nine-pi.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// /* 🔥 Handle preflight */
// app.options("*", cors());

// /* -------------------- MIDDLEWARE -------------------- */
// app.use(express.json());

// /* -------------------- ROUTES -------------------- */
// app.use("/api/auth", authRoutes);
// app.use("/api/movies", movieRoutes);
// app.use("/api/history", historyRoutes);

// /* -------------------- HEALTH CHECK -------------------- */
// app.get("/", (req, res) => {
//   res.json({ status: "API is running 🚀" });
// });

// /* -------------------- START SERVER -------------------- */
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`✅ Backend running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();

connectDB();

const app = express();

/* 🔥 CRITICAL FIX: allow all origins safely for now */
app.use(
  cors({
    origin: true, // <-- IMPORTANT
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* 🔥 VERY IMPORTANT */
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/history", historyRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

