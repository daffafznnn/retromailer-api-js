import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserRepository from "../repositories/UserRepository.js";
import OAuth2Repository from "../repositories/OAuth2Repository.js";
import RefreshTokenRepository from "../repositories/RefreshTokenRepository.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import removeSensitiveFields from "../utils/removeSensitiveFields.js";

// Konfigurasi Passport dengan Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      accessType: "offline",
      scope: ["profile", "email"], // Menentukan scope yang akan diakses
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { emails, displayName } = profile;
        const email = emails[0].value;

        // Temukan atau buat pengguna berdasarkan profil Google
        let user = await UserRepository.findByEmail(email);

        if (!user) {
          user = await UserRepository.create({
            username: displayName,
            email,
            password: null, // No password for Google users
            googleId: profile.id,
            is_verified: true, // Google login is verified
          });
        }

        // Simpan atau perbarui token OAuth2 di repositori
        await OAuth2Repository.upsert({
          provider: "google",
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour token expiration
          user_id: user.id,
        });

        // Generate JWT tokens
        const accessTokenJwt = generateAccessToken(user.id);
        const refreshTokenJwt = generateRefreshToken(user.id);

        // Simpan refresh token di database
        await RefreshTokenRepository.create({
          user_id: user.id,
          token: refreshTokenJwt,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
        });

        // Kembalikan user dan JWT tokens
        return done(null, {
          user: removeSensitiveFields(user),
          accessToken: accessTokenJwt,
          refreshToken: refreshTokenJwt,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialisasi dan deserialisasi pengguna untuk sesi Passport
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;