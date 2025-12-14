// import express from "express";
// import History from "../models/History.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/", protect, async (req, res) => {
//   try {
//     const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });
//     res.json(history);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Could not fetch history" });
//   }
// });

// export default router;
import express from "express";
import History from "../models/History.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch history" });
  }
});

export default router;
