import request from "supertest";
import express from "express";
import bandsRouter from "../routers/bandsRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/bands", bandsRouter);

describe("Bands Routes", () => {
  let bandId;

  describe("GET /bands", () => {
    it("should return all bands", async () => {
      const response = await request(app).get("/bands").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /bands/:id", () => {
    it("should return a band by id", async () => {
      const response = await request(app).get("/bands/1").expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("nome");
    });

    it("should return 404 for non-existent band", async () => {
      const response = await request(app).get("/bands/99999").expect(404);
    });
  });

  describe("POST /bands", () => {
    it("should create a new band", async () => {
      const newBand = {
        nome: "Test Band",
      };

      const response = await request(app)
        .post("/bands")
        .send(newBand)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.nome).toBe(newBand.nome);
      bandId = response.body.id;
    });
  });

  describe("PUT /bands/:id", () => {
    it("should update a band", async () => {
      if (!bandId) this.skip();

      const updatedBand = {
        nome: "Updated Band",
      };

      const response = await request(app)
        .put(`/bands/${bandId}`)
        .send(updatedBand)
        .expect(200);

      expect(response.body.nome).toBe(updatedBand.nome);
    });

    it("should return 404 for non-existent band", async () => {
      const response = await request(app)
        .put("/bands/99999")
        .send({ nome: "Test" })
        .expect(404);
    });
  });

  describe("DELETE /bands/:id", () => {
    it("should delete a band", async () => {
      if (!bandId) this.skip();

      const response = await request(app)
        .delete(`/bands/${bandId}`)
        .expect(204);
    });

    it("should return 404 for non-existent band", async () => {
      const response = await request(app).delete("/bands/99999").expect(404);
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
