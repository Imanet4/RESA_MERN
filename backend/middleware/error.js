
// Handle Multer errors specifically
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};




// Handle errors passed from controllers


const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
   ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Handle 404 errors
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
};

module.exports = { handleMulterErrors ,errorHandler, notFound}