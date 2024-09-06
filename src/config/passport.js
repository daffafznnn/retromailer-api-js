import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserRepository from "../repositories/UserRepository.js";
import OAuth2Repository from "../repositories/OAuth2Repository.js"; // Tambahkan repository OAuth2
import RefreshTokenRepository from "../repositories/RefreshTokenRepository.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

// Passport configuration for Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { emails, displayName } = profile;
        const email = emails[0].value;

        // Find or create user based on Google profile
        let user = await UserRepository.findByEmail(email);
        if (!user) {
          user = await UserRepository.create({
            username: displayName,
            email: email,
            password: null, // Set null for Google login
            is_verified: true, // Assume user is verified
          });
        }

        // Save OAuth2 tokens
        await OAuth2Repository.upsert({
          provider: "google",
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 3600 * 1000), // Example: 1 hour
          user_id: user.id,
        });

        // Generate JWT tokens
        const accessTokenJwt = generateAccessToken(user.id);
        const refreshTokenJwt = generateRefreshToken(user.id);

        // Save refresh token to database
        await RefreshTokenRepository.create({
          user_id: user.id,
          token: refreshTokenJwt,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
        });

        // Return user and JWT tokens
        done(null, {
          user,
          accessToken: accessTokenJwt, // JWT Access Token
          refreshToken: refreshTokenJwt, // JWT Refresh Token
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;