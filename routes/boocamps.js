const express = require("express");
const router = express.Router();

// include other resource routers
const courseRouter = require("./courses");

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

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

router.route("/:id/photo").put(bootCampPhotoUplaod);

module.exports = router;
