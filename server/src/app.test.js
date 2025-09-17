import { describe, it, expect } from "vitest";
const request = require("supertest");
const app = require("./app");

describe("GET /api/messages", () => {
  it("returns Hello, World!", async () => {
    const res = await request(app).get("/api/messages");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello, World!");
  });
});
