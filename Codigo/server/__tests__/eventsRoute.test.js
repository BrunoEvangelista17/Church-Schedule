import request from "supertest";
import express from "express";
import eventsRouter from "../routers/eventsRoute.js";
import connection from "../controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/events", eventsRouter);

describe("Events Routes", () => {
  let eventId;

  describe("GET /events", () => {
    it("should return all events", async () => {
      const response = await request(app).get("/events").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /events/:id", () => {
    it("should return an event by id", async () => {
      const response = await request(app).get("/events/1").expect(200);

      expect(response.body).toHaveProperty("id");
      // Accept both camelCase and snake_case
      expect(response.body.nameEvent || response.body.nameevent).toBeDefined();
      expect(response.body.dateEvent || response.body.dateevent).toBeDefined();
    });
  });

  describe("GET /events/eventId", () => {
    it("should return only event ids", async () => {
      const response = await request(app).get("/events/eventId").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((event) => {
        expect(event).toHaveProperty("id");
      });
    });
  });

  describe("POST /events", () => {
    it("should create a new event", async () => {
      const newEvent = {
        nameEvent: "Test Event",
        dateEvent: "2025-12-25",
        hourEvent: "18:00:00",
        typeEvent: "Culto",
        descEvent: "Evento de teste",
        preletor: "Pastor Test",
      };

      const response = await request(app)
        .post("/events")
        .send(newEvent)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.nameevent).toBe(newEvent.nameEvent);
      eventId = response.body.id;
    });
  });

  describe("PUT /events/:id", () => {
    it("should update an event", async () => {
      if (!eventId) return;

      const updatedEvent = {
        nameEvent: "Updated Event",
        dateEvent: "2025-12-26",
        hourEvent: "19:00:00",
        typeEvent: "Reunião",
        descEvent: "Evento atualizado",
        preletor: "Pastor Updated",
      };

      const response = await request(app)
        .put(`/events/${eventId}`)
        .send(updatedEvent)
        .expect(200);

      expect(response.body.nameevent).toBe(updatedEvent.nameEvent);
    });
  });

  describe("PATCH /events/:id/preletor", () => {
    it("should update preletor of an event", async () => {
      if (!eventId) return;

      const response = await request(app)
        .patch(`/events/${eventId}/preletor`)
        .send({ preletor: "Novo Preletor" })
        .expect(200);

      expect(response.body.preletor).toBe("Novo Preletor");
    });

    it("should fail without preletor", async () => {
      if (!eventId) return;

      const response = await request(app)
        .patch(`/events/${eventId}/preletor`)
        .send({})
        .expect(400);
    });
  });

  describe("DELETE /events/:id", () => {
    it("should delete an event", async () => {
      if (!eventId) return;

      const response = await request(app)
        .delete(`/events/${eventId}`)
        .expect(204);
    });
  });

  afterAll(async () => {
    await connection.end();
  });
});
