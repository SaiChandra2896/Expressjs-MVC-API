const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  //   print to console for dev
  console.log(err.stack.red);

  //   bad object id error or cast error
  if (err.name === "CastError") {
    const message = `Bootcamp of Id: ${err.value} not found`;
    error = new ApiError(message, 404);
  }

  //   mongoose duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate feild values entered";
    error = new ApiError(message, 400);
  }

  //   mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(message, 400);
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
