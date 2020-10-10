const express = require("express");
const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");

const advancedResult = require("../middlewares/advancedResult");
const { lock } = require("../middlewares/auth");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

router
  .route("/")
  .get(
    advancedResult(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(lock, addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(lock, updateCourse)
  .delete(lock, deleteCourse);

module.exports = router;
