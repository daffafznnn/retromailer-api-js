
function handleError(res, error) {
    if (error instanceof Error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "An unknown error occurred",
      });
    }
}

export default handleError;