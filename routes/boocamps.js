const express = require("express");
const router = express.Router();

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius,
} = require("../controllers/bootcamps");

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

module.exports = router;
