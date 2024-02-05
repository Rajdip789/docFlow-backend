const cors = require("cors");
const http = require('http');
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDB = require("./config/dbConn");
const socketIOSetup = require("./socketIOSetup");
const verifyJWT = require("./middleware/verifyJWT");
const { corsOption } = require("./config/corsConfig");

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


const server = http.Server(app);
socketIOSetup(server);

server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));