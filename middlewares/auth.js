const jwt = require("jsonwebtoken");

const asyncHandler = require("./async");
const ApiError = require("../utils/ApiError");

const User = require("../models/User");

// lock routes
exports.lock = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  // else if(req.cookies.token)token = req.cookies.token;

  // make sure token exists
  if (!token) return next(new ApiError("not authorized", 401));

  // if token exists verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ApiError("not authorized", 401));
  }
});
