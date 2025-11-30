import request from "supertest";
import express from "express";
import levitasRouter from "../routers/levitasRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/levitas", levitasRouter);

describe("Levitas Routes", () => {
  let levitaId;

  describe("GET /levitas", () => {
    it("should return all member bands", async () => {
      const response = await request(app).get("/levitas").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("all member bands should have required fields", async () => {
      const response = await request(app).get("/levitas").expect(200);

      response.body.forEach((item) => {
        expect(item).toHaveProperty("idmember");
        expect(item).toHaveProperty("idband");
        expect(item).toHaveProperty("idroles");
      });
    });
  });

  describe("GET /levitas/:id", () => {
    it("should return member bands by band id", async () => {
      const response = await request(app).get("/levitas/1").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 404 for non-existent band", async () => {
      const response = await request(app).get("/levitas/99999").expect(404);
    });
  });

  describe("POST /levitas", () => {
    it("should create a new member band", async () => {
      const newMemberBand = {
        idMember: 1,
        idBand: 1,
        idRoles: 1,
      };

      const response = await request(app)
        .post("/levitas")
        .send(newMemberBand)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.idmember).toBe(newMemberBand.idMember);
      levitaId = response.body.id;
    });
  });

  describe("PUT /levitas/:id", () => {
    it("should update a member band", async () => {
      if (!levitaId) this.skip();

      const updatedData = {
        idMember: 2,
        idBand: 2,
        idRoles: 2,
      };

      const response = await request(app)
        .put(`/levitas/${levitaId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.idmember).toBe(updatedData.idMember);
    });

    it("should return 404 for non-existent entry", async () => {
      const response = await request(app)
        .put("/levitas/99999")
        .send({ idMember: 1, idBand: 1, idRoles: 1 })
        .expect(404);
    });
  });

  describe("DELETE /levitas/:id", () => {
    it("should delete a member band", async () => {
      if (!levitaId) this.skip();

      const response = await request(app)
        .delete(`/levitas/${levitaId}`)
        .expect(204);
    });

    it("should return 404 for non-existent entry", async () => {
      const response = await request(app).delete("/levitas/99999").expect(404);
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
