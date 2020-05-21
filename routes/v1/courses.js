var express = require("express");
var { getCourses } = require("../../controllers/course.controller");

var router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);

module.exports = router;
