const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const DBConnection = require("./db/DBConnection");
const cors = require("cors");
const fs = require("fs");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://taskholderfrontend.vercel.app", // Allow requests only from the frontend domain

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// DBConnection();

// routes start point

app.use("/user", userRouter);

// app.get("/", (req, res) => {
//   return res.send("Hello task holder api !");
// });

app.get("/", (req, res) => {
  // res.send("C://Users//ManoMarappan//Pictures");

  // let isFileExist = fs.existsSync("C://Users//ManoMarappan//Pictures");
  let isFileExist = fs.existsSync("C://Users//Shaiksameer//Videos//edited");

  if (!isFileExist) {
    console.log("C://Users//Shaiksameer//Videos//edited");
    let filesList = fs.readdirSync("C://Users//Shaiksameer//Videos//edited");

    return res.send(filesList);

    // filesList.map((file) => {
    //   fs.readFile(
    //     `C://Users//Shaiksameer//Pictures//Screenshots//${file}`,
    //     (err, data) => {
    //       fs.writeFile(`../dummy_${file}`, data, (err) => {
    //         if (err) {
    //           console.error("Error writing file:", err);
    //         } else {
    //           return res.send(`File saved as output.png : ${file} `);
    //         }
    //       });
    //     }
    //   );
    // });
  } else {
    return res.send("not exist");
  }
});

module.exports = app;
