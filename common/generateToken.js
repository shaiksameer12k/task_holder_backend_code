const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const setCookie = require("./setCookie");

function generateJwtToken(userName, res) {
  let PRIVATE_KEY = process.env.JWTKEY;
  var token = jwt.sign({ userName: userName }, PRIVATE_KEY, {
    expiresIn: "1h",
  });

  let result = setCookie(res, "token", token);
  console.log("Cookie Status : ", result , token);
  return token;
}

module.exports = generateJwtToken;
