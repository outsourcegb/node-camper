const fs = require("fs");
const mongoose = require("mongoose");
const Bootcamp = require("./models/bootcamp.model");
const Course = require("./models/course.model");
const colors = require("colors");

mongoose.connect("mongodb://localhost:27017/devcamper", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// console.log(courses);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err.red.inverse);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data deleted...".blue.inverse);
    process.exit();
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
