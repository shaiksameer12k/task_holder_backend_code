const HttpError = require("http-errors");

class GlobalErrorHandler {
  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    isToastMessage = false,
    err = null
  ) {
    // If error is passed, use its properties; otherwise, fall back to default values
    if (err) {
      this.statusCode = err.statusCode || statusCode; // Use statusCode from error or fallback to default
      this.message = err.message || message; // Use message from error or fallback to default
      this.errorStack = process.env.ENVTYPE === "development" ? err.stack : ""; // Include stack trace only in development
    } else {
      this.statusCode = statusCode;
      this.message = message;
      this.errorStack = ""; // No stack trace if no error passed
    }

    this.isToastMessage = isToastMessage;
  }

  // Method to format the error response as a standardized JSON object
  formatErrorResponse() {
    return {
      statusCode: this.statusCode,
      status: "error",
      messageData: this.message,
      isToastMessage: this.isToastMessage,
      errorStack: this.errorStack, // Include error stack if in development
    };
  }
}

module.exports = GlobalErrorHandler;
