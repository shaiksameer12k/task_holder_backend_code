const jwt = require("jsonwebtoken");
const GlobalErrorHandler = require("../common/Error");

function getAuthorizationToken(res, authHeader) {
  if (!authHeader) {
    let errorData = new GlobalErrorHandler(
      401,
      "Authorization header is missing",
      false,
      ""
    );
    let formatErrorResponse = errorData?.formatErrorResponse();
    return res
      .status(formatErrorResponse?.statusCode)
      .json(formatErrorResponse);
  }

  // Split the "Bearer <token>" string to extract the token
  const token = authHeader.split(" ")[1];

  if (!token) {
    let errorData = new GlobalErrorHandler(
      401,
      "Token is missing from the Authorization header",
      false,
      ""
    );
    let formatErrorResponse = errorData?.formatErrorResponse();
    return res
      .status(formatErrorResponse?.statusCode)
      .json(formatErrorResponse);
  }

  return token;
}

function verifyToken(req, res, next) {
  let PRIVATE_KEY = process.env.JWTKEY;
  let token =
    req.cookies.token || getAuthorizationToken(res, req.headers?.authorization);
  console.log("req.cookies.token :", req.cookies.token);
  if (!token) {
    let errorData = new GlobalErrorHandler(401, "There is no Token", false, "");
    let formatErrorResponse = errorData?.formatErrorResponse();
    return res
      .status(formatErrorResponse?.statusCode)
      .json(formatErrorResponse);
  }

  jwt.verify(token, PRIVATE_KEY, (err, decodedToken) => {
    console.log("decodedToken", decodedToken);
    if (err) {
      let errorData = new GlobalErrorHandler(
        403,
        "Invalid or expired token",
        true,
        err
      );
      return res
        .status(errorData?.statusCode)
        .json(errorData?.formatErrorResponse());
    }

    req.user = {
      username: decodedToken.username,
    };

    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = verifyToken;
