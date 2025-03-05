import express, { Express } from "express";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes";
import authRoutes from "./routes/authRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import userRoutes from "./routes/userRoutes";
import companyRoutes from "./routes/companyRoutes";
import cloudFunctionRoutes from "./routes/cloudFuntionRoutes";

const app: Express = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());


app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/cloudFunction", cloudFunctionRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
