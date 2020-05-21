const ErrorResponse = require("./../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack.red);
  console.log(err.name.yellow);
  console.log(err);

  // Mongoose bad objectid
  if (err.name === "CastError") {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Duplicate key
  if (err.code == "11000") {
    const message = "Duplicate key entered";
    error = new ErrorResponse(message, 400);
  }

  // Validation error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server error",
  });
};

module.exports = errorHandler;
