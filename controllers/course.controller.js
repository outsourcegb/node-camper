const ErrorResponse = require("./../utils/errorResponse");
const Course = require("./../models/course.model");
const Bootcamp = require("./../models/bootcamp.model");
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

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Course with id ${req.params.courseId} is not found`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {
      course: course,
    },
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    new ErrorResponse(
      `Bootcamp with id ${req.params.bootcampId} is not found`,
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: {
      course: course,
    },
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  let course = await Course.findById(courseId);

  if (!course) {
    new ErrorResponse(`Course with id ${courseId} is not found`, 404);
  }

  course = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      course: course,
    },
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  let course = await Course.findById(courseId);

  if (!course) {
    new ErrorResponse(`Course with id ${courseId} is not found`, 404);
  }

  await Course.remove();

  res.status(200).json({
    success: true,
    data: {
      course: {},
    },
  });
});
