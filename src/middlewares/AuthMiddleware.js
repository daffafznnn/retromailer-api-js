import { verifyToken } from "../utils/token.js";
import HttpError from "../utils/httpError.js";

const AuthMiddleware = {
  authenticate: (req, res, next) => {
    // Ambil token dari header Authorization
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return next(new HttpError(401, "No token provided."));
    }

    try {
      // Verifikasi token (asumsikan 'access' jika tidak ditentukan)
      const decoded = verifyToken(token, "access");
      // Set userId dari decoded token ke req
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      next(new HttpError(401, "Invalid or expired token."));
    }
  },
};

export default AuthMiddleware;