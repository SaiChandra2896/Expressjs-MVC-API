const express = require("express");
const router = express.Router();

// include other resource routers
const courseRouter = require("./courses");

const advancedResult = require("../middlewares/advancedResult");
const Bootcamp = require("../models/Bootcamp");

const { lock } = require("../middlewares/auth");

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius,
  bootCampPhotoUplaod,
} = require("../controllers/bootcamps");

// Re-Route iinto other resource routers- This redirects the to course Router
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootCamps)
  .post(lock, createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(lock, updateBootCamp)
  .delete(lock, deleteBootCamp);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

router.route("/:id/photo").put(lock, bootCampPhotoUplaod);

module.exports = router;
