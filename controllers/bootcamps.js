const BootCamp = require("../models/Bootcamp");
const ApiError = require("../utils/ApiError");

const asyncHandler = require("../middlewares/async");

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootCamp.find();
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ApiError(`Bootcamp of Id: ${req.params.id} not found`, 404)
    );
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return next(
      new ApiError(`Bootcamp of Id: ${req.params.id} not found`, 404)
    );

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);

  if (!bootcamp)
    return next(
      new ApiError(`Bootcamp of Id: ${req.params.id} not found`, 404)
    );

  res.status(200).json({
    success: true,
    data: {},
  });
});
