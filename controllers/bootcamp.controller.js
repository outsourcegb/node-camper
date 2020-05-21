const ErrorResponse = require("./../utils/errorResponse");
const Bootcamp = require("../models/bootcamp.model");
const asyncHandler = require("./../middlewares/asynce.middleware");
const geocoder = require("./../utils/geocoder.util");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "limit", "page", "per_page"];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: "courses",
    select: "title",
  });

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-created_at");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  console.log(total);

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    data: {
      counts: bootcamps.length,
      bootcamps: bootcamps,
      pagination: pagination,
    },
  });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      bootcamp: bootcamp,
    },
  });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      bootcamp: bootcamp,
    },
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: {
      bootcamp: bootcamp,
    },
  });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Earth radious = 3963 mi / 6378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    data: {
      count: bootcamps.length,
      bootcamps: bootcamps,
    },
  });
});
