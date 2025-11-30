import request from "supertest";
import express from "express";
import usersRouter from "../routers/usersRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRouter);

describe("Users Routes", () => {
  const testEmail = `test${Date.now()}@church.test`;
  const testPassword = "testpass123";

  describe("GET /users", () => {
    it("should return all users", async () => {
      const response = await request(app).get("/users").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty("msg");
    });

    it("should not register duplicate email", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          email: "admin@church.test",
          password: "password123",
        })
        .expect(200);

      expect(response.body.msg).toContain("cadastrado");
    });
  });

  describe("POST /users/login", () => {
    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "admin@church.test",
          password: "admin123",
        })
        .expect(200);

      expect(response.text).toContain("sucesso");
    });

    it("should fail with incorrect password", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "admin@church.test",
          password: "wrongpassword",
        })
        .expect(200);

      expect(response.text).toContain("não encontrado");
    });

    it("should fail with non-existent user", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "nonexistent@church.test",
          password: "password123",
        })
        .expect(200);

      expect(response.text).toContain("não encontrado");
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
