var express = require("express");
var {
  getCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
} = require("../../controllers/course.controller");

var router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(addCourse);
router.route("/:courseId").get(getSingleCourse).put(updateCourse);

module.exports = router;
