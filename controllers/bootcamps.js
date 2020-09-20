const BootCamp = require("../models/Bootcamp");
const ApiError = require("../utils/ApiError");

const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = BootCamp.find(JSON.parse(queryStr));

  const bootcamps = await query;
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

// GET bootcamps with in a radius-
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat and long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calculate using radius
  // divide distance by radius of earth
  // earth radius 3,963 miles
  const radius = distance / 3963.2;

  const bootcamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
