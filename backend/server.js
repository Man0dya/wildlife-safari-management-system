import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import packageRoutes from "./routes/packages.js";
import userRoutes from "./routes/users.js";
import staffRoutes from "./routes/staff.js";
import safariRequestRoutes from "./routes/safariRequests.js";
import contactMessageRoutes from "./routes/contactMessages.js";
import bookingRoutes from "./routes/bookings.js";
<<<<<<< Updated upstream
import attendanceRoutes from "./routes/attendance.js";
import payrollRoutes from "./routes/payroll.js";
=======
import reviewRoutes from "./routes/reviews.js";
>>>>>>> Stashed changes

dotenv.config({ path: './.env' });

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
console.log('IMGBB_API_KEY:', process.env.IMGBB_API_KEY ? 'Present' : 'Missing');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/safari-requests", safariRequestRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/bookings", bookingRoutes);
<<<<<<< Updated upstream
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
=======
app.use("/api/reviews", reviewRoutes);
>>>>>>> Stashed changes
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Something broke!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});