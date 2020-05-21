const ErrorResponse = require("./../utils/errorResponse");
const Course = require("./../models/course.model");
const asyncHandler = require("./../middlewares/asynce.middleware");

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: "bootcamp",
      select: "name description",
    });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    data: {
      count: courses.length,
      courses: courses,
    },
  });
});
