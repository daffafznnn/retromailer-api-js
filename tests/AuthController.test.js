import request from "supertest";
import sinon from "sinon";
import app from "../src/app"; // Pastikan path benar
import AuthService from "../src/services/AuthService";
import UserRepository from "../src/repositories/UserRepository";
import RefreshTokenRepository from "../src/repositories/RefreshTokenRepository";

// Mock stubs
const userRepositoryStub = {
  create: sinon.stub(),
  findByEmail: sinon.stub(),
  findByVerificationToken: sinon.stub(),
  update: sinon.stub(),
};

const refreshTokenRepositoryStub = {
  create: sinon.stub(),
};

const authServiceStub = {
  sendVerificationEmail: sinon.stub().resolves(),
  hashPassword: sinon.stub().resolves("hashedpassword"),
  generateAccessToken: sinon.stub().returns("access-token"),
  generateRefreshToken: sinon.stub().returns("refresh-token"),
};

describe("AuthController", () => {
  beforeEach(() => {
    sinon.restore();
  });

  // Setup to replace actual implementations with stubs
  beforeAll(() => {
    // Stub the methods of AuthService
    if (AuthService.sendVerificationEmail) {
      sinon
        .stub(AuthService, "sendVerificationEmail")
        .callsFake(authServiceStub.sendVerificationEmail);
    }
    if (AuthService.hashPassword) {
      sinon
        .stub(AuthService, "hashPassword")
        .callsFake(authServiceStub.hashPassword);
    }
    if (AuthService.generateAccessToken) {
      sinon
        .stub(AuthService, "generateAccessToken")
        .callsFake(authServiceStub.generateAccessToken);
    }
    if (AuthService.generateRefreshToken) {
      sinon
        .stub(AuthService, "generateRefreshToken")
        .callsFake(authServiceStub.generateRefreshToken);
    }
  });

  describe("POST /register", () => {
    it("should register a new user and send verification email", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      userRepositoryStub.create.resolves({ id: 1, ...userData });

      const response = await request(app).post("/register").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        data: { id: 1, ...userData },
        message: "Registration successful, verification email sent.",
      });
    });

    it("should return an error if registration fails", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      userRepositoryStub.create.throws(new Error("Registration failed"));

      const response = await request(app).post("/register").send(userData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: "error",
        message: "Registration failed: Registration failed",
      });
    });
  });

  describe("POST /login", () => {
    it("should login a user and return tokens", async () => {
      const user = { id: 1, email: "test@example.com" };
      userRepositoryStub.findByEmail.resolves(user);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        data: { accessToken: "access-token", refreshToken: "refresh-token" },
        message: "Login successful.",
      });
    });

    it("should return an error if login fails", async () => {
      userRepositoryStub.findByEmail.throws(
        new Error("Invalid email or password")
      );

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: "error",
        message: "Login failed: Invalid email or password",
      });
    });
  });

  describe("GET /verify-email", () => {
    it("should verify the email", async () => {
      const token = "valid-token";
      const user = { id: 1, is_verified: false };
      userRepositoryStub.findByVerificationToken.resolves(user);
      userRepositoryStub.update.resolves();

      const response = await request(app).get(`/verify-email?token=${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        data: { id: 1, is_verified: true },
        message: "Email verified successfully.",
      });
    });

    it("should return an error if token is invalid", async () => {
      const token = "invalid-token";
      userRepositoryStub.findByVerificationToken.resolves(null);

      const response = await request(app).get(`/verify-email?token=${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: "error",
        message:
          "Email verification failed: Invalid or expired verification token.",
      });
    });
  });
});