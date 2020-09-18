const BootCamp = require("../models/Bootcamp");

exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await BootCamp.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.getBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.createBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.create(req.body);

    if (!bootcamp) return res.status(400).json({ success: false });

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.updateBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) return res.status(400).json({ success: false });

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.deleteBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) return res.status(400).json({ success: false });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
