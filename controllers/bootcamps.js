const BootCamp = require("../models/Bootcamp");
const ApiError = require("../utils/ApiError");

const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  // build our query to search according to query strings
  let query;

  const reqQuery = { ...req.query };

  const removeFeilds = ["select", "sort", "page", "limit"];

  // loop over removeFeilds and delete them from req query
  removeFeilds.forEach((param) => delete reqQuery[param]);
  // console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  // convert operators into mongo operators (gt, gte, lt, lte)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // search according to our queries in url
  query = BootCamp.find(JSON.parse(queryStr));

  // select feilds
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // default descending order of createdAt field
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootCamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
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
