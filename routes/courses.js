const express = require("express");
const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");

const advancedResult = require("../middlewares/advancedResult");

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
  .post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
