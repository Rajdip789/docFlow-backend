const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const corsOption = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const verifyJWT = require("./middleware/verifyJWT");
const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", require("./routes/authRoutes.js"));
app.use("/api/v1/user", verifyJWT, require("./routes/userRoutes.js"));
app.use("/api/v1/doc", verifyJWT, require("./routes/docRoutes.js"));

app.get("/health-check", (req, res) => {
  res.send({ success: true, message: "Successfull" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
