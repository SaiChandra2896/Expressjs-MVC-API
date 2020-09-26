const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add Course Title"],
  },
  description: {
    type: String,
    required: [true, "Please add Desription"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add Tution Cose"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add Minimum Skill Required"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

// Static Method to get Avg of course tuitions -Aggregation
CourseSchema.statics.getAvgCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// call a getAvgCost after save
CourseSchema.post("save", function () {
  this.constructor.getAvgCost(this.bootcamp);
});

// call a getAvgCost before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAvgCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
