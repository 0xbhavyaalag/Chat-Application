const ApiError = require('../utils/apiError');

function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler, notFoundHandler };
