const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack.red);

  //   bad object id error or cast error
  if (err.name === "CastError") {
    const message = `Bootcamp of Id: ${err.value} not found`;
    error = new ApiError(message, 404);
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
