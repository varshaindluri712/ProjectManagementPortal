const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("Auth Controller", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  const testUser = {
    name: "Auth Test User",
    email: "authtest@example.com",
    password: "password123",
    passwordConfirm: "password123"
  };

  describe("POST /api/auth/register", () => {
    it("should successfully register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    });

    it("should fail validation if fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Missing Info"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should fail if passwords do not match", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Mismatch",
          email: "mismatch@example.com",
          password: "password123",
          passwordConfirm: "password1234"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("match");
    });

    it("should fail if password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Short Pass",
          email: "short@example.com",
          password: "123",
          passwordConfirm: "123"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("at least 6 characters");
    });

    it("should fail if email is already in use", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toContain("already in use");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    });

    it("should fail to login with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain("Invalid");
    });

    it("should fail to login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain("Invalid");
    });
  });
});
