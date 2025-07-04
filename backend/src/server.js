const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const companyLogoRoutes = require("./routes/companyRoutes");
const tenderRoutes = require("./routes/tenderRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

const app = express();

// ✅ Updated CORS config
app.use(
  cors({
    origin: [
      "https://b2-b-tender-management-cpkroypy3.vercel.app",
      "https://b2b-tender-management.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/companies", companyLogoRoutes);
app.use("/api/tender", tenderRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
