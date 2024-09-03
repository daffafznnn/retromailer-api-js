import { check, validationResult } from "express-validator";

// Validasi email
export const validateEmail = check("email")
  .isEmail()
  .withMessage("Invalid email format")
  .custom((value) => {
    if (!value.includes("@")) {
      throw new Error("Email must contain @");
    }
    return true;
  });

// Validasi password
export const validatePassword = check("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long");

// Fungsi untuk memeriksa hasil validasi
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
