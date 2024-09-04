import jwt from "jsonwebtoken";

// Ambil secret key dari environment variable
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret";

// Generate Access Token
export function generateAccessToken(userId) {
  // Buat payload, misalnya id pengguna
  const payload = { userId };

  // Buat dan kembalikan access token
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Token berlaku selama 15 menit
}

// Generate Refresh Token
export function generateRefreshToken(userId) {
  // Buat payload, misalnya id pengguna
  const payload = { userId };

  // Buat dan kembalikan refresh token
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Token berlaku selama 7 hari
}

// Verify Token
export function verifyToken(token, type = "access") {
  const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Token verification failed.");
  }
}