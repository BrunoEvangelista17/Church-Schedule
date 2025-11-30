import request from "supertest";
import express from "express";
import unavailableRouter from "../routers/unavailableRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/unavailable", unavailableRouter);

describe("Unavailable Routes", () => {
  let unavailableId;

  describe("GET /unavailable", () => {
    it("should return all unavailabilities", async () => {
      const response = await request(app).get("/unavailable").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("all unavailabilities should have member name", async () => {
      const response = await request(app).get("/unavailable").expect(200);

      response.body.forEach((item) => {
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("datainicio");
        expect(item).toHaveProperty("datafim");
      });
    });
  });

  describe("GET /unavailable/:id", () => {
    it("should return unavailabilities for a member", async () => {
      const response = await request(app).get("/unavailable/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /unavailable/membro/:id", () => {
    it("should return unavailabilities for a member", async () => {
      const response = await request(app)
        .get("/unavailable/membro/1")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /unavailable", () => {
    it("should create a new unavailability", async () => {
      const newUnavailable = {
        idMembro: 1,
        dataInicio: "2025-12-20",
        dataFim: "2025-12-25",
      };

      const response = await request(app)
        .post("/unavailable")
        .send(newUnavailable)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.idmembro).toBe(newUnavailable.idMembro);
      unavailableId = response.body.id;
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
