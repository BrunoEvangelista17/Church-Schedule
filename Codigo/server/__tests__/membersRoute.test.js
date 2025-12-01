import request from "supertest";
import express from "express";
import membersRouter from "../routers/membersRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/members", membersRouter);

describe("Members Routes", () => {
  let memberId;

  describe("GET /members", () => {
    it("should return all members", async () => {
      const response = await request(app).get("/members").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /members/:id", () => {
    it("should return a member by id", async () => {
      const response = await request(app).get("/members/1").expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("telefone");
    });

    it("should return empty or 200 for non-existent member", async () => {
      const response = await request(app).get("/members/99999").expect(200);

      // Accept both empty array and null
      expect(
        response.body === null ||
          Array.isArray(response.body) ||
          !response.body.id
      ).toBe(true);
    });
  });

  describe("GET /members/levi", () => {
    it("should return members with louvor = true", async () => {
      const response = await request(app).get("/members/levi").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((member) => {
        expect(member.louvor).toBe(true);
      });
    });
  });

  describe("GET /members/name/:name", () => {
    it("should return members by name", async () => {
      const response = await request(app).get("/members/name/João").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /members/ministerio/:min", () => {
    it("should return members by ministerio", async () => {
      const response = await request(app)
        .get("/members/ministerio/louvor")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /members", () => {
    it("should create a new member", async () => {
      const newMember = {
        name: "Test Member",
        telefone: "(11) 98888-8888",
        diaconia: false,
        louvor: true,
        midia: false,
      };

      const response = await request(app)
        .post("/members")
        .send(newMember)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newMember.name);
      expect(response.body.telefone).toBe(newMember.telefone);
      memberId = response.body.id;
    });
  });

  describe("PUT /members/:id", () => {
    it("should update a member", async () => {
      if (!memberId) this.skip();

      const updatedData = {
        name: "Updated Member",
        telefone: "(11) 97777-7777",
        diaconia: true,
        louvor: false,
        midia: true,
      };

      const response = await request(app)
        .put(`/members/${memberId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.telefone).toBe(updatedData.telefone);
    });
  });

  describe("DELETE /members/deleteMember/:id", () => {
    it("should delete a member", async () => {
      if (!memberId) this.skip();

      const response = await request(app)
        .delete(`/members/deleteMember/${memberId}`)
        .expect(204);
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
