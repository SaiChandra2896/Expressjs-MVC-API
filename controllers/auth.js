const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const asyncHandler = require("../middlewares/async");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user)
    return next(new ApiError(`user with email ${email} already exists`, 409));

  user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password)
    return next(new ApiError("please provide email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ApiError("Ivalid Credentials", 401));

  // check for password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) return next(new ApiError("Ivalid Credentials", 401));

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
