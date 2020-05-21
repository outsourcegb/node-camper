var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/hello", (req, res) => {
  res.send("Hello from node and express");
});

router.get("/hello.json", (req, res) => {
  res.send({ text: "Hello from node and express" });
});

router.get("/hello_again.json", (req, res) => {
  res.status(200).json({ text: "Hello from node and express" });
});

module.exports = router;
