import request from "supertest";
import express from "express";
import scalesRouter from "../routers/scalesRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/scale", scalesRouter);

describe("Scales Routes", () => {
  let scaleId;

  describe("GET /scales/tabela-escala", () => {
    it("should return all scales", async () => {
      const response = await request(app)
        .get("/scale/tabela-escala")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /scales/membro/:id", () => {
    it("should return scales for a member", async () => {
      const response = await request(app).get("/scale/membro/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((scale) => {
        expect(scale.idmembro).toBe(1);
      });
    });
  });

  describe("GET /scales/:id", () => {
    it("should return scales by event id", async () => {
      const response = await request(app).get("/scale/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /scales/louvor/:id", () => {
    it("should return louvor scales for a member", async () => {
      const response = await request(app).get("/scale/louvor/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /scales/diaconia/:id", () => {
    it("should return diaconia scales for a member", async () => {
      const response = await request(app).get("/scale/diaconia/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /scales/midia/:id", () => {
    it("should return midia scales for a member", async () => {
      const response = await request(app).get("/scale/midia/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /scales", () => {
    it("should create a new scale", async () => {
      const newScale = {
        idCargos: 1,
        idEventos: 1,
        idMembro: 1,
      };

      const response = await request(app)
        .post("/scale")
        .send(newScale)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.idcargos).toBe(newScale.idCargos);
      scaleId = response.body.id;
    });
  });

  describe("DELETE /scales/delete/:id", () => {
    it("should delete scales by event id", async () => {
      const response = await request(app)
        .delete("/scale/delete/999")
        .expect(204);
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
