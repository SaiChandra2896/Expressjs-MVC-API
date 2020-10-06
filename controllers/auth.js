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

  //   create token
  const token = user.getToken();
  res.status(200).json({ success: true, token });
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

  //   create token
  const token = user.getToken();
  res.status(200).json({ success: true, token });
});
