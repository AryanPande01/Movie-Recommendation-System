
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     console.log("⏳ Connecting to MongoDB...");
//     console.log("URI HOST:", process.env.MONGO_URI?.split("@")[1]);

//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       tls: true,
//       tlsAllowInvalidCertificates: false,
//       serverSelectionTimeoutMS: 10000,
//     });

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB connection error (FULL):");
//     console.error(error);
//     console.error(error?.cause);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    console.log("⏳ Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    // 🚨 IMPORTANT: DO NOT EXIT THE PROCESS
    // Let the server run so Render does not crash-loop
  }
};
``
