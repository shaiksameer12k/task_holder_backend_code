const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const DBConnection = require("./db/DBConnection");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://task-holder-frontend-code.vercel.app/", // Allow requests only from the frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
DBConnection();

// routes start point

app.use("/user", userRouter);

app.get("/", (req, res) => {
  return res.send("Hello task holder api");
});

module.exports = app;
