import request from "supertest";
import express from "express";
import cargosRouter from "../routers/cargosRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/cargos", cargosRouter);

describe("Cargos Routes", () => {
  describe("GET /cargos/ministerio", () => {
    it("should return all roles", async () => {
      const response = await request(app).get("/cargos/ministerio").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("all roles should have descricao and ministerio", async () => {
      const response = await request(app).get("/cargos/ministerio").expect(200);

      response.body.forEach((role) => {
        expect(role).toHaveProperty("descricao");
        expect(role).toHaveProperty("ministerio");
      });
    });
  });

  describe("GET /cargos/ministerio/:min", () => {
    it("should return roles by ministerio", async () => {
      const response = await request(app)
        .get("/cargos/ministerio/louvor")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((role) => {
        expect(role.ministerio).toBe("louvor");
      });
    });

    it("should return roles for diaconia", async () => {
      const response = await request(app)
        .get("/cargos/ministerio/diaconia")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return roles for midia", async () => {
      const response = await request(app)
        .get("/cargos/ministerio/midia")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /cargos/:desc", () => {
    it("should return a role by description", async () => {
      const response = await request(app)
        .get("/cargos/Guitarrista")
        .expect(200);

      expect(response.body).toHaveProperty("descricao");
      expect(response.body.descricao).toBe("Guitarrista");
    });
  });

  describe("GET /cargos/name/:id", () => {
    it("should return role descricao by id", async () => {
      const response = await request(app).get("/cargos/name/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("descricao");
    });
  });

  describe("GET /cargos/ministerio/name/:id", () => {
    it("should return ministerio by role id", async () => {
      const response = await request(app)
        .get("/cargos/ministerio/name/1")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("ministerio");
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
