const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get all users
// @route       GET /api/v1/users
// @access      Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single user
// @route       GET /api/v1/users/:id
// @access      Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc        Create user
// @route       POST /api/v1/users
// @access      Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc        Update User
// @route       PUT /api/v1/users/:id
// @access      Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Disable change role of current user
  if (req.body.role && req.user.id === req.params.id) {
    return next(
      new ErrorResponse(`Unable to change current logged in user role`, 400)
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Hash the password if the password is modified
  if (req.body.password) {
    user.password = req.body.password;
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc        Delete User
// @route       DELETE /api/v1/users/:id
// @access      Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Disable change role of current user
  if (req.user.id === req.params.id) {
    return next(
      new ErrorResponse(`Unable to delete current logged in user`, 400)
    );
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
