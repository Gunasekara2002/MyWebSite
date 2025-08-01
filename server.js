import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import UserRoutes from "./routes/userRoutes.js";
/*import registerRoutes from "../routes/registerRoutes.js";*/
import SubsidiesRoutes from "./routes/subsidiesRoutes.js";
import DisasterLoanRoutes from "./routes/DisasterLoanRoutes.js";
import CertificateRoutes from "./routes/certificateRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import employeeRoutes from "./routes/employees.js";
import programmeRoutes from "./routes/programmeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import TimberPermitRoutes from "./routes/timberPermitRoutes.js";
import VehicalPermitRoutes from "./routes/vehicalPermitRoutes.js";

import mongoose from "mongoose";

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/User", UserRoutes);
/*app.use("/api/register",registerRoutes);*/

app.use("/api/subsidies", SubsidiesRoutes);
app.use("/api/disasterLoan", DisasterLoanRoutes);
app.use("/api/certificate", CertificateRoutes);
app.use("/api/timberPermit", TimberPermitRoutes);
app.use("/api/vehiclePermit", VehicalPermitRoutes);

app.use("/api/services", serviceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api", programmeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/auth", SubsidiesRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
