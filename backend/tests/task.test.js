const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Task = require("../models/Task");

describe("Task Controller", () => {
  let tokenA;
  let tokenB;
  let userIdA;
  let userIdB;

  beforeAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    // Register User A
    const resA = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User A",
        email: "usera@example.com",
        password: "password123",
        passwordConfirm: "password123"
      });
    tokenA = resA.body.token;
    userIdA = resA.body.user.id;

    // Register User B
    const resB = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User B",
        email: "userb@example.com",
        password: "password123",
        passwordConfirm: "password123"
      });
    tokenB = resB.body.token;
    userIdB = resB.body.user.id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe("Authentication Guard", () => {
    it("should prevent fetching tasks if not logged in", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain("No token");
    });

    it("should prevent creating task if not logged in", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "No Auth" });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("Task CRUD & User Isolation", () => {
    it("should successfully create a task for User A", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Task A1",
          description: "This is task 1 for user A",
          status: "Pending"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("Task A1");
      expect(res.body.user).toBe(userIdA);
    });

    it("should enforce validation: title is required", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          description: "Missing title"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Title is required");
    });

    it("should prevent User B from seeing or updating User A's tasks", async () => {
      // Create a task as User A
      const taskRes = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Task A1",
          description: "Confidential task A"
        });
      const taskId = taskRes.body._id;

      // Get tasks as User B - should be empty
      const getRes = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${tokenB}`);
      expect(getRes.body.tasks.length).toBe(0);

      // Attempt to update User A's task as User B - should fail
      const updateRes = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ title: "Hacked Title" });
      expect(updateRes.statusCode).toBe(404);

      // Attempt to delete User A's task as User B - should fail
      const deleteRes = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenB}`);
      expect(deleteRes.statusCode).toBe(404);
    });
  });

  describe("Sorting, Search, and Pagination", () => {
    beforeEach(async () => {
      // Seed tasks for User A
      const tasksToSeed = [
        { title: "React Dashboard", description: "Build task management frontend", status: "In Progress" },
        { title: "Node API", description: "Design express REST routes", status: "Completed" },
        { title: "Database Schema", description: "Design MongoDB Mongoose models", status: "Completed" },
        { title: "Unit Testing", description: "Write backend integration tests", status: "Pending" },
        { title: "CI/CD Deployment", description: "Deploy app to production server", status: "Pending" }
      ];

      for (const t of tasksToSeed) {
        await request(app)
          .post("/api/tasks")
          .set("Authorization", `Bearer ${tokenA}`)
          .send(t);
      }
    });

    it("should return paginated tasks", async () => {
      const res = await request(app)
        .get("/api/tasks?page=1&limit=2")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks.length).toBe(2);
      expect(res.body.pagination.totalPages).toBe(3);
      expect(res.body.pagination.totalTasks).toBe(5);
    });

    it("should filter tasks by search query", async () => {
      const res = await request(app)
        .get("/api/tasks?search=testing")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks.length).toBe(1);
      expect(res.body.tasks[0].title).toBe("Unit Testing");
    });

    it("should filter tasks by status", async () => {
      const res = await request(app)
        .get("/api/tasks?status=Completed")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks.length).toBe(2);
      expect(res.body.tasks.every(t => t.status === "Completed")).toBe(true);
    });
  });

  describe("Dashboard Statistics", () => {
    it("should correctly compute stats for the user", async () => {
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Task 1", status: "Pending" });

      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Task 2", status: "Completed" });

      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Task 3", status: "In Progress" });

      const res = await request(app)
        .get("/api/tasks/stats")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.total).toBe(3);
      expect(res.body.pending).toBe(1);
      expect(res.body.inProgress).toBe(1);
      expect(res.body.completed).toBe(1);
    });
  });
});
