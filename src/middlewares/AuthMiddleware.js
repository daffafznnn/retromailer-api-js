import { verifyToken } from "../utils/token.js"; // Mengimpor verifyToken dari utils/token.js

const AuthMiddleware = {
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Mengambil token dari header Authorization

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    try {
      const decoded = verifyToken(token, "access"); // Memverifikasi token menggunakan verifyToken
      req.user = decoded; // Menyimpan informasi pengguna yang terdekode ke dalam req.user
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token." });
    }
  },

  authorize: (req, res, next) => {
    // Jika tidak ada peran (role) yang digunakan, Anda dapat mengabaikan bagian ini.
    // Jika Anda memerlukan logika tambahan untuk otorisasi, tambahkan di sini.
    next();
  },
};

export default AuthMiddleware;