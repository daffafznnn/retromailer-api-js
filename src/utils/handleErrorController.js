// src/utils/handleErrorController.js

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    status: false,
    message: error.message || "An unknown error occurred",
    code: error.code,
  });
}

export default handleError;