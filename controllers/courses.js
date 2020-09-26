const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ApiError = require("../utils/ApiError");

const asyncHandler = require("../middlewares/async");

// @desc      Add courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  req.body.bootcamp = bootcampId;

  const bootcamp = await Bootcamp.findById(bootcampId);
  if (!bootcamp)
    return next(new ApiError(`No Bootcamp with the Id of ${bootcampId}`, 404));

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  let query;

  if (bootcampId) {
    query = Course.find({ bootcamp: bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) return next(new ApiError(`No course with the Id of ${id}`, 404));

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let course = await Course.findById(id);
  if (!course) return next(new ApiError(`No Course with the Id of ${id}`, 404));

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return next(new ApiError(`No Course with the Id of ${id}`, 404));

  await course.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
