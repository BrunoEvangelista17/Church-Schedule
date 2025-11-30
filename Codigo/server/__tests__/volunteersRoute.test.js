import request from "supertest";
import express from "express";
import volunteersRouter from "../routers/volunteersRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/volunteers", volunteersRouter);

describe("Volunteers Routes", () => {
  let volunteerId;

  describe("GET /volunteers/all", () => {
    it("should return all volunteers", async () => {
      const response = await request(app).get("/volunteers/all").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /volunteers/:eventid", () => {
    it("should return volunteers by event id", async () => {
      const response = await request(app).get("/volunteers/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /volunteers", () => {
    it("should create a new volunteer", async () => {
      const newVolunteer = {
        nome: "Test Volunteer",
        cargo: "Usheiro",
        idevent: 1,
      };

      const response = await request(app)
        .post("/volunteers")
        .send(newVolunteer)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.nome).toBe(newVolunteer.nome);
      volunteerId = response.body.id;
    });
  });

  describe("DELETE /volunteers/delete/:idevent", () => {
    it("should delete volunteers by event", async () => {
      const response = await request(app)
        .delete("/volunteers/delete/999")
        .expect(204);
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
